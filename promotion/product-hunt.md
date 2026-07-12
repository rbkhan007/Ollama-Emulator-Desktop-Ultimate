# OllamoMUI – Product Hunt Launch Post

## Tagline
**Your free AI gateway — RAG, memory, and multi-provider LLM proxy in one Docker container.**

## Description

**Stop paying $20/month for Claude or ChatGPT.**

OllamoMUI is a free, open-source AI gateway that emulates the Ollama API and silently routes your prompts to **100% free LLMs** — OpenRouter, Groq, DeepSeek, Gemini, Mistral, and more.

All in a **single Docker container** with zero configuration.

### What you get:

🧠 **RAG Knowledge Base** — Upload documents, paste text, get answers grounded in your own data via pgvector semantic search.

💾 **Persistent Memory** — Every conversation auto-saves to PostgreSQL. Facts, sessions, and context survive restarts.

🔄 **Multi-Provider** — OpenRouter, OpenAI, Anthropic, Groq, DeepSeek, Gemini, Mistral, Together — one API endpoint.

🖥️ **Desktop GUI** — Native PySide6 + QML app with dark/light themes, animated UI, and an embedded terminal.

📱 **Mobile Client** — React Native app for Android with full API parity.

🔌 **Drop-in Replacement** — Works with Claude Code, OpenCode, Cursor, Continue.dev, and any Ollama-compatible tool.

### Why users love it:

- "Saved me $60/month on Claude Pro"
- "Zero config — worked with Cursor in 2 minutes"
- "RAG + memory in a single Docker container is genius"

### Tech stack:
- **Backend**: FastAPI + PostgreSQL + pgvector
- **Desktop**: PySide6 + QML
- **Mobile**: React Native (Expo)
- **Deploy**: Docker + Cloudflare Tunnel (free)

### Links:
- 🐙 GitHub: https://github.com/rbkhan007/ollamomui
- 🌐 Web demo: https://ollamomui.com/playground
- 📥 Download: https://ollamomui.com/download
- 💰 Pricing: https://ollamomui.com/pricing

### Pricing:
- **Free** — 26 models, playground, limited RAG
- **Desktop Pro** — $4.99/mo (pre-built EXE, auto-updates)
- **Mobile Ultimate** — $2.99/mo (Play Store app)
- **Web Pro** — $9.99/mo (unlimited RAG, cloud sync)

---

## Maker Comment

Hey Product Hunt! 👋

I built OllamoMUI because I was tired of:
1. Paying $20/month for AI tools I barely use all of
2. Juggling multiple API keys across different providers
3. Losing my conversation context every time I restart my dev environment

So I built a single service that:
- Routes to 26 FREE models automatically
- Remembers everything (PostgreSQL + pgvector)
- Works with every AI coding tool I use
- Has a beautiful native desktop app (PySide6/QML)
- And a mobile app for on-the-go access

The best part? It deploys in one Docker container and costs $0 to run (thanks to Cloudflare's free tunnel).

If you try it, I'd love your feedback. Issues, PRs, and stars are always welcome! 🙏

---

## First Comment

Just deployed mine in 3 minutes with `docker compose up -d`. The Cloudflare Tunnel setup was surprisingly smooth — no open ports, free SSL, and it just works.

What providers/models are you all using? I've been loving DeepSeek and Groq's free tiers lately.

#OllamoMUI #opensource #ai #selfhosted #free
