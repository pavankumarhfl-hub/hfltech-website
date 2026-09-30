from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol


class Policy(Protocol):
    def allow(self, tool_name: str, dangerous: bool) -> bool: ...


@dataclass(frozen=True)
class DenyAllPolicy:
    def allow(self, tool_name: str, dangerous: bool) -> bool:
        return False


@dataclass(frozen=True)
class AllowListPolicy:
    allowed_tools: frozenset[str]
    allow_dangerous: bool = False

    def allow(self, tool_name: str, dangerous: bool) -> bool:
        return tool_name in self.allowed_tools and (not dangerous or self.allow_dangerous)
