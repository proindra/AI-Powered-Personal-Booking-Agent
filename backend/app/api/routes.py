from fastapi import APIRouter, HTTPException
from typing import Dict
from langchain_core.messages import HumanMessage, AIMessage

from app.models.schemas import ChatRequest, ChatResponse
from app.agents.graph import agent_graph

router = APIRouter()

# Simple in-memory dictionary to hold thread conversational state.
# For production, replace this with a persistent store (e.g., Redis, PostgreSQL).
THREAD_MEMORY: Dict[str, dict] = {}

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        thread_id = request.thread_id
        
        # Initialize thread if missing
        if thread_id not in THREAD_MEMORY:
            THREAD_MEMORY[thread_id] = {"messages": []}
            
        current_state = THREAD_MEMORY[thread_id]
        
        # Append the new message to history
        current_state["messages"].append(HumanMessage(content=request.message))
        
        # Prepare input for LangGraph
        state_input = {"messages": current_state["messages"]}
        
        # Invoke the Graph
        result = agent_graph.invoke(state_input)
        
        # The agent's final text response
        agent_reply = result.get("final_response", "Sorry, I had trouble processing that request.")
        
        # Save back the messages including the new AI response
        # To maintain context in multi-turn conversations
        THREAD_MEMORY[thread_id]["messages"].append(AIMessage(content=agent_reply))
        
        return ChatResponse(response=agent_reply)
        
    except Exception as e:
        print(f"Error executing agent graph: {e}")
        raise HTTPException(status_code=500, detail="Internal agent processing error.")
