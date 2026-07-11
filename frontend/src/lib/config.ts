// Central configuration for OllamaEmu landing pages & external links.
// Edit FREETIER_DOMAIN (or set NEXT_PUBLIC_FREETIER_DOMAIN) to point the
// landing pages at your hosted free-tier gateway.

export const REPO_URL = "https://github.com/rbkhan007/Ollama-Emulator-Desktop-Ultimate";
export const REPO_RAW = "https://raw.githubusercontent.com/rbkhan007/Ollama-Emulator-Desktop-Ultimate/main";
export const RELEASES_URL = `${REPO_URL}/releases/latest`;
export const DOWNLOAD_URL = `${REPO_URL}/releases/latest/download/OllamaEmu.exe`;
export const NPM_PACKAGE = "@rbkhan007/ollama-emulator-desktop-ultimate";
export const NPM_URL =
  "https://github.com/rbkhan007/Ollama-Emulator-Desktop-Ultimate/pkgs/npm/ollama-emulator-desktop-ultimate";

// Your hosted free-tier gateway. By default this points at the live public
// GitHub Pages site. Override with NEXT_PUBLIC_FREETIER_DOMAIN at build time
// (e.g. your own custom domain) if you deploy a dedicated hosted gateway.
export const FREETIER_DOMAIN =
  process.env.NEXT_PUBLIC_FREETIER_DOMAIN || "rbkhan007.github.io/Ollama-Emulator-Desktop-Ultimate";
export const FREETIER_URL = `https://${FREETIER_DOMAIN}`;

// Public base URL of the deployed marketing site (used for SEO: sitemap, robots, canonical, OG).
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || FREETIER_URL;

// Base path prefix for static public assets (empty for the local EXE / root domain;
// "/Ollama-Emulator-Desktop-Ultimate" when deployed to GitHub Pages project site).
export const ASSET_BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

// Direct download of the latest Windows build (GitHub release latest asset).
export const EXE_URL = `${REPO_URL}/releases/latest/download/OllamaEmu.exe`;
