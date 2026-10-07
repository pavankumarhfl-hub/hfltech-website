from __future__ import annotations

import hashlib
import hmac
import json
import os
import re
import secrets
import time
import uuid
from collections import deque
from threading import Lock
from typing import Any
from urllib.parse import urlencode
from urllib.request import Request as UrlRequest, urlopen

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
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "").strip()
SYSTEM_PROMPT = os.getenv(
    "AGENTMESH_SYSTEM_PROMPT",
    "You are AgentMesh, the primary AI agent platform of HFL Tech. Be accurate, direct, useful and transparent about uncertainty. Do not claim to have performed actions or accessed information you did not actually access.",
)

app = FastAPI(title=APP_NAME, version="0.3.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "X-Session-ID", "Authorization"],
)

_sessions: dict[str, InMemoryMemory] = {}
_sessions_lock = Lock()
_rate: dict[str, deque[float]] = {}
_rate_lock = Lock()

# HFL account layer. Passwords are never stored in plaintext. This lightweight
# store is intentionally isolated from the volunteer database; production
# persistence should be connected through a managed identity database before
# opening public registration at scale.
_accounts: dict[str, dict[str, Any]] = {}
_account_sessions: dict[str, str] = {}
_accounts_lock = Lock()


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=12000)


class SignupRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: str = Field(min_length=5, max_length=254)
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: str = Field(min_length=5, max_length=254)
    password: str = Field(min_length=8, max_length=128)


class ResetRequest(BaseModel):
    email: str = Field(min_length=5, max_length=254)
class ContactRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: str = Field(min_length=5, max_length=254)
    topic: str = Field(min_length=2, max_length=80)
    company: str = Field(default="", max_length=160)
    message: str = Field(min_length=5, max_length=6000)
    website: str = Field(default="", max_length=200)
    agree: bool = False

class GoogleCredentialRequest(BaseModel):
    credential: str = Field(min_length=20, max_length=20000)


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


def _normalize_email(email: str) -> str:
    value = email.strip().lower()
    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", value):
        raise HTTPException(status_code=400, detail="Enter a valid email address.")
    return value


def _hash_password(password: str, salt: bytes | None = None) -> str:
    salt = salt or secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 210_000)
    return salt.hex() + ":" + digest.hex()


def _verify_password(password: str, stored: str) -> bool:
    try:
        salt_hex, digest_hex = stored.split(":", 1)
        salt = bytes.fromhex(salt_hex)
        candidate = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 210_000).hex()
        return hmac.compare_digest(candidate, digest_hex)
    except (ValueError, TypeError):
        return False


def _new_account_session(email: str) -> str:
    token = secrets.token_urlsafe(32)
    with _accounts_lock:
        _account_sessions[token] = email
    return token


def _account_from_request(request: Request) -> dict[str, Any] | None:
    token = request.headers.get("Authorization", "")
    if token.lower().startswith("bearer "):
        token = token[7:].strip()
    if not token:
        return None
    with _accounts_lock:
        email = _account_sessions.get(token)
        return _accounts.get(email) if email else None


def _google_profile(credential: str) -> dict[str, Any]:
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=503, detail="Google sign-in is not configured yet. Add the HFL Tech Google client ID in the production API settings.")
    try:
        req = UrlRequest(
            "https://oauth2.googleapis.com/tokeninfo?" + urlencode({"id_token": credential}),
            headers={"Accept": "application/json", "User-Agent": "HFL-Tech-AgentMesh/1.0"},
        )
        with urlopen(req, timeout=8) as response:
            data = json.loads(response.read().decode("utf-8"))
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Google could not verify this sign-in. Please try again.") from exc
    if data.get("aud") != GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=401, detail="This Google sign-in was issued for a different application.")
    if data.get("iss") not in {"accounts.google.com", "https://accounts.google.com"}:
        raise HTTPException(status_code=401, detail="Invalid Google identity issuer.")
    if data.get("email_verified") not in {"true", True}:
        raise HTTPException(status_code=401, detail="Your Google email address could not be verified.")
    try:
        if int(data.get("exp", "0")) <= int(time.time()):
            raise HTTPException(status_code=401, detail="This Google sign-in has expired. Please try again.")
    except (TypeError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid Google identity token.")
    email = _normalize_email(str(data.get("email", "")))
    name = str(data.get("name") or data.get("given_name") or email.split("@", 1)[0]).strip()[:120]
    return {"email": email, "name": name, "google_sub": str(data.get("sub", "")), "picture": data.get("picture", "")}


@app.post("/contact")
def contact(payload: ContactRequest, request: Request) -> dict[str, Any]:
    client_id = request.client.host if request.client else "unknown"
    _check_rate_limit(client_id)
    if payload.website.strip():
        return {"accepted": True}
    email = _normalize_email(payload.email)
    topic = payload.topic.strip()
    allowed_topics = {"early access", "partnership", "security", "press", "careers", "other"}
    if topic.lower() not in allowed_topics:
        raise HTTPException(status_code=400, detail="Choose a valid enquiry topic.")
    api_key = os.getenv("RESEND_API_KEY", "").strip()
    recipient = os.getenv("CONTACT_TO_EMAIL", "HFLFOUNDER@GMAIL.COM").strip()
    if not api_key:
        raise HTTPException(status_code=503, detail="Contact email delivery is not configured yet. Please email HFLFOUNDER@GMAIL.COM directly.")
    body = {
        "from": os.getenv("CONTACT_FROM_EMAIL", "HFL Tech <onboarding@resend.dev>"),
        "to": [recipient],
        "reply_to": [email],
        "subject": f"HFL Tech contact: {topic}",
        "text": f"Name: {payload.name.strip()}\nEmail: {email}\nTopic: {topic}\nCompany: {payload.company.strip() or '-'}\n\n{payload.message.strip()}",
    }
    try:
        req = UrlRequest("https://api.resend.com/emails", data=json.dumps(body).encode("utf-8"), headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json", "Accept": "application/json"}, method="POST")
        with urlopen(req, timeout=10) as response:
            if response.status >= 300:
                raise RuntimeError("email delivery failed")
    except Exception as exc:
        raise HTTPException(status_code=502, detail="We could not deliver the message. Please email HFLFOUNDER@GMAIL.COM directly.") from exc
    return {"accepted": True, "message": "Your message has been sent."}


@app.get("/health")
def health() -> dict[str, Any]:
    return {"ok": True, "service": APP_NAME, "model": MODEL, "auth": True, "google_sign_in": bool(GOOGLE_CLIENT_ID)}


@app.get("/auth/google/config")
def auth_google_config() -> dict[str, Any]:
    return {"enabled": bool(GOOGLE_CLIENT_ID), "client_id": GOOGLE_CLIENT_ID if GOOGLE_CLIENT_ID else None}


@app.post("/auth/google/verify")
def auth_google_verify(payload: GoogleCredentialRequest, request: Request) -> dict[str, Any]:
    _check_rate_limit(request.client.host if request.client else "unknown")
    profile = _google_profile(payload.credential)
    email = profile["email"]
    with _accounts_lock:
        account = _accounts.get(email)
        if account:
            account["google_sub"] = profile["google_sub"]
            account["auth_provider"] = "google"
            account["picture"] = profile["picture"]
            if not account.get("name"):
                account["name"] = profile["name"]
        else:
            account = {
                "id": uuid.uuid4().hex,
                "name": profile["name"],
                "email": email,
                "password": _hash_password(secrets.token_urlsafe(32)),
                "created_at": int(time.time()),
                "auth_provider": "google",
                "google_sub": profile["google_sub"],
                "picture": profile["picture"],
            }
            _accounts[email] = account
    token = _new_account_session(email)
    return {"authenticated": True, "token": token, "redirect": "account.html", "name": account["name"]}


@app.post("/auth/signup")
def auth_signup(payload: SignupRequest, request: Request) -> dict[str, Any]:
    _check_rate_limit(request.client.host if request.client else "unknown")
    email = _normalize_email(payload.email)
    name = payload.name.strip()
    if len(name) < 2:
        raise HTTPException(status_code=400, detail="Enter your full name.")
    with _accounts_lock:
        if email in _accounts:
            raise HTTPException(status_code=409, detail="An account already exists for this email.")
        _accounts[email] = {"id": uuid.uuid4().hex, "name": name, "email": email, "password": _hash_password(payload.password), "created_at": int(time.time()), "auth_provider": "password"}
    token = _new_account_session(email)
    return {"authenticated": True, "token": token, "redirect": "account.html"}


@app.post("/auth/login")
def auth_login(payload: LoginRequest, request: Request) -> dict[str, Any]:
    _check_rate_limit(request.client.host if request.client else "unknown")
    email = _normalize_email(payload.email)
    with _accounts_lock:
        account = _accounts.get(email)
        valid = bool(account and _verify_password(payload.password, account["password"]))
    if not valid:
        raise HTTPException(status_code=401, detail="Email or password is incorrect.")
    token = _new_account_session(email)
    return {"authenticated": True, "token": token, "redirect": "account.html", "name": account["name"]}


@app.post("/auth/reset")
def auth_reset(payload: ResetRequest, request: Request) -> dict[str, Any]:
    _check_rate_limit(request.client.host if request.client else "unknown")
    _normalize_email(payload.email)
    return {"accepted": True}


@app.get("/auth/me")
def auth_me(request: Request) -> dict[str, Any]:
    account = _account_from_request(request)
    if not account:
        return {"authenticated": False}
    return {"authenticated": True, "id": account["id"], "name": account["name"], "email": account["email"], "picture": account.get("picture", ""), "auth_provider": account.get("auth_provider", "password")}


@app.post("/auth/logout")
def auth_logout(request: Request) -> dict[str, Any]:
    token = request.headers.get("Authorization", "")
    if token.lower().startswith("bearer "):
        token = token[7:].strip()
    if token:
        with _accounts_lock:
            _account_sessions.pop(token, None)
    return {"authenticated": False}


@app.post("/contact")
def contact(payload: ContactRequest, request: Request) -> dict[str, Any]:
    _check_rate_limit(request.client.host if request.client else "unknown")
    if payload.website:
        return {"accepted": True}
    if not payload.agree:
        raise HTTPException(status_code=400, detail="Privacy and Terms consent is required.")
    email = _normalize_email(payload.email)
    to_email = os.getenv("CONTACT_TO_EMAIL", "HFLFOUNDER@GMAIL.COM").strip()
    smtp_host = os.getenv("SMTP_HOST", "").strip()
    smtp_user = os.getenv("SMTP_USER", "").strip()
    smtp_password = os.getenv("SMTP_PASSWORD", "")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    from_email = os.getenv("SMTP_FROM_EMAIL", smtp_user or to_email).strip()
    if not smtp_host or not smtp_user or not smtp_password:
        raise HTTPException(status_code=503, detail="Contact delivery is not configured yet. Please email HFLFOUNDER@GMAIL.COM directly.")
    msg = EmailMessage()
    msg["Subject"] = f"HFL Tech contact · {payload.topic}"
    msg["From"] = from_email
    msg["To"] = to_email
    msg["Reply-To"] = email
    msg.set_content(f"Name: {payload.name}\nEmail: {email}\nTopic: {payload.topic}\nCompany: {payload.company or '—'}\n\n{payload.message}")
    try:
        with smtplib.SMTP(smtp_host, smtp_port, timeout=15) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
    except Exception as exc:
        raise HTTPException(status_code=502, detail="The message could not be delivered right now. Please email HFLFOUNDER@GMAIL.COM directly.") from exc
    return {"accepted": True}


@app.post("/v1/chat")
def chat(payload: ChatRequest, request: Request) -> dict[str, Any]:
    client_id = request.client.host if request.client else "unknown"
    _check_rate_limit(client_id)
    session_id = request.headers.get("X-Session-ID") or uuid.uuid4().hex
    result = _agent(session_id).run(payload.message)
    return {"session_id": session_id, "run_id": result.run_id, "content": result.content, "steps": result.steps}


@app.post("/v1/chat/stream")
def chat_stream(payload: ChatRequest, request: Request) -> StreamingResponse:
    client_id = request.client.host if request.client else "unknown"
    _check_rate_limit(client_id)
    session_id = request.headers.get("X-Session-ID") or uuid.uuid4().hex
    result = _agent(session_id).run(payload.message)

    def events():
        chunk_size = 48
        for i in range(0, len(result.content), chunk_size):
            chunk = result.content[i:i + chunk_size].replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")
            yield f'data: {{"type":"delta","text":"{chunk}"}}\\n\\n'
        yield f'data: {{"type":"done","session_id":"{session_id}","run_id":"{result.run_id}"}}\\n\\n'

    return StreamingResponse(events(), media_type="text/event-stream", headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})
