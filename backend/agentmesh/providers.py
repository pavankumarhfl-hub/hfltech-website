from __future__ import annotations

import json
import os
import urllib.request
from dataclasses import dataclass, field
from typing import Any, Protocol, Iterator


@dataclass(frozen=True)
class ToolCall:
    id: str
    name: str
    arguments: dict[str, Any]


@dataclass(frozen=True)
class ChatMessage:
    role: str
    content: str


@dataclass(frozen=True)
class ChatResponse:
    content: str = ""
    tool_calls: tuple[ToolCall, ...] = ()
    raw: dict[str, Any] = field(default_factory=dict)


class Provider(Protocol):
    def complete(self, messages: list[dict[str, Any]], tools: list[dict[str, Any]]) -> ChatResponse: ...


class OpenAICompatibleProvider:
    """OpenAI-compatible chat client. Works with hosted APIs and local servers."""
    def __init__(self, model: str, base_url: str = "https://api.openai.com/v1", api_key: str | None = None, timeout: float = 60.0, require_key: bool = True) -> None:
        self.model, self.base_url, self.api_key, self.timeout = model, base_url.rstrip("/"), api_key or os.getenv("OPENAI_API_KEY"), timeout
        if require_key and not self.api_key:
            raise ValueError("API key is required")

    def _request(self, body: dict[str, Any]):
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        req = urllib.request.Request(f"{self.base_url}/chat/completions", data=json.dumps(body).encode(), headers=headers, method="POST")
        return urllib.request.urlopen(req, timeout=self.timeout)

    def complete(self, messages: list[dict[str, Any]], tools: list[dict[str, Any]]) -> ChatResponse:
        body: dict[str, Any] = {"model": self.model, "messages": messages}
        if tools:
            body["tools"] = tools
            body["tool_choice"] = "auto"
        with self._request(body) as response:
            data = json.loads(response.read())
        msg = data["choices"][0]["message"]
        calls = tuple(ToolCall(c["id"], c["function"]["name"], json.loads(c["function"].get("arguments") or "{}")) for c in msg.get("tool_calls", []))
        return ChatResponse(msg.get("content") or "", calls, data)

    def stream(self, messages: list[dict[str, Any]]) -> Iterator[str]:
        body = {"model": self.model, "messages": messages, "stream": True}
        with self._request(body) as response:
            for raw in response:
                line = raw.decode("utf-8", "replace").strip()
                if not line.startswith("data:"):
                    continue
                payload = line[5:].strip()
                if payload == "[DONE]":
                    break
                try:
                    data = json.loads(payload)
                    delta = data.get("choices", [{}])[0].get("delta", {}).get("content")
                    if delta:
                        yield delta
                except json.JSONDecodeError:
                    continue


class LocalOpenAIProvider(OpenAICompatibleProvider):
    """Local OpenAI-compatible inference, e.g. Ollama, vLLM or llama.cpp."""
    def __init__(self, model: str | None = None, base_url: str | None = None, timeout: float = 120.0) -> None:
        super().__init__(model or os.getenv("AGENTMESH_MODEL", "qwen3:8b"), base_url or os.getenv("AGENTMESH_BASE_URL", "http://127.0.0.1:11434/v1"), api_key=os.getenv("AGENTMESH_API_KEY"), timeout=timeout, require_key=False)


class ScriptedProvider:
    """Deterministic provider useful for tests, examples, and offline development."""
    def __init__(self, responses: list[ChatResponse]) -> None:
        self.responses = list(responses)
        self.calls = 0

    def complete(self, messages: list[dict[str, Any]], tools: list[dict[str, Any]]) -> ChatResponse:
        if self.calls >= len(self.responses):
            raise RuntimeError("scripted provider exhausted")
        response = self.responses[self.calls]
        self.calls += 1
        return response
