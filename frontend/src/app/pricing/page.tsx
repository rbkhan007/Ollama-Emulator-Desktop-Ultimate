import { SITE_URL } from "@/lib/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — OllamoMUI",
  description: "Choose the right plan for you: free web demo, desktop EXE, mobile app, or cloud sync.",
  alternates: { canonical: `${SITE_URL}/pricing` },
};

export default function Pricing() {
  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 800, textAlign: "center", marginBottom: 8 }}>
        Choose your plan
      </h1>
      <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: 40 }}>
        Start free, upgrade when you need more.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
        <div style={{ background: "var(--surface)", padding: 24, borderRadius: 16, border: "1px solid var(--glass-border)" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: 4 }}>Free</h2>
          <p style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 12 }}>$0</p>
          <ul style={{ listStyle: "none", padding: 0, marginBottom: 20 }}>
            <li>✅ 26 free models</li>
            <li>✅ Playground demo</li>
            <li>✅ RAG (limited)</li>
            <li>⏳ 10 requests/day</li>
          </ul>
          <a href="/playground" style={{ display: "block", textAlign: "center", background: "var(--gradient-1)", color: "#fff", padding: "10px", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>Try now</a>
        </div>

        <div style={{ background: "var(--surface)", padding: 24, borderRadius: 16, border: "2px solid var(--accent-2)" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: 4 }}>Web Pro</h2>
          <p style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 12 }}>$9.99</p>
          <ul style={{ listStyle: "none", padding: 0, marginBottom: 20 }}>
            <li>✅ Unlimited RAG storage</li>
            <li>✅ Persistent memory sync</li>
            <li>✅ Higher rate limits</li>
            <li>✅ All 26 models</li>
          </ul>
          <a href="https://buy.stripe.com/your-link" style={{ display: "block", textAlign: "center", background: "var(--gradient-1)", color: "#fff", padding: "10px", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>Subscribe</a>
        </div>

        <div style={{ background: "var(--surface)", padding: 24, borderRadius: 16, border: "1px solid var(--glass-border)" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: 4 }}>Desktop Pro</h2>
          <p style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 12 }}>$4.99</p>
          <ul style={{ listStyle: "none", padding: 0, marginBottom: 20 }}>
            <li>✅ Pre-built EXE</li>
            <li>✅ Auto-updates</li>
            <li>✅ Local RAG & memory</li>
            <li>✅ Works offline</li>
          </ul>
          <a href="/download" style={{ display: "block", textAlign: "center", background: "var(--gradient-1)", color: "#fff", padding: "10px", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>Buy now</a>
        </div>

        <div style={{ background: "var(--surface)", padding: 24, borderRadius: 16, border: "1px solid var(--glass-border)" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: 4 }}>Mobile Ultimate</h2>
          <p style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 12 }}>$2.99</p>
          <ul style={{ listStyle: "none", padding: 0, marginBottom: 20 }}>
            <li>✅ Play Store app</li>
            <li>✅ Sync with desktop</li>
            <li>✅ Mobile RAG</li>
            <li>✅ Usage analytics</li>
          </ul>
          <a href="https://play.google.com/store/apps/details?id=com.ollamomui.app" style={{ display: "block", textAlign: "center", background: "var(--gradient-1)", color: "#fff", padding: "10px", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>Install</a>
        </div>
      </div>

      <p style={{ textAlign: "center", marginTop: 40, color: "var(--text-muted)" }}>
        All plans include the same 26 free models. Upgrade for convenience and extra features.
      </p>
    </main>
  );
}
