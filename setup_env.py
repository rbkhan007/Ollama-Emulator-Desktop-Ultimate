#!/usr/bin/env python3
"""
Automated environment configuration for OllamoMUI
Sets up Vercel and Render environment variables via CLI
"""

import subprocess
import sys
import os
import json
import yaml
from pathlib import Path

# ============================================================
# CONFIGURATION - EDIT THESE VALUES
# ============================================================

VERCEL_PROJECT_NAME = "ollamomui"
RENDER_SERVICE_NAME = "ollamomui-backend"

VERCEL_ENV_VARS = {
    "NEXT_PUBLIC_API_BASE": "https://ollamomui-backend.onrender.com",
    "NEXT_PUBLIC_SITE_URL": "https://ollamomui.vercel.app",
}

RENDER_ENV_VARS = {
    "COOKIE_SECURE": "false",
    "APP_URL": os.environ.get("APP_URL", "https://ollamomui.vercel.app"),
    "LEMON_SQUEEZY_API_KEY": os.environ.get("LEMON_SQUEEZY_API_KEY", ""),
    "LEMON_SQUEEZY_STORE_ID": os.environ.get("LEMON_SQUEEZY_STORE_ID", ""),
    "LEMON_SQUEEZY_WEBHOOK_SECRET": os.environ.get("LEMON_SQUEEZY_WEBHOOK_SECRET", ""),
    "LEMON_SQUEEZY_VARIANT_WEB_PRO": os.environ.get("LEMON_SQUEEZY_VARIANT_WEB_PRO", ""),
    "LEMON_SQUEEZY_VARIANT_DESKTOP_PRO": os.environ.get("LEMON_SQUEEZY_VARIANT_DESKTOP_PRO", ""),
    "LEMON_SQUEEZY_VARIANT_MOBILE_ULTIMATE": os.environ.get("LEMON_SQUEEZY_VARIANT_MOBILE_ULTIMATE", ""),
}

def run_cmd(cmd, check=True, capture=False):
    print(f"  -> Running: {cmd}")
    try:
        if capture:
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True, check=check)
            return result.stdout.strip()
        else:
            subprocess.run(cmd, shell=True, check=check)
            return None
    except subprocess.CalledProcessError as e:
        print(f"  x Command failed: {e}")
        if hasattr(e, 'stderr') and e.stderr:
            print(f"    Error: {e.stderr}")
        raise

def check_cli(tool, install_cmd):
    try:
        run_cmd(f"{tool} --version", capture=True)
        print(f"  v {tool} is installed")
        return True
    except:
        print(f"  x {tool} is not installed")
        print(f"    Install with: {install_cmd}")
        return False

def main():
    print("\n" + "="*60)
    print("  OllamoMUI - Environment Setup")
    print("="*60 + "\n")

    print("Checking prerequisites...")
    if not check_cli("vercel", "npm install -g vercel"):
        sys.exit(1)
    has_render = check_cli("render", "pip install render-cli")

    print("\n" + "-"*60)

    print("\nVerifying Vercel login...")
    try:
        whoami = run_cmd("vercel whoami", capture=True)
        print(f"  v Logged in as: {whoami}")
    except:
        print("  x Not logged in to Vercel")
        print("  -> Run: vercel login")
        sys.exit(1)

    if not has_render:
        print("\n  render-cli not found - will use Render API instead")

    token = os.environ.get("RENDER_TOKEN") or os.environ.get("RENDER_API_KEY")
    if not token:
        cli_config = Path.home() / ".render" / "cli.yaml"
        if cli_config.exists():
            with open(cli_config) as f:
                cfg = yaml.safe_load(f)
                token = cfg.get("api", {}).get("key", "")
    if token:
        print("  v Render token found")
    else:
        print("  ? No Render API token found")
        print("  -> Run: render login")
        print("  -> Or set: $env:RENDER_TOKEN = 'your_token'")

    print("\n" + "-"*60)

    print("\nSetting Vercel environment variables...")
    print(f"  Project: {VERCEL_PROJECT_NAME}")

    try:
        run_cmd(f"vercel link --yes --project {VERCEL_PROJECT_NAME}", capture=True)
        print("  v Project linked")
    except:
        print("  ? Project may already be linked, continuing...")

    for key, value in VERCEL_ENV_VARS.items():
        print(f"\n  Setting {key}...")
        cmd = f'echo "{value}" | vercel env add {key} production --yes --force'
        try:
            run_cmd(cmd)
            print(f"    v {key} set")
        except Exception as e:
            print(f"    x Failed to set {key}: {e}")

    print("\nSetting Render environment variables...")
    print(f"  Service: {RENDER_SERVICE_NAME}")

    if not token:
        print("  x RENDER_TOKEN not set - skipping Render env vars")
        print("  -> Set them manually at https://dashboard.render.com")
    else:
        import requests
        headers = {"Authorization": f"Bearer {token}"}
        try:
            resp = requests.get("https://api.render.com/v1/services", headers=headers)
            services = resp.json()
            service_id = None
            for svc in services:
                if svc.get("name") == RENDER_SERVICE_NAME:
                    service_id = svc.get("id")
                    break
            if not service_id:
                print(f"  x Service '{RENDER_SERVICE_NAME}' not found")
                print(f"  -> Available services: {[s.get('name') for s in services]}")
            else:
                print(f"  v Found service ID: {service_id}")
                env_vars = [{"key": k, "value": v} for k, v in RENDER_ENV_VARS.items()]
                url = f"https://api.render.com/v1/services/{service_id}/env-vars"
                resp = requests.put(url, headers=headers, json=env_vars)
                if resp.status_code in [200, 201]:
                    print(f"  v All {len(env_vars)} env vars set")
                else:
                    print(f"  x Failed: {resp.status_code} - {resp.text}")
        except Exception as e:
            print(f"  x API error: {e}")

    print("\nRedeploying frontend on Vercel...")
    try:
        run_cmd("cd frontend && vercel --prod --yes", capture=True)
        print("  v Frontend redeployed")
    except:
        print("  ? Could not redeploy. Run manually: cd frontend && vercel --prod")

    print("\n" + "="*60)
    print("  Environment setup complete!")
    print("="*60)
    print("\nNext steps:")
    print("  1. Verify Render deploy at: https://dashboard.render.com")
    print("  2. In Lemon Squeezy, create a webhook -> <APP_URL>/api/payment/lemonsqueezy/webhook")
    print("  3. Set LEMON_SQUEEZY_* env vars (API key, store id, webhook secret, variant ids)")

if __name__ == "__main__":
    main()
