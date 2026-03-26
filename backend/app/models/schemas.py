from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ChatRequest(BaseModel):
    message: str = Field(..., description="The user's message text")
    thread_id: str = Field(..., description="A unique identifier for the conversation thread to maintain state")

class ChatResponse(BaseModel):
    response: str = Field(..., description="The agent's reply")

class Event(BaseModel):
    id: Optional[str] = None
    title: str = Field(..., description="The title of the booking/event")
    start_time: datetime = Field(..., description="The start time of the event")
    end_time: datetime = Field(..., description="The end time of the event")
