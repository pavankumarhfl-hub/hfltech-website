from __future__ import annotations

import json
import time
import uuid
from dataclasses import dataclass
from typing import Any, Callable, Protocol

from .approval import ApprovalGate, ApprovalRequest, DenyApproval
from .memory import InMemoryMemory, Memory
from .policy import DenyAllPolicy, Policy
from .providers import ChatResponse, Provider
from .tools import ToolRegistry


class TraceSink(Protocol):
    def write(self, event: "Event") -> None: ...


@dataclass(frozen=True)
class AgentConfig:
    system_prompt: str = "You are a careful, useful AI agent. Use tools only when needed."
    max_steps: int = 12
    timeout_seconds: float = 120.0
    tool_retries: int = 1
    retry_backoff_seconds: float = 0.1
    max_tool_result_chars: int = 12000
    dry_run: bool = False


@dataclass(frozen=True)
class Event:
    type: str
    data: dict[str, Any]
    timestamp: float

    def json(self) -> str:
        return json.dumps({"type": self.type, "timestamp": self.timestamp, **self.data}, sort_keys=True, default=str)


@dataclass(frozen=True)
class RunResult:
    run_id: str
    content: str
    events: tuple[Event, ...]
    steps: int


class Agent:
    def __init__(self, provider: Provider, tools: ToolRegistry | None = None, policy: Policy | None = None, memory: Memory | None = None, config: AgentConfig | None = None, approval: ApprovalGate | None = None, trace: TraceSink | None = None) -> None:
        self.provider = provider
        self.tools = tools or ToolRegistry()
        self.policy = policy or DenyAllPolicy()
        self.memory = memory or InMemoryMemory()
        self.config = config or AgentConfig()
        self.approval = approval or DenyApproval()
        self.trace = trace
        if self.config.max_steps < 1 or self.config.timeout_seconds <= 0 or self.config.tool_retries < 0:
            raise ValueError("invalid agent limits")
        if self.config.retry_backoff_seconds < 0 or self.config.max_tool_result_chars < 1:
            raise ValueError("invalid tool limits")

    def run(self, user_input: str, on_event: Callable[[Event], None] | None = None) -> RunResult:
        run_id = uuid.uuid4().hex
        events: list[Event] = []
        started = time.monotonic()
        messages: list[dict[str, Any]] = [{"role": "system", "content": self.config.system_prompt}]
        messages.extend(self.memory.messages())
        messages.append({"role": "user", "content": user_input})
        self.memory.add("user", user_input)

        def emit(kind: str, **data: Any) -> None:
            event = Event(kind, {"run_id": run_id, **data}, time.time())
            events.append(event)
            if self.trace:
                self.trace.write(event)
            if on_event:
                on_event(event)

        emit("run.started", input=user_input)
        for step in range(1, self.config.max_steps + 1):
            if time.monotonic() - started > self.config.timeout_seconds:
                emit("run.timeout", step=step)
                raise TimeoutError("agent timeout budget exceeded")
            emit("model.requested", step=step)
            response: ChatResponse = self.provider.complete(messages, self.tools.schemas())
            if not response.tool_calls:
                content = response.content
                self.memory.add("assistant", content)
                emit("run.completed", steps=step)
                return RunResult(run_id, content, tuple(events), step)

            messages.append({"role": "assistant", "content": response.content or None, "tool_calls": [{"id": c.id, "type": "function", "function": {"name": c.name, "arguments": json.dumps(c.arguments)}} for c in response.tool_calls]})
            for call in response.tool_calls:
                try:
                    tool = self.tools.get(call.name)
                except KeyError:
                    emit("tool.failed", step=step, tool=call.name, error="UnknownTool")
                    result = {"error": "unknown tool"}
                    messages.append({"role": "tool", "tool_call_id": call.id, "name": call.name, "content": json.dumps(result)})
                    continue
                allowed = self.policy.allow(tool.name, tool.dangerous)
                emit("tool.requested", step=step, tool=tool.name, allowed=allowed)
                if not allowed:
                    result = {"error": "tool denied by policy"}
                    emit("tool.denied", tool=tool.name, reason="policy")
                elif tool.dangerous and not self.config.dry_run:
                    approved = self.approval.approve(ApprovalRequest(run_id, tool.name, call.arguments, "dangerous tool execution"))
                    emit("tool.approval", tool=tool.name, approved=approved)
                    result = self._execute(tool, call.arguments, step, emit) if approved else {"error": "dangerous tool requires approval"}
                    if not approved:
                        emit("tool.denied", tool=tool.name, reason="approval")
                elif self.config.dry_run:
                    result = {"dry_run": True, "tool": tool.name, "arguments": call.arguments}
                    emit("tool.dry_run", tool=tool.name)
                else:
                    result = self._execute(tool, call.arguments, step, emit)
                serialized = json.dumps(result, default=str)
                if len(serialized) > self.config.max_tool_result_chars:
                    serialized = serialized[: self.config.max_tool_result_chars] + "… [truncated]"
                    emit("tool.result_truncated", tool=tool.name, limit=self.config.max_tool_result_chars)
                self.memory.add("tool", serialized)
                messages.append({"role": "tool", "tool_call_id": call.id, "name": tool.name, "content": serialized})
        emit("run.stopped", reason="step_limit")
        raise RuntimeError("agent step limit exceeded")

    def _execute(self, tool: Any, arguments: dict[str, Any], step: int, emit: Callable[..., None]) -> Any:
        last_error: Exception | None = None
        for attempt in range(self.config.tool_retries + 1):
            try:
                emit("tool.started", step=step, tool=tool.name, attempt=attempt + 1)
                value = tool.invoke(arguments)
                emit("tool.completed", step=step, tool=tool.name, attempt=attempt + 1)
                return value
            except Exception as exc:
                last_error = exc
                emit("tool.failed", step=step, tool=tool.name, attempt=attempt + 1, error=type(exc).__name__)
                if attempt < self.config.tool_retries and self.config.retry_backoff_seconds:
                    delay = min(self.config.retry_backoff_seconds * (2 ** attempt), max(0.0, self.config.timeout_seconds / 4))
                    time.sleep(delay)
        return {"error": f"tool execution failed: {type(last_error).__name__}"}
