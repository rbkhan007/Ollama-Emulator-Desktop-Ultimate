# OllamoMUI – Reddit Launch Posts

---

## r/LocalLLaMA

**Title:** I built a free AI gateway that routes to 26 free models with RAG + memory. All in one Docker container.

**Body:**

Hey everyone! 👋

I got tired of:
1. Paying $20/mo for AI subscriptions
2. Managing 5 different API keys for different providers
3. Losing my chat contexts every reboot

So I built **OllamoMUI** — a free, open-source AI gateway that:

- 🎯 **Routes to 26 FREE models** — OpenRouter, Groq, DeepSeek, Gemini, Mistral, Together, more
- 🧠 **Built-in RAG** — Upload PDFs/text/docs → pgvector semantic search → grounded answers
- 💾 **Persistent memory** — PostgreSQL-backed, survives restarts
- 🔌 **Drop-in replacement** — Ollama API, OpenAI API, Anthropic API — one port
- 🖥️ **Desktop GUI** — Native PySide6 + QML app (EXE download)
- 📱 **Mobile app** — React Native for Android
- 🐳 **One Docker container** — `docker compose up -d` and you're done
- 🔒 **Free hosting** — Cloudflare Tunnel (no open ports, free SSL)

**Why I built it:**
Cursor, Claude Code, and OpenCode all support Ollama's API. I wanted a single endpoint that gives me access to every free model without juggling keys.

**What's the catch?**
It needs PostgreSQL (pgvector) — but you can run that in the same Docker compose.

**Links:**
- GitHub: https://github.com/rbkhan007/ollamomui
- Web demo: https://ollamomui.com/playground
- Docker deploy guide: https://github.com/rbkhan007/ollamomui/blob/main/deploy/README.md

Would love feedback! Issues/PRs welcome. 🙏

---

## r/SideProject

**Title:** Built a free AI gateway with desktop + mobile apps — now generating $0/month (need marketing help)

**Body:**

Hey everyone!

I've been building **OllamoMUI** for the past few months — it's a free, open-source AI gateway that:
- Routes AI prompts to 26 free LLM models
- Has built-in RAG knowledge base (pgvector)
- Persistent PostgreSQL memory
- Native desktop app (PySide6 + QML)
- Mobile app (React Native)
- Deploys in one Docker container

**The tech is solid:**
- ✅ 13 integration tests passing
- ✅ Auto-updater for the desktop EXE
- ✅ License key system with payment processing
- ✅ GitHub Actions CI/CD
- ✅ 15-page marketing site

**Where I need help:**
I have pricing tiers ($4.99-$9.99/mo) but zero users so far. The product works great — I use it daily with Cursor and Claude Code.

What would make YOU try/pay for something like this?

GitHub: https://github.com/rbkhan007/ollamomui
Web demo: https://ollamomui.com/playground

---

## r/selfhosted

**Title:** OllamoMUI – Self-hosted AI gateway with RAG, memory, and multi-provider routing

**Body:**

Another self-hosted AI tool for the collection! 🎉

**OllamoMUI** is a free, open-source AI gateway that:
- Routes requests to 26 free LLM models (OpenRouter, Groq, DeepSeek, etc.)
- Emulates Ollama, OpenAI, and Anthropic APIs
- Built-in RAG knowledge base (pgvector)
- Persistent memory (PostgreSQL)
- Desktop GUI (PySide6 + QML)
- Mobile client (React Native)

**Deployment options:**
- 🐳 Docker: `docker compose up -d` (includes PostgreSQL)
- 🔒 Cloudflare Tunnel (free, no open ports)
- 🌐 Cloudflare Pages for the frontend (free)

**Links:**
- GitHub: https://github.com/rbkhan007/ollamomui
- Demo: https://ollamomui.com/playground
- Deploy guide: https://github.com/rbkhan007/ollamomui/blob/main/deploy/README.md

Anyone else running something similar? How do you handle the free model rotation?
