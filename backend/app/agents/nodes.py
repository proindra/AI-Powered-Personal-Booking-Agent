from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from datetime import datetime
import json
import os

from app.agents.state import AgentState
from app.services.calendar_mock import calendar_mock

# Initialize global LLM model mapping to OpenAI
# Warning: Ensure OPENAI_API_KEY is in your environment
def get_llm():
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key or api_key == "your_openai_api_key_here":
        raise ValueError("OPENAI_API_KEY is missing. Please set it in the .env file.")
    return ChatOpenAI(model="gpt-4o-mini", temperature=0, api_key=api_key)

def extract_intent(state: AgentState) -> AgentState:
    """Analyzes the user's message to find booking intents using strict JSON."""
    messages = state.get("messages", [])
    if not messages:
        return {"intent": "chit_chat", "booking_details": {}}
        
    latest_msg = messages[-1].content
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a scheduling assistant. Extract scheduling intent.
        Current datetime: {current_time}
        Respond ONLY in valid JSON. Do not include markdown formatting like ```json.
        Schema:
        {{
            "intent": "book_meeting" | "chit_chat" | "needs_more_info",
            "booking_details": {{
                "title": "name of meeting. default to 'Meeting'",
                "start_time": "ISO 8601 string or null",
                "end_time": "ISO 8601 string or null"
            }}
        }}
        If the intent is to schedule but the time is vague, return needs_more_info.
        """),
        ("user", "{message}")
    ])
    
    chain = prompt | get_llm()
    res = chain.invoke({
        "current_time": datetime.now().isoformat(),
        "message": latest_msg
    })
    
    try:
        raw_content = res.content.strip().replace("```json", "").replace("```", "")
        parsed = json.loads(raw_content)
        return {
            "intent": parsed.get("intent", "chit_chat"),
            "booking_details": parsed.get("booking_details", {})
        }
    except Exception as e:
        print(f"Error parsing intent JSON: {e}")
        return {"intent": "chit_chat", "booking_details": {}}

def check_calendar(state: AgentState) -> AgentState:
    """Interfaces with our mocked Google Calendar to verify free slots."""
    details = state.get("booking_details", {})
    start_str = details.get("start_time")
    end_str = details.get("end_time")
    
    if not start_str or not end_str:
        return {"calendar_status": "missing_info"}
        
    try:
        start_time = datetime.fromisoformat(start_str.replace('Z', '+00:00'))
        end_time = datetime.fromisoformat(end_str.replace('Z', '+00:00'))
        
        is_free = calendar_mock.check_availability(start_time, end_time)
        if is_free:
            return {"calendar_status": "free"}
        else:
            events = calendar_mock.get_events_for_date(start_time.date())
            return {
                "calendar_status": "busy", 
                "alternative_slots": [e.model_dump() for e in events]
            }
    except Exception as e:
        print(f"Calendar check exception: {e}")
        return {"calendar_status": "error"}

def handle_conflict(state: AgentState) -> AgentState:
    """Queries the LLM to suggest alternatives since the requested slot is busy."""
    slots = state.get("alternative_slots", [])
    prompt = ChatPromptTemplate.from_messages([
        ("system", "The user wanted to book a slot that is busy. We found these existing events spanning that day: {events}. Propose a friendly alternative time based on what is available. Do not mention 'events array' literally."),
        ("user", "My desired time is not available. What else works?")
    ])
    
    res = (prompt | get_llm()).invoke({"events": json.dumps(slots, default=str)})
    return {"final_response": res.content}

def confirm_booking(state: AgentState) -> AgentState:
    """Writes the new event block directly to the mock calendar and confirms."""
    details = state.get("booking_details", {})
    title = details.get("title", "Meeting")
    start_str = details.get("start_time")
    end_str = details.get("end_time")
    
    try:
        start_time = datetime.fromisoformat(start_str.replace('Z', '+00:00'))
        end_time = datetime.fromisoformat(end_str.replace('Z', '+00:00'))
        
        new_event = calendar_mock.book_event(title, start_time, end_time)
        msg = f"Got it! I've successfully booked '{new_event.title}' starting at {new_event.start_time.strftime('%I:%M %p')} on {new_event.start_time.strftime('%b %d')}."
        return {"final_response": msg}
    except Exception as e:
        return {"final_response": f"I hit a snag trying to book that: {e}"}

def general_chat(state: AgentState) -> AgentState:
    """Standard conversational response when no explicit scheduling intent exists."""
    messages = state.get("messages", [])
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a helpful personal assistant specializing in scheduling."),
        ("placeholder", "{messages}")
    ])
    
    res = (prompt | get_llm()).invoke({"messages": messages})
    return {"final_response": res.content}

def request_more_info(state: AgentState) -> AgentState:
    """Fall back prompt when intent is recognized but details are missing."""
    return {"final_response": "I can help with that! What date and time are you looking to schedule this for?"}
