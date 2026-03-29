"""
Agent tools: Calendar Checker, Slot Generator, Booking Tool.
Uses Google Calendar API when a token is provided; falls back to mock data.
"""

import os
from datetime import datetime, timedelta, timezone
from typing import Optional, List

from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from langchain_core.tools import tool


# ── Helpers ──────────────────────────────────────────────────────────────────

def _calendar_service(token: str):
    creds = Credentials(token=token)
    return build("calendar", "v3", credentials=creds, cache_discovery=False)


def _iso(dt: datetime) -> str:
    return dt.isoformat()


def _parse_datetime(date: str, time: str) -> Optional[datetime]:
    """Parse 'YYYY-MM-DD' + 'HH:MM' into a timezone-aware datetime (UTC)."""
    try:
        dt = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")
        return dt.replace(tzinfo=timezone.utc)
    except ValueError:
        return None


# ── Tool 1: Calendar Checker ──────────────────────────────────────────────────

@tool
def check_availability(
    date: str,
    time: str,
    duration_minutes: int = 60,
) -> dict:
    """
    Check if a time slot is free.
    date: Date in YYYY-MM-DD format
    time: Time in HH:MM format (24-hour)
    duration_minutes: Duration of the meeting in minutes
    Returns {"free": bool, "conflict_summary": str}
    """
    calendar_token = os.getenv("CALENDAR_TOKEN")
    start = _parse_datetime(date, time)
    if not start:
        return {"free": False, "conflict_summary": "Could not parse date/time."}

    end = start + timedelta(minutes=duration_minutes)

    if not calendar_token:
        # Mock: treat 9 AM and 2 PM as busy for demo purposes
        busy_hours = {9, 14}
        is_busy = start.hour in busy_hours
        
        # Mock 48h busy slots (just pad the current day's busy hours)
        now_dt = datetime.now(timezone.utc)
        mock_busy = []
        for d in range(2):
            for bh in busy_hours:
                bh_start = (now_dt + timedelta(days=d)).replace(hour=bh, minute=0, second=0)
                bh_end = bh_start + timedelta(hours=1)
                mock_busy.append({"start": _iso(bh_start), "end": _iso(bh_end)})

        return {
            "free": not is_busy,
            "conflict_summary": f"Mock: {'Busy' if is_busy else 'Free'} at {time} on {date}.",
            "busy_slots": mock_busy,
        }

    try:
        service = _calendar_service(calendar_token)
        # Fetch the specific slot for the agent
        slot_body = {
            "timeMin": _iso(start),
            "timeMax": _iso(end),
            "items": [{"id": "primary"}],
        }
        slot_result = service.freebusy().query(body=slot_body).execute()
        busy_slot = slot_result["calendars"]["primary"]["busy"]

        # Fetch the 48-hour window for the UI timeline widget
        now_dt = datetime.now(timezone.utc)
        timeline_body = {
            "timeMin": _iso(now_dt),
            "timeMax": _iso(now_dt + timedelta(hours=48)),
            "items": [{"id": "primary"}],
        }
        timeline_result = service.freebusy().query(body=timeline_body).execute()
        busy_48h = timeline_result["calendars"]["primary"].get("busy", [])

        return {
            "free": len(busy_slot) == 0,
            "conflict_summary": f"Busy periods: {busy_slot}" if busy_slot else "Slot is free.",
            "busy_slots": busy_48h,
        }
    except Exception as e:
        return {"free": False, "conflict_summary": f"Calendar API error: {e}", "busy_slots": []}


# ── Tool 2: Slot Generator ────────────────────────────────────────────────────

@tool
def suggest_slots(
    date: str,
    duration_minutes: int = 60,
    num_suggestions: int = 3,
) -> dict:
    """
    Return up to `num_suggestions` free time slots on `date`.
    Checks every hour from 9 AM to 6 PM.
    date: Date in YYYY-MM-DD format
    """
    calendar_token = os.getenv("CALENDAR_TOKEN")
    candidate_hours = range(9, 18)
    free_slots: list[str] = []

    for hour in candidate_hours:
        t = f"{hour:02d}:00"
        # Since check_availability is a Tool, we must call it directly or through its func
        result = check_availability.invoke({"date": date, "time": t, "duration_minutes": duration_minutes})
        if result["free"]:
            free_slots.append(t)
        if len(free_slots) >= num_suggestions:
            break

    return {"date": date, "duration_minutes": duration_minutes, "free_slots": free_slots}


# ── Tool 3: Booking Tool ──────────────────────────────────────────────────────

@tool
def add_to_google_calendar(
    title: str,
    date: str,
    time: str,
    duration_minutes: int = 60,
    participants: Optional[List[str]] = None,
) -> dict:
    """
    Create a calendar event.
    title: Title of the meeting
    date: Date in YYYY-MM-DD format
    time: Time in HH:MM format (24-hour)
    duration_minutes: Duration of the meeting in minutes
    participants: List of participant emails
    Returns {"success": bool, "event_id": str, "link": str, "error": str}
    """
    calendar_token = os.getenv("CALENDAR_TOKEN")
    if participants is None:
        participants = []
    start = _parse_datetime(date, time)
    if not start:
        return {"success": False, "event_id": "", "link": "", "error": "Invalid date/time."}

    end = start + timedelta(minutes=duration_minutes)

    if not calendar_token:
        # Mock booking
        mock_id = f"mock_{date}_{time.replace(':', '')}".replace("-", "")
        return {
            "success": True,
            "event_id": mock_id,
            "link": "",
            "error": "",
        }

    try:
        service = _calendar_service(calendar_token)
        event_body = {
            "summary": title,
            "start": {"dateTime": _iso(start), "timeZone": "UTC"},
            "end": {"dateTime": _iso(end), "timeZone": "UTC"},
            "attendees": [{"email": p} for p in participants if "@" in p],
        }
        event = service.events().insert(calendarId="primary", body=event_body).execute()
        return {
            "success": True,
            "event_id": event.get("id", ""),
            "link": event.get("htmlLink", ""),
            "error": "",
        }
    except Exception as e:
        return {"success": False, "event_id": "", "link": "", "error": str(e)}
