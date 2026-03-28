"""
FastAPI entry point.
POST /chat  — accepts {messages, calendar_token?} and streams SSE back.
"""

import os
import json
from typing import Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

from agent import graph
from state import AgentState

app = FastAPI(title="ConnectSphere Booking Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten in production
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


# ── Request / Response schemas ────────────────────────────────────────────────

class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[Message]
    calendar_token: Optional[str] = None  # forwarded from frontend if user granted calendar access




@app.post("/chat")
async def chat(req: ChatRequest):
    # Inject calendar token into env so tools can pick it up (simple approach)
    if req.calendar_token:
        os.environ["CALENDAR_TOKEN"] = req.calendar_token
    else:
        os.environ.pop("CALENDAR_TOKEN", None)

    initial_state = AgentState(
        messages=[m.model_dump() for m in req.messages]
    )

    # Run the graph (synchronous compile — wrap in thread for async)
    import asyncio
    result = await asyncio.get_event_loop().run_in_executor(
        None, lambda: graph.invoke(initial_state)
    )

    # Note: graph.invoke returns a dict representing the state if state is a dict,
    # but here our state is pydantic-based, but langgraph returns a dict of the final state
    # Wait, let's safely access the response field.
    if isinstance(result, dict):
        response_text = result.get("response", "")
    else:
        response_text = getattr(result, "response", "")

    response_text = response_text or "I'm not sure how to help with that. Could you rephrase?"

    try:
        state_dict = result if isinstance(result, dict) else result.model_dump()
    except Exception:
        state_dict = {}

    return JSONResponse(content={
        "response": response_text,
        "state": state_dict
    })


@app.get("/health")
def health():
    return {"status": "ok"}
