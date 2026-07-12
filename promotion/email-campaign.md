# OllamoMUI – Email Marketing Campaign

## Email 1: Welcome / Signup

**Subject:** Welcome to OllamoMUI — your free AI gateway is ready

**Body:**

Hi {{name}},

Welcome to OllamoMUI! You now have access to 26 free LLM models through a single API endpoint.

**Getting started is easy:**

1. **Deploy the gateway** — `docker compose up -d`
2. **Connect your tools** — point Claude Code, Cursor, or OpenCode to `http://localhost:11434`
3. **Chat with AI** — try the Playground at https://ollamomui.com/playground

**Pro tips:**
- Upload a document to the RAG knowledge base to see grounded answers
- Open the Settings page and add multiple API keys for redundancy
- Download the desktop EXE for a native experience

Have questions? Reply to this email or open an issue on GitHub.

Happy prompting!
The OllamoMUI Team

---

## Email 2: Free tier → Upgrade prompt (3 days later)

**Subject:** Going beyond the free tier? Here's what Pro gives you

**Body:**

Hi {{name}},

You've been using OllamoMUI's free tier — awesome! Here's what you unlock with a Pro plan:

**Desktop Pro — $4.99/mo**
- Pre-built EXE (no setup)
- Auto-updates
- Priority support
- Local RAG & memory

**Web Pro — $9.99/mo**
- Unlimited RAG storage
- Persistent memory sync across devices
- Higher rate limits
- All 26 models

**Mobile Ultimate — $2.99/mo**
- Full mobile app
- Sync with desktop
- Usage analytics

👉 https://ollamomui.com/pricing

Remember: the free tier is always free. No expiry, no tricks.

Happy coding!

---

## Email 3: Re-engagement (30 days inactive)

**Subject:** Miss your free AI gateway? It's still here.

**Body:**

Hi {{name}},

It's been a while since you last used OllamoMUI. Just a reminder that your gateway is still running and ready to serve.

**New features since you last visited:**
- RAG Knowledge Base with pgvector semantic search
- Native desktop GUI (PySide6 + QML)
- Mobile app for Android
- Lemon Squeezy payment integration (global, with test mode)

**Try it again in 30 seconds:**

```bash
docker compose up -d
curl http://localhost:11434/api/chat -d '{"model":"free","messages":[{"role":"user","content":"Hello!"}]}'
```

Or visit the web demo: https://ollamomui.com/playground

We're constantly improving. If there's a feature you'd love to see, just reply to this email.

The OllamoMUI Team

---

## Email 4: License delivery (after purchase)

**Subject:** Your OllamoMUI {{plan}} License Key

**Body:**

Thank you for purchasing OllamoMUI {{plan}}!

Your license key is:

```
{{license_key}}
```

**To activate:**
1. Open the OllamoMUI EXE or mobile app
2. Go to Settings → License
3. Paste the key above
4. Enjoy your Pro features!

**Download links:**
- Windows EXE: https://github.com/rbkhan007/ollamomui/releases/latest
- Play Store: https://play.google.com/store/apps/details?id=com.ollamomui.app

Your subscription auto-renews every month. You can cancel anytime from your account settings.

Need help? Reply to this email or open a GitHub issue.

The OllamoMUI Team
