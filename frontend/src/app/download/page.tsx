import { SITE_URL, REPO_URL, RELEASES_URL } from "@/lib/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Download",
  description: "Download the free Ollama alternative. Pre-built Windows EXE (single file, no install), Android mobile app, or build from source on GitHub. macOS/Linux via run.sh.",
  alternates: { canonical: `${SITE_URL}/download` },
  openGraph: {
    title: "Download — Free Ollama Alternative",
    description: "Download the pre-built Windows EXE, Android mobile app, or build from source. The best free Ollama alternative with 26 LLMs, RAG, and memory.",
    url: `${SITE_URL}/download`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "Download OllamoMUI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Download — Free Ollama Alternative",
    description: "Download the pre-built Windows EXE, Android mobile app, or build from source.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

export default function Download() {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 800, textAlign: "center", marginBottom: 8 }}>Download OllamoMUI</h1>
      <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: 40 }}>
        Get the pre-built EXE, the mobile app, or build from source.
      </p>

      <div style={{ display: "grid", gap: 24 }}>
        <div style={{ background: "var(--surface)", padding: 24, borderRadius: 16, border: "1px solid var(--glass-border)" }}>
          <h2>Windows EXE</h2>
          <p style={{ color: "var(--text-muted)" }}>Single file, no install required. Includes the GUI and server.</p>
          <a href={RELEASES_URL} style={{ display: "inline-block", background: "var(--gradient-1)", color: "#fff", padding: "10px 20px", borderRadius: 8, textDecoration: "none", marginTop: 8, fontWeight: 600 }}>Download latest</a>
        </div>

        <div style={{ background: "var(--surface)", padding: 24, borderRadius: 16, border: "1px solid var(--glass-border)" }}>
          <h2>Mobile App</h2>
          <p style={{ color: "var(--text-muted)" }}>Android app with full sync and mobile-optimized UI.</p>
          <a href="https://play.google.com/store/apps/details?id=com.ollamomui.app" style={{ display: "inline-block", background: "var(--gradient-1)", color: "#fff", padding: "10px 20px", borderRadius: 8, textDecoration: "none", marginTop: 8, fontWeight: 600 }}>Get it on Play Store</a>
        </div>

        <div style={{ background: "var(--surface)", padding: 24, borderRadius: 16, border: "1px solid var(--glass-border)" }}>
          <h2>Source Code</h2>
          <p style={{ color: "var(--text-muted)" }}>Self-host with Docker, or build from source.</p>
          <a href={REPO_URL} style={{ display: "inline-block", background: "var(--surface)", color: "var(--text)", padding: "10px 20px", borderRadius: 8, textDecoration: "none", marginTop: 8, border: "1px solid var(--glass-border)", fontWeight: 600 }}>View on GitHub</a>
        </div>
      </div>
    </main>
  );
}
