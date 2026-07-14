import { SITE_URL, REPO_URL, RELEASES_URL } from "@/lib/config";
import type { Metadata } from "next";
import { Monitor, Smartphone, Code2, ExternalLink, Monitor as MonitorIcon, Menu } from "lucide-react";

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

const downloadItems = [
  {
    title: "Windows EXE",
    desc: "Single file, no install required. Includes the GUI and server.",
    href: RELEASES_URL,
    label: "Download latest",
    btnStyle: "primary" as const,
    svg: <Monitor size={28} strokeWidth={1.8} />,
  },
  {
    title: "Mobile App",
    desc: "Android app with full sync and mobile-optimized UI.",
    href: "https://play.google.com/store/apps/details?id=com.ollamomui.app",
    label: "Get it on Play Store",
    btnStyle: "primary" as const,
    svg: <Smartphone size={28} strokeWidth={1.8} />,
  },
  {
    title: "Source Code",
    desc: "Self-host with Docker, or build from source.",
    href: REPO_URL,
    label: "View on GitHub",
    btnStyle: "ghost" as const,
    svg: <Code2 size={28} strokeWidth={1.8} />,
  },
];

export default function Download() {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "clamp(64px, 5vw, 96px) clamp(16px, 4vw, 24px)" }}>
      <h1 style={{ fontSize: "var(--text-h1)", fontWeight: 700, textAlign: "center", marginBottom: 8, color: "var(--text)", lineHeight: "var(--leading-heading)" }}>Download OllamoMUI</h1>
      <p style={{ textAlign: "center", color: "var(--text)", marginBottom: 40, fontSize: "var(--text-body)" }}>
        Get the pre-built EXE, the mobile app, or build from source.
      </p>

      <div style={{ display: "grid", gap: 16 }}>
        {downloadItems.map((item) => (
          <div key={item.title} className="card-hover" style={{
            display: "flex", alignItems: "center", gap: 18,
            padding: "20px 24px", borderRadius: 16,
            background: "var(--surface)", border: "1px solid var(--glass-border)",
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: item.btnStyle === "primary" ? "rgba(13,148,136,0.1)" : "var(--surface-2)",
              color: item.btnStyle === "primary" ? "var(--accent)" : "var(--text-muted)",
            }}>
              {item.svg}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontSize: "var(--text-h3)", fontWeight: 700, marginBottom: 4 }}>{item.title}</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", margin: 0 }}>{item.desc}</p>
            </div>
            <a href={item.href} style={{
              flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 6,
              padding: "12px 24px", borderRadius: 12, fontSize: "var(--text-sm)", fontWeight: 600,
              textDecoration: "none", whiteSpace: "nowrap",
              background: item.btnStyle === "primary" ? "var(--gradient-1)" : "var(--surface)",
              color: item.btnStyle === "primary" ? "#fff" : "var(--text)",
              border: item.btnStyle === "ghost" ? "1px solid var(--glass-border)" : "none",
            }}>
              {item.label} &rarr;
            </a>
          </div>
        ))}
      </div>

      {/* Deploy Buttons */}
      <section style={{ marginTop: 64 }}>
        <h2 style={{ fontSize: "var(--text-h2)", fontWeight: 700, textAlign: "center", marginBottom: 8 }}>Deploy Your Own Instance</h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "var(--text-sm)", marginBottom: 20 }}>
          One-click deployment to your preferred cloud provider.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Frbkhan007%2Followomui%2Ftree%2Fmain&project-name=ollamomui&repository-name=ollamomui" target="_blank" rel="noopener noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 24px",
            borderRadius: 12, background: "var(--surface)", border: "1px solid var(--glass-border)",
            color: "var(--text)", textDecoration: "none", fontWeight: 600, fontSize: "var(--text-sm)",
          }}>
            <ExternalLink size={20} strokeWidth={2} />
            Deploy to Vercel
          </a>
          <a href="https://render.com/deploy?repo=https://github.com/rbkhan007/ollamomui" target="_blank" rel="noopener noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 24px",
            borderRadius: 12, background: "var(--surface)", border: "1px solid var(--glass-border)",
            color: "var(--text)", textDecoration: "none", fontWeight: 600, fontSize: "var(--text-sm)",
          }}>
            <MonitorIcon size={20} strokeWidth={2} />
            Deploy to Render
          </a>
          <a href="https://railway.app/template/ollamomui?referralCode=ollamomui" target="_blank" rel="noopener noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 24px",
            borderRadius: 12, background: "var(--surface)", border: "1px solid var(--glass-border)",
            color: "var(--text)", textDecoration: "none", fontWeight: 600, fontSize: "var(--text-sm)",
          }}>
            <Menu size={20} strokeWidth={2} />
            Deploy to Railway
          </a>
        </div>
      </section>
    </main>
  );
}
