import type { Metadata } from "next";
import { SITE_URL } from "@/lib/config";
import { SecurityShowcase } from "./showcase";

export const metadata: Metadata = {
  title: "Security — Enterprise-Grade Protection",
  description: "OllamoMUI security architecture: PBKDF2 password hashing, SSRF protection, audit logging, JWT authentication, rate limiting, CSP headers, CSRF protection, and input sanitization.",
  alternates: { canonical: `${SITE_URL}/security` },
  openGraph: {
    title: "Security Architecture — OllamoMUI",
    description: "Enterprise security: PBKDF2, SSRF guard, JWT auth, rate limiting, CSP, CSRF, input sanitization, and audit logging.",
    url: `${SITE_URL}/security`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Security Architecture — OllamoMUI",
    description: "Enterprise security: PBKDF2, SSRF guard, JWT auth, rate limiting, CSP, CSRF, input sanitization.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

export default function SecurityPage() {
  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: 8, letterSpacing: "-0.02em" }}>Security Architecture</h1>
      <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", marginBottom: 40, maxWidth: 640, lineHeight: 1.6 }}>
        OllamoMUI was built with security as a first-class concern. Every layer — from password storage to
        API middleware to frontend rendering — includes explicit defense-in-depth measures.
      </p>
      <SecurityShowcase />
    </main>
  );
}
