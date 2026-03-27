"""
LangGraph booking agent.

Graph flow:
  detect_intent → check_calendar → [conflict_resolver | book] → respond
"""

import json
import os
from typing import Optional

from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import StateGraph, END

from state import AgentState
from tools import check_availability, suggest_slots, create_booking

# ── LLM setup ────────────────────────────────────────────────────────────────
# Supports OpenAI (default) or Google Gemini via env var LLM_PROVIDER=gemini

def _get_llm():
    provider = os.getenv("LLM_PROVIDER", "openai").lower()
    if provider == "gemini":
        from langchain_google_genai import ChatGoogleGenerativeAI
        return ChatGoogleGenerativeAI(
            model=os.getenv("GEMINI_MODEL", "gemini-1.5-flash"),
            google_api_key=os.getenv("GOOGLE_API_KEY"),
            temperature=0.2,
        )
    from langchain_openai import ChatOpenAI
    return ChatOpenAI(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        temperature=0.2,
        api_key=os.getenv("OPENAI_API_KEY"),
    )


llm = _get_llm()


# ── Node 1: Intent Detection ──────────────────────────────────────────────────

_INTENT_PROMPT = """You are a booking assistant. Extract intent and details from the user's latest message.

Return ONLY valid JSON with these fields:
{
  "intent": "book" | "reschedule" | "cancel" | "query" | "unknown",
  "title": "<meeting title or empty string>",
  "date": "<YYYY-MM-DD or empty string>",
  "time": "<HH:MM 24h or empty string>",
  "duration_minutes": <integer, default 60>,
  "participants": ["<email or name>", ...]
}

Today's date: {today}
Conversation so far: {history}
Latest user message: {user_message}"""


def detect_intent(state: AgentState) -> AgentState:
    user_message = next(
        (m["content"] for m in reversed(state.messages) if m["role"] == "user"), ""
    )
    history = "\n".join(f"{m['role']}: {m['content']}" for m in state.messages[:-1][-6:])

    from datetime import date
    prompt = _INTENT_PROMPT.format(
        today=date.today().isoformat(),
        history=history or "None",
        user_message=user_message,
    )

    try:
        raw = llm.invoke([SystemMessage(content=prompt)]).content
        # Strip markdown code fences if present
        raw = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        data = json.loads(raw)
    except Exception:
        data = {}

    return AgentState(
        **{
            **state.model_dump(),
            "intent": data.get("intent", "unknown"),
            "title": data.get("title", state.title),
            "date": data.get("date", state.date),
            "time": data.get("time", state.time),
            "duration_minutes": data.get("duration_minutes", state.duration_minutes),
            "participants": data.get("participants", state.participants),
        }
    )


# ── Node 2: Calendar Check ────────────────────────────────────────────────────

def check_calendar(state: AgentState) -> AgentState:
    if state.intent not in ("book", "reschedule") or not state.date or not state.time:
        return state

    calendar_token = os.getenv("CALENDAR_TOKEN")  # injected per-request in main.py
    result = check_availability(state.date, state.time, state.duration_minutes, calendar_token)

    return AgentState(**{**state.model_dump(), "conflict": not result["free"]})


# ── Node 3: Conflict Resolver ─────────────────────────────────────────────────

def conflict_resolver(state: AgentState) -> AgentState:
    calendar_token = os.getenv("CALENDAR_TOKEN")
    slots = suggest_slots(state.date, state.duration_minutes, calendar_token)

    slot_list = "\n".join(f"• {s}" for s in slots) if slots else "No free slots found that day."
    response = (
        f"⚠️ The slot at **{state.time}** on **{state.date}** is already taken.\n\n"
        f"Here are available alternatives:\n{slot_list}\n\n"
        "Which time works for you?"
    )
    return AgentState(**{**state.model_dump(), "available_slots": slots, "response": response})


# ── Node 4: Book ──────────────────────────────────────────────────────────────

def book(state: AgentState) -> AgentState:
    calendar_token = os.getenv("CALENDAR_TOKEN")
    title = state.title or "Connect Sphere Session"

    result = create_booking(
        title=title,
        date=state.date,
        time=state.time,
        duration_minutes=state.duration_minutes,
        participants=state.participants,
        calendar_token=calendar_token,
    )

    if result["success"]:
        link_line = f"\n🔗 [View in Calendar]({result['link']})" if result["link"] else ""
        participants_line = (
            f"\n👥 Participants: {', '.join(state.participants)}" if state.participants else ""
        )
        response = (
            f"✅ **Booking Confirmed for {title}**\n\n"
            f"📅 Date: {state.date}\n"
            f"⏰ Time: {state.time} UTC\n"
            f"⏱ Duration: {state.duration_minutes} min"
            f"{participants_line}"
            f"{link_line}"
        )
        return AgentState(
            **{
                **state.model_dump(),
                "confirmed": True,
                "calendar_event_id": result["event_id"],
                "response": response,
            }
        )
    else:
        return AgentState(
            **{
                **state.model_dump(),
                "response": f"❌ Booking failed: {result['error']}. Please try again.",
            }
        )


# ── Node 5: General Respond (query / unknown / missing info) ──────────────────

_RESPOND_PROMPT = """You are ConnectSphere's AI booking assistant. Be concise and helpful.
If booking details are missing (date, time), ask for them one at a time.
Current booking context: date={date}, time={time}, intent={intent}
Conversation: {history}"""


def respond(state: AgentState) -> AgentState:
    if state.response:
        return state  # already set by book/conflict nodes

    history = "\n".join(f"{m['role']}: {m['content']}" for m in state.messages[-8:])
    prompt = _RESPOND_PROMPT.format(
        date=state.date or "not set",
        time=state.time or "not set",
        intent=state.intent,
        history=history,
    )
    reply = llm.invoke([SystemMessage(content=prompt)]).content
    return AgentState(**{**state.model_dump(), "response": reply})


# ── Routing ───────────────────────────────────────────────────────────────────

def _route_after_calendar(state: AgentState) -> str:
    if state.intent in ("book", "reschedule") and state.date and state.time:
        return "conflict_resolver" if state.conflict else "book"
    return "respond"


def _route_after_intent(state: AgentState) -> str:
    if state.intent in ("book", "reschedule") and state.date and state.time:
        return "check_calendar"
    return "respond"


# ── Build Graph ───────────────────────────────────────────────────────────────

def build_graph() -> StateGraph:
    g = StateGraph(AgentState)

    g.add_node("detect_intent", detect_intent)
    g.add_node("check_calendar", check_calendar)
    g.add_node("conflict_resolver", conflict_resolver)
    g.add_node("book", book)
    g.add_node("respond", respond)

    g.set_entry_point("detect_intent")

    g.add_conditional_edges("detect_intent", _route_after_intent, {
        "check_calendar": "check_calendar",
        "respond": "respond",
    })
    g.add_conditional_edges("check_calendar", _route_after_calendar, {
        "conflict_resolver": "conflict_resolver",
        "book": "book",
        "respond": "respond",
    })
    g.add_edge("conflict_resolver", END)
    g.add_edge("book", END)
    g.add_edge("respond", END)

    return g.compile()


graph = build_graph()
