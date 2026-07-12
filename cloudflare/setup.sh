#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# OllamoMUI – Cloudflare Tunnel Setup Script
# ═══════════════════════════════════════════════════════════════
# Prerequisites:
#   - Docker installed
#   - Cloudflare account (free tier)
#   - Domain (ollamomui.com) added to Cloudflare
#   - Cloudflare API token (optional, for automation)
#
# Usage:
#   chmod +x cloudflare/setup.sh
#   ./cloudflare/setup.sh
# ═══════════════════════════════════════════════════════════════

set -euo pipefail

echo "=== OllamoMUI – Cloudflare Tunnel Setup ==="

# ── 1. Authenticate cloudflared ──
echo ">>> Step 1: Login to Cloudflare"
echo "    This will open a browser window to authenticate."
docker run --rm -it cloudflare/cloudflared:latest tunnel login

# ── 2. Create the tunnel ──
echo ">>> Step 2: Create tunnel 'my-home-tunnel'"
docker run --rm -it \
  -v ~/.cloudflared:/home/nonroot/.cloudflared \
  cloudflare/cloudflared:latest tunnel create my-home-tunnel

# ── 3. Route DNS ──
echo ">>> Step 3: Route DNS for api.ollamomui.com"
docker run --rm -it \
  -v ~/.cloudflared:/home/nonroot/.cloudflared \
  cloudflare/cloudflared:latest tunnel route dns my-home-tunnel api.ollamomui.com

# ── 4. Copy credentials for Docker Compose ──
echo ">>> Step 4: Copy credentials to project"
mkdir -p cloudflare/credentials
cp ~/.cloudflared/my-home-tunnel.json cloudflare/credentials/
cp ~/.cloudflared/cert.pem cloudflare/credentials/ 2>/dev/null || true

echo ""
echo "=== Setup complete! ==="
echo "Next steps:"
echo "  1. Add ollamomui.com to Cloudflare (if not already)"
echo "  2. Deploy frontend to Cloudflare Pages"
echo "  3. Run: docker compose up -d"
echo ""
echo "Your backend will be available at: https://api.ollamomui.com"
