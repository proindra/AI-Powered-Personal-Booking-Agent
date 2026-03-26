from typing import TypedDict, Annotated, Sequence
import operator
from langchain_core.messages import BaseMessage

class AgentState(TypedDict):
    """
    Represents the state of our agent throughout LangGraph execution.
    """
    # Chat conversation history
    messages: Annotated[Sequence[BaseMessage], operator.add]
    
    # Processed intent variables
    intent: str
    booking_details: dict
    calendar_status: str
    alternative_slots: list
    
    # Output to present to user
    final_response: str
