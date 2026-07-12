<p align="center">
  <img src="https://raw.githubusercontent.com/rbkhan007/ollamomui/main/resources/ollamomui.svg" alt="OllamoMUI" width="220" />
</p>

<h1 align="center">OllamoMUI — Free AI Gateway</h1>

<p align="center">
  <b>Stop paying $20/mo for ChatGPT & Claude. Get 26 free models on one port.</b>
  <br />
  <i>RAG · Memory · Desktop EXE · Mobile App · Freemium Proxy</i>
</p>

<p align="center">
  <a href="https://ollamomui.vercel.app"><img src="https://img.shields.io/badge/live%20demo-Vercel-000?style=flat-square&logo=vercel" alt="Live Demo" /></a>
  <a href="https://github.com/rbkhan007/ollamomui/releases/latest"><img src="https://img.shields.io/github/v/release/rbkhan007/ollamomui?color=2da44e&label=release&style=flat-square" alt="Release" /></a>
  <img src="https://img.shields.io/github/downloads/rbkhan007/ollamomui/total?style=flat-square" alt="Downloads" />
  <a href="https://github.com/rbkhan007/ollamomui/stargazers"><img src="https://img.shields.io/github/stars/rbkhan007/ollamomui?style=social" alt="Stars" /></a>
  <img src="https://img.shields.io/github/license/rbkhan007/ollamomui?style=flat-square" alt="License" />
  <a href="https://vercel.com"><img src="https://img.shields.io/badge/powered%20by-Vercel-000?style=flat-square&logo=vercel" alt="Powered by Vercel" /></a>
</p>

---

## Demo

| Platform | URL | Status |
|----------|-----|--------|
| **Frontend** | https://ollamomui.vercel.app | ✅ Live |
| **Backend API** | https://ollamomui-backend.onrender.com/api/status | ✅ Live |
| **Desktop EXE** | [Download latest](https://github.com/rbkhan007/ollamomui/releases/latest) | ✅ Ready |
| **Mobile APK** | [Download latest](https://github.com/rbkhan007/ollamomui/releases/latest) | ✅ Buildable |

---

## What Is OllamoMUI?

OllamoMUI is a **free, self-hosted AI gateway** that emulates the Ollama API (and OpenAI / Anthropic formats) and routes your prompts to **26 completely free LLMs** via OpenRouter. It ships with:

- A **RAG knowledge base** (upload PDFs/TXT/CSV, get grounded answers)
- **Persistent memory** (every conversation auto-saves with facts & summaries)
- A **desktop GUI** (PySide6 + QML, dark/light theme, auto-updater)
- A **mobile app** (React Native / Expo with full CRUD)
- **License management** with SSLCommerz payments and email delivery
- A **freemium proxy** that works with Claude Code, Cursor, OpenCode, and any Ollama-compatible tool

---

## Features

<table>
  <tr>
    <td width="33%">
      <h3>🧠 26 Free LLMs</h3>
      <p>Qwen3 Coder 480B, NVIDIA Nemotron 550B, Llama 3.3 70B, Gemma 4, and more — all free via OpenRouter.</p>
    </td>
    <td width="33%">
      <h3>📚 RAG Engine</h3>
      <p>Upload PDFs, TXT, or CSV. Hybrid vector (pgvector) + keyword (pg_trgm) search with cross-encoder reranking.</p>
    </td>
    <td width="33%">
      <h3>💾 Persistent Memory</h3>
      <p>Every conversation auto-saves. Facts, summaries, and sessions survive restarts. PostgreSQL-backed.</p>
    </td>
  </tr>
  <tr>
    <td width="33%">
      <h3>🖥️ Desktop App</h3>
      <p>PySide6 + QML GUI with animated backgrounds, dual theme, embedded terminal, and auto-updater.</p>
    </td>
    <td width="33%">
      <h3>📱 Mobile App</h3>
      <p>React Native / Expo with full CRUD, chat, RAG, memory browsing, and license activation.</p>
    </td>
    <td width="33%">
      <h3>🔗 Multi-Provider</h3>
      <p>OpenAI, Anthropic, Google Gemini, Groq, DeepSeek, Mistral, Together — one unified API.</p>
    </td>
  </tr>
  <tr>
    <td width="33%">
      <h3>💳 Payments & Licensing</h3>
      <p>SSLCommerz integration (Bangladesh) + Stripe Payment Links (global). Auto license generation + email delivery.</p>
    </td>
    <td width="33%">
      <h3>🔒 Enterprise Security</h3>
      <p>HTTPS redirect, secure cookies, rate limiting, IP allow/block lists, audit logging, password hashing.</p>
    </td>
    <td width="33%">
      <h3>🐳 Self-Hostable</h3>
      <p>Docker Compose with Cloudflare Tunnel sidecar. Deploy anywhere — VPS, NAS, or cloud (Render/Vercel).</p>
    </td>
  </tr>
</table>

---

## Comparison

| Product | Free Cloud LLMs | RAG | Memory | Desktop GUI | Mobile App | API Proxy | Pricing |
|---------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **OllamoMUI** | ✅ 26 models | ✅ | ✅ | ✅ | ✅ | ✅ | Free + Paid tiers |
| Ollama | ❌ (local only) | ❌ | ❌ | ❌ | ❌ | ✅ | Free |
| LM Studio | ❌ (local only) | ❌ | ❌ | ✅ | ❌ | ❌ | Free |
| Jan | ❌ (local only) | ❌ | ❌ | ✅ | ❌ | ❌ | Free |
| GPT4All | ❌ (local only) | ✅ | ❌ | ✅ | ❌ | ❌ | Free |
| ChatGPT | $20/mo | ❌ | ❌ | ❌ | ✅ | ❌ | $20/mo |
| Claude Pro | $20/mo | ❌ | ❌ | ❌ | ❌ | ❌ | $20/mo |

---

## Quick Start

### One-Line Docker

```bash
docker run -d --name ollamomui -p 11434:11434 ghcr.io/rbkhan007/ollamomui:latest
```

### Manual Setup

```bash
git clone https://github.com/rbkhan007/ollamomui.git
cd ollamomui

# Backend
pip install -e "backend/[dev]"
python -m ollama_emu.main --host 0.0.0.0 --port 11434

# Frontend (separate terminal)
cd frontend
npm install && npm run dev
```

Open **http://localhost:3000** — no API key required for free models.

### Desktop EXE

Download from [Releases](https://github.com/rbkhan007/ollamomui/releases/latest) — runs the backend + QML GUI in a single click.

---

## Architecture

```
┌────────────┐     ┌──────────────┐     ┌──────────────┐
│  Frontend  │     │   Backend    │     │  Providers   │
│  (Next.js) │────▶│  (FastAPI)   │────▶│  OpenRouter  │
│   Vercel   │     │   Render     │     │  OpenAI …    │
└────────────┘     └──────┬───────┘     └──────────────┘
                          │
                    ┌─────▼────────┐
                    │  PostgreSQL  │
                    │  (Neon DB)   │
                    │  + pgvector  │
                    └──────────────┘

┌──────────────────────┐   ┌──────────────────────┐
│  Desktop GUI         │   │  Mobile App          │
│  PySide6 + QML       │   │  React Native/Expo   │
│  (Windows/macOS)     │   │  (Android)           │
└──────────┬───────────┘   └──────────┬───────────┘
           │                          │
           └──────────┬───────────────┘
                      ▼
              ┌────────────────┐
              │  Backend API   │
              │  localhost:11434│
              └────────────────┘
```

---

## Pricing

| Tier | Price | What You Get |
|------|-------|-------------|
| **Free** | $0 | 26 models, playground, limited RAG, 10 req/day |
| **Desktop Pro** | $4.99/mo | Pre-built EXE, auto-updates, offline mode |
| **Mobile Ultimate** | $2.99/mo | Play Store app, full CRUD, notifications |
| **Web Pro** | $9.99/mo | Unlimited RAG, cloud sync, priority support |

**[View pricing →](https://ollamomui.vercel.app/pricing)**

---

## Project Structure

```
ollamomui/
├── backend/          # Python FastAPI backend
│   ├── src/ollama_emu/   # Core application
│   ├── tests/test_api.py # Integration tests
│   └── scripts/          # Build & run scripts
├── frontend/         # Next.js marketing site
│   └── src/app/          # Pages & components
├── desktop/          # PySide6 + QML desktop GUI
│   └── src/qml/          # QML components & pages
├── mobile/           # React Native / Expo app
│   └── app/              # Screens
├── deploy/           # Nginx, Docker configs
├── cloudflare/       # Cloudflare Tunnel setup
├── configs/          # Database schema, env examples
├── docs/             # Full documentation (751 lines)
├── promotion/        # Product Hunt, Reddit, Twitter drafts
└── resources/        # Logos, icons, architecture diagrams
```

---

## Documentation

| Resource | Description |
|----------|-------------|
| [docs/README.md](docs/README.md) | Full installation, configuration & API reference (751 lines) |
| [docs/API.md](docs/API.md) | Complete API endpoint reference |
| [docs/MOBILE.md](docs/MOBILE.md) | Mobile app build & deploy guide |
| [deploy/README.md](deploy/README.md) | Docker, Nginx & Cloudflare deployment |
| [CHANGELOG.md](CHANGELOG.md) | Version history |

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Make your changes
4. Run tests: `python -m pytest backend/tests/`
5. Submit a PR

All contributions are welcome — bug fixes, new providers, UI improvements, and documentation.

---

## License

MIT — Copyright (c) 2024-2026 [Rhasan@dev](https://github.com/rbkhan007)

Built with ❤️ for the open-source AI community.
