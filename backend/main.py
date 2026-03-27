"""
FastAPI entry point.
POST /chat  — accepts {messages, calendar_token?} and streams SSE back.
"""

import os
import json
from typing import Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
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


# ── SSE helpers ───────────────────────────────────────────────────────────────

def _sse(data: dict) -> str:
    return f"data: {json.dumps(data)}\n\n"


async def _stream_response(text: str):
    """Yield the response word-by-word as SSE chunks, then send [DONE]."""
    words = text.split(" ")
    for i in range(0, len(words), 3):
        chunk = " ".join(words[i : i + 3]) + " "
        yield _sse({"content": chunk})
    yield _sse({"content": ""})   # flush
    yield "data: [DONE]\n\n"


# ── Endpoint ──────────────────────────────────────────────────────────────────

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
    result: AgentState = await asyncio.get_event_loop().run_in_executor(
        None, lambda: graph.invoke(initial_state)
    )

    response_text = result.response or "I'm not sure how to help with that. Could you rephrase?"

    return StreamingResponse(
        _stream_response(response_text),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@app.get("/health")
def health():
    return {"status": "ok"}
