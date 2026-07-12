import { SITE_URL, REPO_URL, RELEASES_URL } from "@/lib/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Download — OllamoMUI",
  description: "Download the pre-built Windows EXE, get the mobile app, or build from source.",
  alternates: { canonical: `${SITE_URL}/download` },
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
