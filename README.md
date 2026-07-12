<p align="center">
  <img src="https://raw.githubusercontent.com/rbkhan007/ollamomui/main/docs/logo.svg" alt="OllamoMUI" width="200" />
</p>

<h1 align="center">OllamoMUI — Free AI Gateway</h1>

<p align="center">
  <b>Stop paying $20/mo for ChatGPT & Claude. Get 26 free models on one port.</b>
</p>

<p align="center">
  <a href="https://vercel.com"><img src="https://img.shields.io/badge/hosted%20on-Vercel-000?style=flat-square&logo=vercel" alt="Vercel" /></a>
  <a href="https://github.com/rbkhan007/ollamomui/releases/latest"><img src="https://img.shields.io/github/v/release/rbkhan007/ollamomui?color=2da44e&label=release&style=flat-square" alt="Release" /></a>
  <img src="https://img.shields.io/github/downloads/rbkhan007/ollamomui/total?style=flat-square" alt="Downloads" />
  <img src="https://img.shields.io/github/license/rbkhan007/ollamomui?style=flat-square" alt="License" />
  <a href="https://ollamomui.vercel.app"><img src="https://img.shields.io/badge/live%20demo-Vercel-000?style=flat-square" alt="Live Demo" /></a>
</p>

---

## Features

- **26 Free LLMs** via OpenRouter — Qwen, Nemotron, Llama, Gemma, and more
- **RAG Engine** — Upload PDFs, TXT, CSV; semantic + keyword hybrid search
- **Memory System** — Persistent conversation memory with automatic summarization
- **Multi-Provider** — OpenAI, Anthropic, Google, Groq, DeepSeek, Mistral, Together
- **Desktop App** — PySide6 + QML GUI with dark/light theme, auto-updater
- **Mobile App** — React Native / Expo with full CRUD and license activation
- **License Management** — SSLCommerz payments, automated email delivery
- **Self-Hostable** — Docker, Nginx, Cloudflare Tunnel, or cloud deployment

## Quick Start

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

Open http://localhost:3000 — no API key required for free models.

## Demo

Live at **[https://ollamomui.vercel.app](https://ollamomui.vercel.app)** — try the playground, test RAG, and explore pricing.

## Pricing

| Tier | Price | What You Get |
|------|-------|-------------|
| Free | $0 | 26 models, playground, limited RAG |
| Desktop Pro | $4.99/mo | Pre-built EXE, auto-updates, offline mode |
| Mobile Ultimate | $2.99/mo | Play Store app, full CRUD |
| Web Pro | $9.99/mo | Unlimited RAG, cloud sync, priority support |

## Architecture

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│  Backend │────▶│ Providers│
│ (Next.js)│     │ (FastAPI)│     │(OpenRouter│
│ Vercel   │     │  Render  │     │  OpenAI… )│
└──────────┘     └────┬─────┘     └──────────┘
                      │
                ┌─────▼──────┐
                │  PostgreSQL │
                │  (Neon DB)  │
                │ + pgvector  │
                └────────────┘
```

## Full Documentation

See **[docs/README.md](docs/README.md)** for the complete guide including:
- Detailed installation steps
- All 26 free models listed
- Docker Compose deployment
- Cloudflare Tunnel setup
- Desktop GUI screenshots
- API reference
- Architecture deep-dive

## License

MIT — Copyright (c) 2024-2026 Rhasan@dev
