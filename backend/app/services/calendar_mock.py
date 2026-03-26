from datetime import datetime, timedelta, date
from typing import List
from app.models.schemas import Event
import uuid

class MockCalendarService:
    def __init__(self):
        self.events: List[Event] = []
        self._seed_mock_events()

    def _seed_mock_events(self):
        """Seeds the calendar with a mock event for conflict testing."""
        now = datetime.now()
        # Create a mock busy slot for tomorrow at 2:00 PM for 1 hour
        tomorrow = now + timedelta(days=1)
        busy_start = datetime(tomorrow.year, tomorrow.month, tomorrow.day, 14, 0)
        busy_end = busy_start + timedelta(hours=1)
        
        self.events.append(
            Event(
                id=str(uuid.uuid4()),
                title="Existing Busy Schedule",
                start_time=busy_start,
                end_time=busy_end
            )
        )

    def check_availability(self, start_time: datetime, end_time: datetime) -> bool:
        """Returns True if the requested time slot is completely free."""
        for event in self.events:
            # Overlap condition: Request starts before event ends AND request ends after event starts
            if (start_time < event.end_time) and (end_time > event.start_time):
                return False
        return True

    def get_events_for_date(self, target_date: date) -> List[Event]:
        """Returns all events on a given date to help LangGraph reason about availability."""
        return [e for e in self.events if e.start_time.date() == target_date]

    def book_event(self, title: str, start_time: datetime, end_time: datetime) -> Event:
        """Attempts to book a slot. Raises ValueError if there is a conflict."""
        if not self.check_availability(start_time, end_time):
            raise ValueError(f"Time slot from {start_time} to {end_time} is not available due to conflicts.")
            
        new_event = Event(
            id=str(uuid.uuid4()),
            title=title,
            start_time=start_time,
            end_time=end_time
        )
        self.events.append(new_event)
        return new_event

# Instantiate a singleton to act as our centralized database for this demo
calendar_mock = MockCalendarService()
