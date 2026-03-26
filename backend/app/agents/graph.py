from langgraph.graph import StateGraph, END
from app.agents.state import AgentState
from app.agents.nodes import (
    extract_intent,
    check_calendar,
    handle_conflict,
    confirm_booking,
    general_chat,
    request_more_info
)

# Routing Logic Functions
def route_intent(state: AgentState):
    intent = state.get("intent")
    if intent == "book_meeting":
        return "check_calendar"
    elif intent == "needs_more_info":
        return "request_more_info"
    else:
        return "general_chat"

def route_calendar(state: AgentState):
    status = state.get("calendar_status")
    if status == "free":
        return "confirm_booking"
    elif status == "busy":
        return "handle_conflict"
    else:
        return "request_more_info"

# 1. Initialize Graph
graph_builder = StateGraph(AgentState)

# 2. Add computation nodes
graph_builder.add_node("extract_intent", extract_intent)
graph_builder.add_node("check_calendar", check_calendar)
graph_builder.add_node("handle_conflict", handle_conflict)
graph_builder.add_node("confirm_booking", confirm_booking)
graph_builder.add_node("general_chat", general_chat)
graph_builder.add_node("request_more_info", request_more_info)

# 3. Define Entry Point
graph_builder.set_entry_point("extract_intent")

# 4. Define Edges (flow map)
# Conditional routing off of initial parsing
graph_builder.add_conditional_edges(
    "extract_intent",
    route_intent,
    {
        "check_calendar": "check_calendar",
        "request_more_info": "request_more_info",
        "general_chat": "general_chat",
    }
)

# Conditional routing off calendar availability checks
graph_builder.add_conditional_edges(
    "check_calendar",
    route_calendar,
    {
        "confirm_booking": "confirm_booking",
        "handle_conflict": "handle_conflict",
        "request_more_info": "request_more_info",
    }
)

# Define Terminal paths (all exit routes end execution)
graph_builder.add_edge("confirm_booking", END)
graph_builder.add_edge("handle_conflict", END)
graph_builder.add_edge("general_chat", END)
graph_builder.add_edge("request_more_info", END)

# 5. Compile the graph
agent_graph = graph_builder.compile()
