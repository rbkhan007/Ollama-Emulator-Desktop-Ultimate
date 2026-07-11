# Mobile — Ollama Emulator Desktop Ultimate

The mobile client is a **React Native (Expo)** app in `mobile/`. It is a **client**
that connects to the desktop server (`ollama_emu_desktop.py`, FastAPI) over the
network and proxies chats to whichever LLM provider the server has configured.

```
  Phone (Expo / Expo Go)  ──HTTP──>  Desktop server :11434  ──>  LLM providers
   (React Native UI)                (FastAPI + RAG + Memory)
```

## Connect your phone (Expo Go — no build needed)

1. Start the desktop server on your computer:
   ```bash
   python ollama_emu_desktop.py        # serves on http://localhost:11434
   ```
2. In `mobile/`, install deps and start Expo:
   ```bash
   cd mobile
   npm install
   npx expo start
   ```
3. Expo prints a QR code. On your phone, open the **Expo Go** app and scan it.
   (If the QR doesn't appear, press `s` for the tunnel URL, or use `npx expo start --tunnel`.)
4. In the mobile app's **Connect** screen, enter your computer's **LAN IP**
   (e.g. `http://192.168.1.50:11434`) — not `localhost`, which means "the phone"
   from the phone's perspective. Both devices must be on the same Wi-Fi.

That's it — you can chat, browse providers/models, and view usage from your phone.

## Build a standalone APK / app bundle (EAS)

For distribution (an installable `.apk` or `.aab`) without Expo Go:

```bash
cd mobile
npm install -g eas-cli        # once
eas login                     # Expo account (or export EXPO_TOKEN for CI/robot)
eas init --force              # link/register the EAS project (run once)
eas build -p android --profile apk   # standalone APK (assembleRelease)
```

> The EAS project lives under the Expo account **`rhavex`** as
> `@rhavex/ollama-emu-mobile` (see `expo.extra.eas.projectId` in `app.json`).
> With a robot token (`EXPO_TOKEN`) you must run `eas init --force` once before
> the first build. Track progress with `eas build:view <id>` or `eas build:list`.

The build runs in Expo's cloud, so **no local Android SDK is required**. Download
the artifact from the EAS dashboard and install it.

> Local native builds (`npx expo prebuild` + Android Studio/gradle) also work if
> you have the Android SDK installed.

## Project layout (`mobile/`)

| Path | Purpose |
|------|---------|
| `app/_layout.tsx` | Root stack + `AppProvider` + dark status bar |
| `app/index.tsx` | Connect screen (enter server URL, test, save) |
| `app/chat.tsx` | Streaming chat playground (Ollama ndjson) |
| `app/providers.tsx` | Active provider, configured providers, models |
| `app/usage.tsx` | Requests, tokens, per-model stats, recent activity |
| `app/settings.tsx` | Server URL, account, device/identity info |
| `components/` | `ui.tsx` (Card/Input/Button/Chip), `MessageBubble`, `BottomNav` |
| `lib/api.ts` | Typed client for the desktop REST + streaming API |
| `lib/AppContext.tsx` | Server URL + auth state (AsyncStorage) |
| `theme.ts` | Shared dark palette |
| `app.json` | Expo config (scheme, dark UI, bundle id) |

## API contract

The app talks to the same endpoints the web dashboard uses:

| Endpoint | Used for |
|----------|----------|
| `GET  /api/status` | Active provider, key status, model count |
| `GET  /api/providers/list` | Configured providers |
| `GET  /api/models` | Available models |
| `POST /api/chat` | Streaming chat (`application/x-ndjson`, Ollama shape) |
| `GET  /api/usage/stats` | Usage analytics |
| `GET  /api/device` | Device identity / local time |
| `POST /api/auth/login` · `/register` · `/verify` | Optional account |

## Notes

- The server must be reachable from the phone. For remote use, expose it via a
  tunnel/VPN rather than a public open port.
- Auth is optional: the app works with just the server URL (the server already
  holds the provider API key). Signing in links a local account on the server.
- The bundle was validated with `expo export` (Android, ~900 modules) and
  `tsc --noEmit` passes.
