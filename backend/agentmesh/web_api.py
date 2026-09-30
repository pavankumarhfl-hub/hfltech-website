from __future__ import annotations

import os
import time
import uuid
from collections import deque
from threading import Lock
from typing import Any

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from .memory import InMemoryMemory
from .policy import DenyAllPolicy
from .providers import OpenAICompatibleProvider
from .runtime import Agent, AgentConfig
from .tools import ToolRegistry

APP_NAME = "AgentMesh API"
ALLOWED_ORIGINS = [x.strip() for x in os.getenv("AGENTMESH_ALLOWED_ORIGINS", "https://hfltech.in,https://www.hfltech.in").split(",") if x.strip()]
MODEL = os.getenv("AGENTMESH_MODEL", "gpt-5.6-luna")
BASE_URL = os.getenv("AGENTMESH_BASE_URL", "https://api.openai.com/v1")
SYSTEM_PROMPT = os.getenv(
    "AGENTMESH_SYSTEM_PROMPT",
    "You are Flush, the primary AI agent of AgentMesh by HFL Tech. Be accurate, direct, useful and transparent about uncertainty. Do not claim to have performed actions or accessed information you did not actually access.",
)

app = FastAPI(title=APP_NAME, version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "X-Session-ID"],
)

_sessions: dict[str, InMemoryMemory] = {}
_sessions_lock = Lock()
_rate: dict[str, deque[float]] = {}
_rate_lock = Lock()


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=12000)


def _check_rate_limit(client_id: str) -> None:
    limit = max(1, int(os.getenv("AGENTMESH_RATE_LIMIT", "20")))
    window = 60.0
    now = time.time()
    with _rate_lock:
        bucket = _rate.setdefault(client_id, deque())
        while bucket and now - bucket[0] > window:
            bucket.popleft()
        if len(bucket) >= limit:
            raise HTTPException(status_code=429, detail="Rate limit exceeded. Please try again shortly.")
        bucket.append(now)


def _memory(session_id: str) -> InMemoryMemory:
    with _sessions_lock:
        return _sessions.setdefault(session_id, InMemoryMemory())


def _agent(session_id: str) -> Agent:
    api_key = os.getenv("OPENAI_API_KEY") or os.getenv("AGENTMESH_API_KEY")
    if not api_key and "api.openai.com" in BASE_URL:
        raise HTTPException(status_code=503, detail="AgentMesh model provider is not configured.")
    provider = OpenAICompatibleProvider(
        MODEL,
        BASE_URL,
        api_key=api_key,
        timeout=float(os.getenv("AGENTMESH_MODEL_TIMEOUT", "120")),
        require_key="api.openai.com" in BASE_URL,
    )
    return Agent(
        provider,
        ToolRegistry(),
        DenyAllPolicy(),
        memory=_memory(session_id),
        config=AgentConfig(system_prompt=SYSTEM_PROMPT, max_steps=8, timeout_seconds=120),
    )


@app.get("/health")
def health() -> dict[str, Any]:
    return {"ok": True, "service": APP_NAME, "model": MODEL}


@app.post("/v1/chat")
def chat(payload: ChatRequest, request: Request) -> dict[str, Any]:
    client_id = request.client.host if request.client else "unknown"
    _check_rate_limit(client_id)
    session_id = request.headers.get("X-Session-ID") or uuid.uuid4().hex
    result = _agent(session_id).run(payload.message)
    return {
        "session_id": session_id,
        "run_id": result.run_id,
        "content": result.content,
        "steps": result.steps,
    }


@app.post("/v1/chat/stream")
def chat_stream(payload: ChatRequest, request: Request) -> StreamingResponse:
    client_id = request.client.host if request.client else "unknown"
    _check_rate_limit(client_id)
    session_id = request.headers.get("X-Session-ID") or uuid.uuid4().hex

    # AgentMesh performs the actual model run first. The response is then emitted
    # as SSE chunks so the browser can render progressively without exposing the
    # model provider key. This is intentionally not described as token streaming.
    result = _agent(session_id).run(payload.message)

    def events():
        chunk_size = 48
        for i in range(0, len(result.content), chunk_size):
            chunk = result.content[i:i + chunk_size].replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")
            yield f'data: {{"type":"delta","text":"{chunk}"}}\\n\\n'
        yield f'data: {{"type":"done","session_id":"{session_id}","run_id":"{result.run_id}"}}\\n\\n'

    return StreamingResponse(events(), media_type="text/event-stream", headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})
