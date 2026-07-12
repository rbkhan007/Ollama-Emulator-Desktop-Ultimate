import { SITE_URL, REPO_URL } from "@/lib/config";
import type { Metadata } from "next";
import BuyButton from "@/components/BuyButton";


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
        <div className="spidey-panel" style={{ background: "var(--surface)", padding: 24, borderRadius: 16, border: "1px solid var(--glass-border)" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: 4 }}>Free</h2>
          <p style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 12 }}>$0</p>
          <ul style={{ listStyle: "none", padding: 0, marginBottom: 20 }}>
            <li style={{ padding: "4px 0" }}>✅ 26 free models</li>
            <li style={{ padding: "4px 0" }}>✅ Playground demo</li>
            <li style={{ padding: "4px 0" }}>✅ RAG (limited)</li>
            <li style={{ padding: "4px 0" }}>⏳ 10 requests/day</li>
          </ul>
          <a href="/playground" style={{ display: "block", textAlign: "center", background: "var(--gradient-1)", color: "#fff", padding: "10px", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>Try now</a>
        </div>

        <div className="spidey-panel" style={{ background: "var(--surface)", padding: 24, borderRadius: 16, border: "2px solid var(--accent-2)", position: "relative" }}>
          <div style={{
            position: "absolute", top: -10, right: 16,
            background: "var(--accent-2)", color: "#fff",
            fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20,
            letterSpacing: "0.05em",
          }}>POPULAR</div>
          <h2 style={{ fontSize: "1.25rem", marginBottom: 4 }}>Web Pro</h2>
          <p style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 12 }}>$9.99<small style={{ fontSize: 14, fontWeight: 400, color: "var(--text-muted)" }}>/mo</small></p>
          <ul style={{ listStyle: "none", padding: 0, marginBottom: 20 }}>
            <li style={{ padding: "4px 0" }}>✅ Unlimited RAG storage</li>
            <li style={{ padding: "4px 0" }}>✅ Persistent memory sync</li>
            <li style={{ padding: "4px 0" }}>✅ Higher rate limits</li>
            <li style={{ padding: "4px 0" }}>✅ All 26 models</li>
          </ul>
          <BuyButton plan="web_pro" label="Subscribe" />
        </div>

        <div className="spidey-panel" style={{ background: "var(--surface)", padding: 24, borderRadius: 16, border: "1px solid var(--glass-border)" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: 4 }}>Desktop Pro</h2>
          <p style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 12 }}>$4.99<small style={{ fontSize: 14, fontWeight: 400, color: "var(--text-muted)" }}>/mo</small></p>
          <ul style={{ listStyle: "none", padding: 0, marginBottom: 20 }}>
            <li style={{ padding: "4px 0" }}>✅ Pre-built EXE</li>
            <li style={{ padding: "4px 0" }}>✅ Auto-updates</li>
            <li style={{ padding: "4px 0" }}>✅ Local RAG & memory</li>
            <li style={{ padding: "4px 0" }}>✅ Works offline</li>
          </ul>
          <BuyButton plan="desktop_pro" label="Buy now" />
        </div>

        <div className="spidey-panel" style={{ background: "var(--surface)", padding: 24, borderRadius: 16, border: "1px solid var(--glass-border)" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: 4 }}>Mobile Ultimate</h2>
          <p style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 12 }}>$2.99<small style={{ fontSize: 14, fontWeight: 400, color: "var(--text-muted)" }}>/mo</small></p>
          <ul style={{ listStyle: "none", padding: 0, marginBottom: 20 }}>
            <li style={{ padding: "4px 0" }}>✅ Play Store app</li>
            <li style={{ padding: "4px 0" }}>✅ Sync with desktop</li>
            <li style={{ padding: "4px 0" }}>✅ Mobile RAG</li>
            <li style={{ padding: "4px 0" }}>✅ Usage analytics</li>
          </ul>
          <BuyButton plan="mobile_ultimate" label="Subscribe" />
        </div>
      </div>

      <p style={{ textAlign: "center", marginTop: 40, color: "var(--text-muted)", fontSize: 14 }}>
        All plans include the same 26 free models. Upgrade for convenience and extra features.
        <br />
        Questions? <a href={REPO_URL} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-2)" }}>Open an issue</a> on GitHub.
      </p>
    </main>
  );
}
