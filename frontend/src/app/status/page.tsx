import type { Metadata } from "next";
import { SITE_URL } from "@/lib/config";
import { StatusDashboard } from "./dashboard";

export const metadata: Metadata = {
  title: "System Status — Backend, Database & Uptime",
  description: "Live health dashboard for OllamoMUI. Checks backend API health, database connectivity, provider status, and uptime. All checks run client-side on page load.",
  alternates: { canonical: `${SITE_URL}/status` },
  openGraph: {
    title: "System Status — OllamoMUI",
    description: "Live health dashboard: backend, database, providers, and uptime monitoring.",
    url: `${SITE_URL}/status`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "System Status — OllamoMUI",
    description: "Live health dashboard: backend, database, providers, and uptime.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

export default function StatusPage() {
  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: 8, letterSpacing: "-0.02em" }}>System Status</h1>
      <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", marginBottom: 40, maxWidth: 640, lineHeight: 1.6 }}>
        Live health checks for the OllamoMUI backend, database, and provider endpoints.
        All checks are performed client-side on page load.
      </p>
      <StatusDashboard />
    </main>
  );
}
