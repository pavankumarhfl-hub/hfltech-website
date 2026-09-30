from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


class Memory:
    def add(self, role: str, content: str) -> None: raise NotImplementedError
    def messages(self) -> list[dict[str, str]]: raise NotImplementedError


@dataclass
class InMemoryMemory(Memory):
    max_messages: int = 50
    _items: list[dict[str, str]] = field(default_factory=list)

    def add(self, role: str, content: str) -> None:
        self._items.append({"role": role, "content": content})
        if len(self._items) > self.max_messages:
            del self._items[: len(self._items) - self.max_messages]

    def messages(self) -> list[dict[str, str]]:
        return list(self._items)
