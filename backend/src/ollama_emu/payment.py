import os
import re
import json
import uuid
import hashlib
import secrets
import smtplib
import hmac
import logging
import httpx
from email.mime.text import MIMEText
from datetime import datetime, timezone, timedelta
from typing import Optional
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import RedirectResponse, JSONResponse
from pydantic import BaseModel, EmailStr, field_validator

from ollama_emu import db

log = logging.getLogger("ollama-emu")

APP_URL = os.getenv("APP_URL", "http://localhost:11434")
SMTP_SENDER = os.getenv("SMTP_SENDER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))

router = APIRouter(prefix="/api/payment", tags=["payment"])


def generate_license_key(user_id: str, plan: str) -> str:
    raw = f"OLLAMOMUI-{plan.upper()}-{user_id[:8]}-{secrets.token_hex(4).upper()}-{int(datetime.now(timezone.utc).timestamp())}"
    return raw


def hash_license_key(raw_key: str) -> str:
    return hashlib.sha256(raw_key.encode()).hexdigest()


def verify_license_key(raw_key: str, stored_hash: str) -> bool:
    return hmac.compare_digest(hash_license_key(raw_key), stored_hash)


def send_license_email(email_to: str, license_key: str, plan: str):
    if not SMTP_SENDER or not SMTP_PASSWORD:
        log.warning("SMTP not configured — skipping license email to %s", email_to)
        return

    subject = f"Your OllamoMUI {plan} License Key"
    body = f"""
Thank you for purchasing OllamoMUI {plan}!

Your license key is:
{license_key}

To activate, paste this key into the activation screen of the EXE or mobile app.

Download the EXE: https://github.com/rbkhan007/ollamomui/releases/latest
Get the mobile app: https://play.google.com/store/apps/details?id=com.ollamomui.app

Regards,
The OllamoMUI Team
"""
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = SMTP_SENDER
    msg["To"] = email_to

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_SENDER, SMTP_PASSWORD)
            server.send_message(msg)
        log.info("License email sent to %s", email_to)
    except Exception as e:
        log.error("Failed to send license email to %s: %s", email_to, e)


def _save_license(user_id: str, raw_key: str, plan: str, expiry_days: int = 30):
    key_hash = hash_license_key(raw_key)
    expiry = datetime.now(timezone.utc) + timedelta(days=expiry_days)
    with db.get_cursor() as cur:
        cur.execute(
            """
            INSERT INTO licenses (user_id, key_hash, plan, expiry_date)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (user_id, plan) DO UPDATE
            SET key_hash = EXCLUDED.key_hash,
                expiry_date = EXCLUDED.expiry_date,
                activated = false
            """,
            (user_id, key_hash, plan, expiry),
        )
    return raw_key, key_hash


def _update_user_subscription(user_id: str, expiry_days: int = 30):
    expiry = datetime.now(timezone.utc) + timedelta(days=expiry_days)
    with db.get_cursor() as cur:
        cur.execute(
            "UPDATE users SET subscription_status = 'pro', subscription_expiry = %s WHERE email = %s",
            (expiry, user_id),
        )


class LicenseActivateRequest(BaseModel):
    license_key: str
    device_id: Optional[str] = None


@router.post("/activate")
def activate_license(req: LicenseActivateRequest):
    """Activate a license key. Returns success/failure and remaining days."""
    key_hash = hash_license_key(req.license_key)

    with db.get_cursor(commit=False) as cur:
        cur.execute(
            "SELECT user_id, plan, expiry_date, activated FROM licenses WHERE key_hash = %s",
            (key_hash,),
        )
        row = cur.fetchone()

    if not row:
        raise HTTPException(status_code=404, detail="Invalid license key")

    if row["activated"]:
        raise HTTPException(status_code=409, detail="License already activated on another device")

    remaining = (row["expiry_date"] - datetime.now(timezone.utc)).days
    if remaining < 0:
        raise HTTPException(status_code=410, detail="License has expired")

    with db.get_cursor() as cur:
        cur.execute(
            "UPDATE licenses SET activated = true, activated_at = %s, device_id = %s WHERE key_hash = %s",
            (datetime.now(timezone.utc), req.device_id or "", key_hash),
        )

    return {
        "success": True,
        "plan": row["plan"],
        "expires_at": row["expiry_date"].isoformat(),
        "days_remaining": remaining,
    }


# ============================================================
# LEMON SQUEEZY — primary payment provider (global, tax handled)
# ============================================================
LEMON_SQUEEZY_API_KEY = os.getenv("LEMON_SQUEEZY_API_KEY", "")
LEMON_SQUEEZY_STORE_ID = os.getenv("LEMON_SQUEEZY_STORE_ID", "")
LEMON_SQUEEZY_WEBHOOK_SECRET = os.getenv("LEMON_SQUEEZY_WEBHOOK_SECRET", "")
LEMON_SQUEEZY_API = "https://api.lemonsqueezy.com/v1"

# Plan -> env var that holds its Lemon Squeezy variant id.
_VARIANT_ENV = {
    "web_pro": "LEMON_SQUEEZY_VARIANT_WEB_PRO",
    "desktop_pro": "LEMON_SQUEEZY_VARIANT_DESKTOP_PRO",
    "mobile_ultimate": "LEMON_SQUEEZY_VARIANT_MOBILE_ULTIMATE",
}
# Reverse map: variant_id (str) -> plan
PLAN_VARIANTS = {os.getenv(v): k for k, v in _VARIANT_ENV.items() if os.getenv(v)}


def _plan_for_variant(variant_id) -> Optional[str]:
    if variant_id is None:
        return None
    return PLAN_VARIANTS.get(str(variant_id))


class CheckoutRequest(BaseModel):
    email: Optional[EmailStr] = None
    plan: str

    @field_validator("plan")
    @classmethod
    def validate_plan(cls, v):
        v = (v or "").strip().lower()
        if v not in _VARIANT_ENV:
            raise ValueError("Invalid plan")
        return v


@router.post("/lemonsqueezy/create-checkout")
async def ls_create_checkout(req: CheckoutRequest):
    """Create a Lemon Squeezy hosted checkout and return its URL."""
    if not LEMON_SQUEEZY_API_KEY or not LEMON_SQUEEZY_STORE_ID:
        raise HTTPException(status_code=500, detail="Payment provider not configured")
    variant_id = os.getenv(_VARIANT_ENV.get(req.plan, ""), "")
    if not variant_id:
        raise HTTPException(status_code=400, detail="Plan variant not configured")

    checkout_data = {"redirect_url": f"{APP_URL}/payment-result?status=success&plan={req.plan}"}
    if req.email:
        checkout_data["email"] = req.email
        checkout_data["custom"] = {"user_email": req.email, "plan": req.plan}

    payload = {
        "data": {
            "type": "checkouts",
            "attributes": {
                "variant_id": int(variant_id),
                "checkout_data": checkout_data,
            },
            "relationships": {
                "store": {"data": {"type": "stores", "id": str(LEMON_SQUEEZY_STORE_ID)}}
            },
        }
    }
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                f"{LEMON_SQUEEZY_API}/checkouts",
                json=payload,
                headers={
                    "Authorization": f"Bearer {LEMON_SQUEEZY_API_KEY}",
                    "Content-Type": "application/vnd.api+json",
                    "Accept": "application/vnd.api+json",
                },
            )
    except Exception as e:
        log.error("Lemon Squeezy checkout request failed: %s", e)
        raise HTTPException(status_code=502, detail="Payment provider unreachable")

    if resp.status_code >= 400:
        log.error("Lemon Squeezy checkout error %d: %s", resp.status_code, resp.text[:500])
        raise HTTPException(status_code=502, detail="Failed to create checkout")

    data = resp.json()
    checkout_url = data.get("data", {}).get("attributes", {}).get("url")
    if not checkout_url:
        raise HTTPException(status_code=502, detail="No checkout URL returned")
    return {"checkout_url": checkout_url}


@router.post("/lemonsqueezy/webhook")
async def ls_webhook(request: Request):
    """Lemon Squeezy webhook: verifies signature, issues a license on purchase."""
    raw = await request.body()
    signature = request.headers.get("X-Signature", "")
    if not LEMON_SQUEEZY_WEBHOOK_SECRET:
        log.error("Lemon Squeezy webhook secret not configured")
        raise HTTPException(status_code=500, detail="Webhook not configured")
    expected = hmac.new(
        LEMON_SQUEEZY_WEBHOOK_SECRET.encode(), raw, hashlib.sha256
    ).hexdigest()
    if not hmac.compare_digest(expected, signature):
        log.warning("Lemon Squeezy webhook signature mismatch")
        raise HTTPException(status_code=401, detail="Invalid signature")

    try:
        event = json.loads(raw)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON")

    event_name = event.get("meta", {}).get("event_name", "")
    attrs = event.get("data", {}).get("attributes", {})
    log.info("Lemon Squeezy webhook: %s", event_name)

    if event_name in ("order_created", "subscription_created", "subscription_payment_success"):
        email = attrs.get("user_email") or (
            (attrs.get("checkout_data") or {}).get("custom") or {}
        ).get("user_email")
        if not email:
            return JSONResponse({"ok": True, "note": "no email in payload"})
        variant_id = attrs.get("variant_id")
        if variant_id is None and event_name == "order_created":
            variant_id = (attrs.get("first_order_item") or {}).get("variant_id")
        plan = _plan_for_variant(variant_id)
        if not plan:
            return JSONResponse({"ok": True, "note": "unknown variant"})

        raw_key = generate_license_key(email, plan)
        _save_license(email, raw_key, plan)
        _update_user_subscription(email)
        send_license_email(email, raw_key, plan)
        return JSONResponse({"ok": True, "plan": plan, "license": raw_key})

    return JSONResponse({"ok": True})


@router.get("/license/{user_id}")
def get_user_licenses(user_id: str):
    """Get all licenses for a user."""
    with db.get_cursor(commit=False) as cur:
        cur.execute(
            "SELECT plan, expiry_date, activated, activated_at, device_id FROM licenses WHERE user_id = %s ORDER BY created_at DESC",
            (user_id,),
        )
        rows = cur.fetchall()
    return {"licenses": [dict(r) for r in rows]}


@router.get("/license/current")
async def get_current_license(request: Request):
    """Get the current user's active license from the auth token."""
    from ollama_emu.acl import get_auth_context
    ctx = get_auth_context(request)
    email = (ctx or {}).get("email")
    if not email:
        raise HTTPException(status_code=401, detail="Not authenticated")
    with db.get_cursor(commit=False) as cur:
        cur.execute(
            "SELECT plan, expiry_date, activated, activated_at, device_id FROM licenses WHERE user_id = %s AND activated = true ORDER BY created_at DESC LIMIT 1",
            (email,),
        )
        row = cur.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="No active license found")
    return {"plan": row["plan"], "expires_at": str(row["expiry_date"]), "activated": row["activated"]}
