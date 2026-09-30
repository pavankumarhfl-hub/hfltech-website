from __future__ import annotations

import inspect
from dataclasses import dataclass
from typing import Any, Callable

from .schema import validate_arguments


@dataclass(frozen=True)
class Tool:
    name: str
    description: str
    fn: Callable[..., Any]
    parameters: dict[str, Any]
    dangerous: bool = False

    def schema(self) -> dict[str, Any]:
        return {"type": "function", "function": {"name": self.name, "description": self.description, "parameters": self.parameters}}

    def invoke(self, arguments: dict[str, Any]) -> Any:
        errors = validate_arguments(self.parameters, arguments)
        if errors:
            raise ValueError("; ".join(f"{e.path}: {e.message}" for e in errors))
        sig = inspect.signature(self.fn)
        allowed = set(sig.parameters)
        unknown = set(arguments) - allowed
        if unknown:
            raise ValueError(f"unknown tool arguments: {sorted(unknown)}")
        return self.fn(**arguments)


class ToolRegistry:
    def __init__(self) -> None:
        self._tools: dict[str, Tool] = {}

    def register(self, tool: Tool) -> None:
        if not tool.name or tool.name in self._tools:
            raise ValueError(f"invalid or duplicate tool: {tool.name!r}")
        self._tools[tool.name] = tool

    def get(self, name: str) -> Tool:
        try:
            return self._tools[name]
        except KeyError as exc:
            raise KeyError(f"unknown tool: {name}") from exc

    def schemas(self) -> list[dict[str, Any]]:
        return [t.schema() for t in self._tools.values()]

    def names(self) -> list[str]:
        return list(self._tools)
