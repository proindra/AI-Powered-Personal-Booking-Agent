from typing import Annotated, Literal
from pydantic import BaseModel
import operator


class AgentState(BaseModel):
    """Shared state that flows through every node in the LangGraph."""

    # Conversation history: list of {"role": "user"|"assistant"|"tool", "content": "..."}
    messages: Annotated[list[dict], operator.add] = []

    # Extracted intent from the latest user message
    intent: Literal["book", "reschedule", "cancel", "query", "unknown"] = "unknown"

    # Parsed booking details (may be partial — agent asks follow-ups)
    date: str = ""          # e.g. "2026-08-22"
    time: str = ""          # e.g. "17:00"
    duration_minutes: int = 60
    participants: list[str] = []
    title: str = ""

    # Results from calendar tool
    available_slots: list[str] = []
    booked_slots: list[dict] = []     # [{'start': '...', 'end': '...'}, ...]
    suggested_slots: list[dict] = []  # [{'start': '...', 'end': '...'}, ...]
    conflict: bool = False

    # Set to True once a booking is successfully created
    confirmed: bool = False
    calendar_event_id: str = ""

    # The final reply to stream back to the frontend
    response: str = ""
