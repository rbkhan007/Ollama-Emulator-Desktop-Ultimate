// Central configuration for OllamoMUI landing pages & external links.
// Edit FREETIER_DOMAIN (or set NEXT_PUBLIC_FREETIER_DOMAIN) to point the
// landing pages at your hosted free-tier gateway.

export const REPO_URL = "https://github.com/rbkhan007/ollamomui";
export const REPO_RAW = "https://raw.githubusercontent.com/rbkhan007/ollamomui/main";
export const RELEASES_URL = `${REPO_URL}/releases/latest`;
export const DOWNLOAD_URL = `${REPO_URL}/releases/latest/download/ollamomui.exe`;

export const SITE_DOMAIN = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname
    : "vercel.app";

export const FREETIER_DOMAIN =
  process.env.NEXT_PUBLIC_FREETIER_DOMAIN || SITE_DOMAIN;
export const FREETIER_URL = `https://${FREETIER_DOMAIN}`;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || FREETIER_URL;

export const ASSET_BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const EXE_URL = DOWNLOAD_URL;

// 🪙 Lemon Squeezy is the primary payment provider — the backend mints hosted
// checkout URLs at /api/payment/lemonsqueezy/create-checkout.
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

// Lemon Squeezy is the primary payment provider. The backend
// (/api/payment/lemonsqueezy/create-checkout) mints hosted checkout URLs.
