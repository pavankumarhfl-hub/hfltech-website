from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol


@dataclass(frozen=True)
class ApprovalRequest:
    run_id: str
    tool: str
    arguments: dict
    reason: str = ""


class ApprovalGate(Protocol):
    def approve(self, request: ApprovalRequest) -> bool: ...


@dataclass(frozen=True)
class DenyApproval:
    def approve(self, request: ApprovalRequest) -> bool:
        return False


@dataclass(frozen=True)
class AllowApproval:
    def approve(self, request: ApprovalRequest) -> bool:
        return True
