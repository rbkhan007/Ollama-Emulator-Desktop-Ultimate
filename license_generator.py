#!/usr/bin/env python3
"""
license_generator.py - Manual license key generator for OllamoMUI.

Use this when you are selling licenses directly (WhatsApp / Bkash / bank
transfer, etc.) and have NOT set up an automated payment gateway.

It replicates the EXACT hashing used by the backend activation flow
(backend/src/ollama_emu/payment.py -> hash_license_key = sha256(raw_key)),
so keys generated here will activate in the desktop EXE / mobile app.

Requirements:
  - psycopg (v3) installed:  pip install "psycopg[binary]"
  - OLLAMA_EMU_DATABASE_URL pointing at the same DB the app uses
    (e.g. your NeonDB string on Render). Local fallback shown below.

Usage:
  python license_generator.py <customer_email> <plan> [days_valid]

  <plan> must match a plan used by the app, e.g.:
      web_pro | desktop_pro | mobile_ultimate
  [days_valid] defaults to 30. Use a large number (e.g. 3650) for "lifetime".

Example:
  python license_generator.py customer@example.com desktop_pro 30

Note:
  The customer must FIRST register in the app with this email (the licenses
  table is keyed to an existing users.email). The script will tell you if the
  user does not exist yet.
"""

import os

# Same key format as payment.generate_license_key
import secrets
import sys
from datetime import datetime, timedelta, timezone

import psycopg
from psycopg.rows import dict_row


def generate_license_key(user_id: str, plan: str) -> str:
    return (
        f"OLLAMOMUI-{plan.upper()}-{user_id[:8]}-"
        f"{secrets.token_hex(4).upper()}-{int(datetime.now(timezone.utc).timestamp())}"
    )


# MUST match payment.hash_license_key exactly, or keys won't activate.
def hash_license_key(raw_key: str) -> str:
    import hashlib
    return hashlib.sha256(raw_key.encode()).hexdigest()


def main():
    if len(sys.argv) < 3:
        print("Usage: python license_generator.py <customer_email> <plan> [days_valid]")
        print("Example: python license_generator.py customer@example.com desktop_pro 30")
        sys.exit(1)

    email = sys.argv[1].strip().lower()
    plan = sys.argv[2].strip().lower()
    days = int(sys.argv[3]) if len(sys.argv) > 3 else 30

    database_url = os.getenv(
        "OLLAMA_EMU_DATABASE_URL",
        "postgresql://ollamaemu:ollamaemu@localhost:5432/ollamaemu",
    )

    raw_key = generate_license_key(email, plan)
    key_hash = hash_license_key(raw_key)
    expiry = datetime.now(timezone.utc) + timedelta(days=days)

    try:
        with psycopg.connect(database_url, row_factory=dict_row) as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT email FROM users WHERE email = %s", (email,))
                if cur.fetchone() is None:
                    print(f"\n❌ No user with email '{email}'.")
                    print("   The customer must register in the app first (same email),")
                    print("   then re-run this script.")
                    sys.exit(1)

                cur.execute(
                    """
                    INSERT INTO licenses (user_id, key_hash, raw_key, plan, expiry_date)
                    VALUES (%s, %s, %s, %s, %s)
                    ON CONFLICT (user_id, plan) DO UPDATE
                        SET key_hash = EXCLUDED.key_hash,
                            raw_key  = EXCLUDED.raw_key,
                            expiry_date = EXCLUDED.expiry_date,
                            activated = false,
                            activated_at = NULL,
                            device_id = ''
                    """,
                    (email, key_hash, raw_key, plan, expiry),
                )
            conn.commit()
    except psycopg.Error as e:
        print(f"\n❌ Database error: {e}")
        sys.exit(1)

    print("\n✅ License generated & saved.")
    print(f"   Email : {email}")
    print(f"   Plan  : {plan}")
    print(f"   Expiry: {expiry.isoformat()} ({days} days)")
    print(f"   Key   : {raw_key}")
    print("\n   Send this key to the customer. They paste it into the")
    print("   activation screen of the EXE / mobile app to unlock the plan.")


if __name__ == "__main__":
    main()
