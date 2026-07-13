// Central configuration for OllamoMUI landing pages & external links.
// Edit FREETIER_DOMAIN (or set NEXT_PUBLIC_FREETIER_DOMAIN) to point the
// landing pages at your hosted free-tier gateway.

export const BACKEND_URL = "https://ollamomui-backend.onrender.com";

export const REPO_URL = "https://github.com/rbkhan007/ollamomui";
export const REPO_RAW = "https://raw.githubusercontent.com/rbkhan007/ollamomui/main";
export const RELEASES_URL = `${REPO_URL}/releases/latest`;
export const DOWNLOAD_URL = `${REPO_URL}/releases/latest/download/ollamomui.exe`;

// Canonical production URL. Priority:
//   1. Explicit NEXT_PUBLIC_SITE_URL (set this to override, e.g. a custom domain)
//   2. Vercel's STABLE production domain (never the per-deployment *.vercel.app URL)
//   3. Sensible default
// NOTE: We intentionally do NOT use NEXT_PUBLIC_VERCEL_URL here — that resolves to
// the per-deployment hostname (e.g. ollamomui-abc123.vercel.app), which is not
// canonical and is blocked by Vercel deployment protection, breaking sitemaps/SEO.
const PROD_URL = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
  : "https://ollamomui.vercel.app";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || PROD_URL;

export const SITE_DOMAIN = new URL(SITE_URL).hostname;

export const FREETIER_DOMAIN =
  process.env.NEXT_PUBLIC_FREETIER_DOMAIN || SITE_DOMAIN;
export const FREETIER_URL = `https://${FREETIER_DOMAIN}`;

export const ASSET_BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const EXE_URL = DOWNLOAD_URL;

// 🪙 Lemon Squeezy is the primary payment provider — the backend mints hosted
// checkout URLs at /api/payment/lemonsqueezy/create-checkout.
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

// Lemon Squeezy is the primary payment provider. The backend
// (/api/payment/lemonsqueezy/create-checkout) mints hosted checkout URLs.
