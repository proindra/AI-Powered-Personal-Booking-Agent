"""
LangGraph booking agent using ReAct tool calling.

Graph flow:
  agent ↔ tools
"""

import json
import os
from typing import Optional

from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, ToolMessage
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode, tools_condition

from state import AgentState
from tools import check_availability, suggest_slots, add_to_google_calendar

# ── LLM setup ────────────────────────────────────────────────────────────────

_llm = None
_tools = [check_availability, suggest_slots, add_to_google_calendar]

def _get_llm():
    global _llm
    if _llm is not None:
        return _llm

    provider = os.getenv("LLM_PROVIDER", "openai").lower()
    openai_key = os.getenv("OPENAI_API_KEY", "")
    google_key = os.getenv("GOOGLE_API_KEY", "")

    if provider == "gemini" and google_key and not google_key.startswith("your_"):
        from langchain_google_genai import ChatGoogleGenerativeAI
        _llm = ChatGoogleGenerativeAI(
            model=os.getenv("GEMINI_MODEL", "gemini-1.5-flash"),
            google_api_key=google_key,
            temperature=0.2,
        ).bind_tools(_tools)
    elif openai_key and not openai_key.startswith("your_"):
        from langchain_openai import ChatOpenAI
        _llm = ChatOpenAI(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            temperature=0.2,
            api_key=openai_key,
        ).bind_tools(_tools)
    # else: returns None → nodes will use rule-based mock fallback
    return _llm


# ── System Prompt ────────────────────────────────────────────────────────────

_SYSTEM_PROMPT = """CORE IDENTITY:
You are the Executive Calendar Agent for this application. Your primary function is to bridge the gap between user intent and the Google Calendar API. You do not "pretend" to save events; you capture structured data to trigger real API calls.

YOUR TOOLS:
You have access to a tool called add_to_google_calendar. You must use this tool whenever a user expresses an intent to "schedule," "book," "remind," or "add" something to their calendar.

DATA COLLECTION REQUIREMENTS:
Before calling the API, you MUST have these 4 variables. If any are missing, ask the user immediately:
- Summary: (Title of the event)
- Date: (The specific day)
- Start Time: (The exact beginning of the event)
- Duration/End Time: (How long it lasts)

THE "ANTI-GRAVITY" WORKFLOW:
Step 1: Parse & Extract: When a user says "Add a meeting tomorrow at 4 PM," extract the date and time.
Step 2: Confirm Intent: Present a summary: "I've prepared a Google Calendar invite for [Event Name] on [Date] at [Time]. Should I sync this to your calendar now?"
Step 3: Execute Action: Upon confirmation ("Yes", "Do it", "Confirm"), immediately output a JSON tool call to add_to_google_calendar.
Constraint: Do not say "I have added it" until the API returns a status: 200 or success message.
Step 4: UI Sync Notification: Once the API confirms, notify the user: "Done! I've synced it. You can tap the Calendar Icon to see it in your project view."

STRICT RULES:
- No Ghost-Booking: Never tell the user an event is saved if the tool wasn't successfully called.
- Timezone Awareness: Always assume the user is in IST (India Standard Time) unless specified otherwise.
- Handle Conflicts: If the API returns a "Conflict," inform the user exactly what event is overlapping.

Today's date is: {today}
"""


# ── Node: Agent ──────────────────────────────────────────────────────────────

def call_model(state: AgentState) -> dict:
    llm = _get_llm()

    from datetime import date
    today_str = date.today().isoformat()

    # Convert raw dict messages into LangChain Message objects
    lc_messages = [SystemMessage(content=_SYSTEM_PROMPT.format(today=today_str))]
    for m in state.messages:
        if m["role"] == "user":
            lc_messages.append(HumanMessage(content=m["content"]))
        elif m["role"] == "assistant":
            # Pass along tool_calls if they exist in the message dict
            if "tool_calls" in m:
                lc_messages.append(AIMessage(content=m["content"] or "", tool_calls=m["tool_calls"]))
            else:
                lc_messages.append(AIMessage(content=m["content"]))
        elif m["role"] == "tool":
            lc_messages.append(ToolMessage(content=m["content"], tool_call_id=m["tool_call_id"]))

    if llm:
        response = llm.invoke(lc_messages)
        # We store the response in our dict format
        content_val = response.content
        if isinstance(content_val, list):
            content_val = " ".join([str(p.get("text", "")) for p in content_val if isinstance(p, dict) and "text" in p])
        elif not isinstance(content_val, str):
            content_val = str(content_val)

        msg = {"role": "assistant", "content": content_val}
        if hasattr(response, "tool_calls") and response.tool_calls:
            msg["tool_calls"] = response.tool_calls

        update_state = {
            "messages": [msg],
            "response": content_val if not (hasattr(response, "tool_calls") and response.tool_calls) else ""
        }

        # Check if booking was just confirmed or slots suggested
        if state.messages and state.messages[-1].get("role") == "tool":
            last_tool = state.messages[-1]
            try:
                res = json.loads(last_tool["content"])
                if last_tool.get("name") == "add_to_google_calendar":
                    if res.get("success"):
                        update_state["confirmed"] = True
                        update_state["calendar_event_id"] = res.get("event_id", "")
                elif last_tool.get("name") == "check_availability":
                    if "busy_slots" in res:
                        update_state["booked_slots"] = res["busy_slots"]
                elif last_tool.get("name") == "suggest_slots":
                    date_str = res.get("date")
                    dur = res.get("duration_minutes", 60)
                    if date_str and "free_slots" in res:
                        from datetime import datetime, timedelta, timezone
                        suggested = []
                        for t in res["free_slots"]:
                            dt = datetime.strptime(f"{date_str} {t}", "%Y-%m-%d %H:%M").replace(tzinfo=timezone.utc)
                            suggested.append({
                                "start": dt.isoformat(),
                                "end": (dt + timedelta(minutes=dur)).isoformat()
                            })
                        update_state["suggested_slots"] = suggested
            except Exception:
                pass

        return update_state
    else:
        # Mock fallback when no API key is configured
        user_message = state.messages[-1]["content"] if state.messages else ""
        lower = user_message.lower()
        import re
        from datetime import date, timedelta
        import uuid

        # Determine intent
        intent = "unknown"
        if any(w in lower for w in ("book", "schedule", "set up")):
            intent = "book"
        elif any(w in lower for w in ("reschedule", "move", "change")):
            intent = "reschedule"

        # Extract date
        new_date = state.date
        if "tomorrow" in lower:
            new_date = (date.today() + timedelta(days=1)).isoformat()
        elif "today" in lower:
            new_date = date.today().isoformat()
        else:
            m = re.search(r"(\d{4}-\d{2}-\d{2})", user_message)
            if m:
                new_date = m.group(1)

        # Extract time (e.g. "3pm", "15:00", "3:30 pm")
        new_time = state.time
        m = re.search(r"(\d{1,2})(?::(\d{2}))?\s*(am|pm)", lower)
        if m:
            hour = int(m.group(1))
            minute = int(m.group(2) or 0)
            if m.group(3) == "pm" and hour != 12:
                hour += 12
            elif m.group(3) == "am" and hour == 12:
                hour = 0
            new_time = f"{hour:02d}:{minute:02d}"
        else:
            m = re.search(r"(\d{2}):(\d{2})", user_message)
            if m:
                new_time = f"{m.group(1)}:{m.group(2)}"

        # Determine intent or preserve previous
        intent = state.intent
        if any(w in lower for w in ("book", "schedule", "set up")):
            intent = "book"
        elif any(w in lower for w in ("reschedule", "move", "change")):
            intent = "reschedule"

        # Check if the last message was a mock tool execution
        if state.messages and state.messages[-1].get("role") == "tool":
            last_tool = state.messages[-1]
            if last_tool.get("name") == "add_to_google_calendar":
                reply = f"✅ **Booking Confirmed**\n\n📅 Date: {new_date}\n⏰ Time: {new_time} UTC\n"
                return {
                    "messages": [{"role": "assistant", "content": reply}],
                    "response": reply,
                    "date": new_date,
                    "time": new_time,
                    "intent": intent,
                    "confirmed": True
                }

        # Check for tool call conditions first
        if intent == "book" and new_date and new_time:
            # Fake tool call to create booking
            tool_call_id = str(uuid.uuid4())
            return {
                "messages": [{
                    "role": "assistant",
                    "content": "",
                    "tool_calls": [{
                        "name": "add_to_google_calendar",
                        "args": {"title": "Mock Meeting", "date": new_date, "time": new_time, "duration_minutes": 60},
                        "id": tool_call_id
                    }]
                }],
                "intent": intent,
                "response": "",
                "date": new_date,
                "time": new_time
            }

        reply = "I can help with that! Could you clarify what you'd like to do?"
        if intent == "book":
            if new_date and not new_time:
                reply = "Got the date! What time works for you?"
            elif not new_date and new_time:
                reply = "Got the time! What date works for you?"
            else:
                reply = "Sure! What date and time would you like to book?"
        elif intent == "reschedule":
            reply = "Okay, let's reschedule. What is the new time and date?"

        return {
            "messages": [{"role": "assistant", "content": reply}],
            "response": reply,
            "date": new_date,
            "time": new_time,
            "intent": intent
        }


# ── Node: Tools Wrapper ──────────────────────────────────────────────────────

def call_tools(state: AgentState) -> dict:
    """Execute tool calls using LangGraph's native tool execution logic."""
    last_message = state.messages[-1]

    # Construct an AIMessage for ToolNode to process
    ai_msg = AIMessage(content=last_message.get("content", "") or "", tool_calls=last_message.get("tool_calls", []))

    # We use LangGraph's ToolNode for easy execution
    tool_node = ToolNode(_tools)

    # Call the ToolNode which returns a dict of {"messages": [ToolMessage, ...]}
    result = tool_node.invoke({"messages": [ai_msg]})

    # Convert LangChain ToolMessages back to our dict format
    new_messages = []
    for m in result["messages"]:
        new_messages.append({
            "role": "tool",
            "content": m.content,
            "name": getattr(m, "name", ""),
            "tool_call_id": m.tool_call_id
        })

    return {"messages": new_messages}


# ── Routing ───────────────────────────────────────────────────────────────────

def route_after_agent(state: AgentState) -> str:
    """Route to tools if tool_calls are present, otherwise END."""
    last_message = state.messages[-1]
    if "tool_calls" in last_message and last_message["tool_calls"]:
        return "tools"
    return END


# ── Build Graph ───────────────────────────────────────────────────────────────

def build_graph() -> StateGraph:
    g = StateGraph(AgentState)

    g.add_node("agent", call_model)
    g.add_node("tools", call_tools)

    g.set_entry_point("agent")

    g.add_conditional_edges("agent", route_after_agent, {
        "tools": "tools",
        END: END,
    })
    g.add_edge("tools", "agent")

    return g.compile()


graph = build_graph()
