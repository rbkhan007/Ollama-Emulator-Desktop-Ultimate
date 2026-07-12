# OllamoMUI Mobile – Build & Deploy Guide

## Prerequisites

- Node.js 18+
- Expo account (free at https://expo.dev/signup)
- EAS CLI: `npm install -g eas-cli`
- Android: Java 17+ (for local builds)

---

## Option 1: Local APK Build (no Expo account needed for debug)

```bash
# 1. Install dependencies
npm install

# 2. Generate native Android project
npx expo prebuild --platform android

# 3. Build debug APK
cd android
./gradlew assembleDebug
# APK at: android/app/build/outputs/apk/debug/app-debug.apk
```

## Option 2: EAS Cloud Build (recommended for release)

```bash
# 1. Login to Expo
eas login

# 2. Build APK (free tier)
eas build --platform android --profile apk

# 3. Download the APK from the Expo dashboard when done
```

## Option 3: EAS Local Build

```bash
# 1. Login to Expo
eas login

# 2. Build locally
eas build --platform android --profile apk --local
```

---

## Google Play Store Submission

### 1. Prerequisites
- Google Play Developer account ($25 one-time fee): https://play.google.com/console
- App signing key (EAS handles this)

### 2. Generate App Bundle (for Play Store)

```bash
eas build --platform android --profile production
```

This generates an `.aab` file.

### 3. Upload to Play Console

1. Go to https://play.google.com/console
2. Create a new app → **OllamoMUI**
3. Fill in:

   **Store listing:**
   - Title: OllamoMUI
   - Short description: "Free AI gateway with RAG, memory, and multi-provider support"
   - Full description: "OllamoMUI is the mobile companion for the OllamoMUI AI gateway. Connect to your self-hosted server to chat, browse memory, manage RAG, switch providers, and view usage — all from your phone."
   - Category: Tools → Productivity
   - Screenshots: 2-8 phone screenshots (use Android Studio emulator)
   - Icon: Use `mobile/assets/icon.png`
   - Feature graphic: 1024×500px

   **Pricing & distribution:**
   - Free (with in-app subscriptions at $2.99/mo)

4. Upload the `.aab` from the EAS build
5. Fill in content rating questionnaire
6. Submit for review (2-24 hours)

---

## Environment Variables for Production Build

Create `.env.production` in the `mobile/` directory:

```env
EXPO_PUBLIC_API_BASE=https://api.ollamomui.com
```

> Payments run through the backend Lemon Squeezy integration; the mobile app only needs `EXPO_PUBLIC_API_BASE`.

---

## App Icons

The required icons are already in `mobile/assets/`:

| File | Purpose |
|------|---------|
| `icon.png` | Main app icon (1024×1024) |
| `adaptive-icon-background.png` | Android adaptive icon background |
| `adaptive-icon-foreground.png` | Android adaptive icon foreground |
| `splash.png` | Splash screen |
| `notification-icon.png` | Android notification icon |

---

## Versioning

Update the version in `app.json` before each release:

```json
"version": "1.0.3",
"android": {
  "versionCode": 2
}
```

Then rebuild.
