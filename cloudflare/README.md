# OllamoMUI – Cloudflare Deployment Guide

## Architecture

```
User ──https──→ Cloudflare Edge ──tunnel──→ cloudflared (Docker) ──→ backend:11434
                                      │
                                      └──→ postgres:5432
```

- **Frontend**: Cloudflare Pages (free tier, connected to GitHub repo)
- **Backend**: Docker on your home server, exposed via Cloudflare Tunnel (no open ports)
- **Database**: PostgreSQL + pgvector via Docker, local only
- **SSL**: Cloudflare Edge handles TLS automatically
- **DDoS protection**: Cloudflare's free tier

---

## Prerequisites

1. **Domain** (`ollamomui.com`) — buy from Namecheap, GoDaddy, etc.
2. **Cloudflare account** (free) — add your domain
3. **Docker** installed on your home server (Windows/Linux/Mac)
4. **GitHub account** — repo already at `github.com/rbkhan007/ollamomui`

---

## Step 1: Set Up Docker + Backend

### 1a. Clone the repo on your home server

```bash
git clone https://github.com/rbkhan007/ollamomui.git
cd ollamomui
```

### 1b. Create `.env` file

```bash
cp .env.production .env
```

Edit `.env` with your values (database password, API key, SMTP, Lemon Squeezy keys).

### 1c. Start PostgreSQL + Backend

```bash
docker compose up -d postgres backend
```

Verify:
```bash
curl http://localhost:11434/api/version
# → {"version":"1.0.4","app":"ollamomui"}
curl http://localhost:11434/api/db/schema
# → {"connected":true,"schema":{"synced":true}}
```

---

## Step 2: Set Up Cloudflare Tunnel

### 2a. Login to Cloudflare

```bash
docker run --rm -it cloudflare/cloudflared:latest tunnel login
```

This opens a browser. Log in to your Cloudflare account and select `ollamomui.com`.

### 2b. Create the tunnel

```bash
docker run --rm -it \
  -v ~/.cloudflared:/home/nonroot/.cloudflared \
  cloudflare/cloudflared:latest tunnel create my-home-tunnel
```

Save the tunnel ID and credentials file path — you'll need them.

### 2c. Route DNS

```bash
docker run --rm -it \
  -v ~/.cloudflared:/home/nonroot/.cloudflared \
  cloudflare/cloudflared:latest tunnel route dns my-home-tunnel api.ollamomui.com
```

This creates a `CNAME` record: `api.ollamomui.com → my-home-tunnel.cfargotunnel.com`

### 2d. Get tunnel token (easiest method)

```bash
docker run --rm -it \
  -v ~/.cloudflared:/home/nonroot/.cloudflared \
  cloudflare/cloudflared:latest tunnel token my-home-tunnel
```

Copy the token and add it to your `.env`:

```env
CLOUDFLARE_TUNNEL_TOKEN=eyJ...
```

### 2e. Start the tunnel

```bash
docker compose up -d tunnel
```

Verify:
```bash
curl https://api.ollamomui.com/api/version
```

---

## Step 3: Deploy Frontend to Cloudflare Pages

### 3a. Connect your GitHub repo

1. Go to **Cloudflare Dashboard → Pages → Create a Pages project**
2. Connect to your `rbkhan007/ollamomui` GitHub repo
3. Configure:
   - **Build command**: `cd frontend && npm install && npm run build`
   - **Build output directory**: `/frontend/out`
   - **Root directory**: (leave blank)

### 3b. Environment variables

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_BASE` | `https://api.ollamomui.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://ollamomui.com` |

> Pricing uses the backend Lemon Squeezy integration (`/api/payment/lemonsqueezy/create-checkout`). No client-side payment env vars are required.

### 3c. Custom domain

1. Go to **Pages project → Custom domains**
2. Add `ollamomui.com`
3. Cloudflare automatically adds the DNS record

### 3d. Deploy

Push to `main` → Cloudflare Pages auto-builds and deploys.

---

## Step 4: SSL / Certificates

**Nothing to do.** Cloudflare Edge automatically provisions and renews SSL certificates for all proxied domains. No Certbot needed.

---

## Step 5: Verify Everything

```bash
# Frontend
curl https://ollamomui.com
# → HTML of your marketing site

# Backend API
curl https://api.ollamomui.com/api/version
# → {"version":"1.0.4"}

# DB health
curl https://api.ollamomui.com/api/db/schema
# → {"connected":true}

# Payment flow (sandbox)
# 1. Go to https://ollamomui.com/pricing
# 2. Click "Subscribe" on a plan
# 3. Complete the Lemon Squeezy checkout (use test mode + card 4242 4242 4242 4242)
# 4. Receive license key on screen and by email
```

---

## Cost Breakdown

| Service | Cost |
|---------|------|
| Cloudflare (free tier) | $0 |
| Cloudflare Pages (free tier) | $0 |
| Cloudflare Tunnel (free tier) | $0 |
| Docker (home server) | $0 |
| PostgreSQL (self-hosted) | $0 |
| **Total** | **$0/month** |

The only cost is your domain name (~$10/year) and your home server electricity.

---

## Troubleshooting

**Tunnel not connecting?**
```bash
docker compose logs tunnel
```

**DNS not propagating?**
```bash
dig api.ollamomui.com
# Should show CNAME → my-home-tunnel.cfargotunnel.com
```

**Want to stop the tunnel?**
```bash
docker compose stop tunnel
```
