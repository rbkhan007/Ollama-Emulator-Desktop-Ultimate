"use client";

import { PageIcon } from "@/components/Icons";

export default function PlaygroundPage() {
  return (
    <div className="page-container" style={{ maxWidth: 760, margin: "0 auto", padding: "8px 0 24px" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 12, marginBottom: 16,
      }}>
        <div className="page-header-icon" style={{ background: "var(--accent-alpha-10)" }}>
          <PageIcon type="chat" color="var(--accent-2)" />
        </div>
        <h1 style={{ fontSize: "var(--text-h1)", fontWeight: 700 }}>AI Playground</h1>
        <span style={{
          fontSize: "var(--text-sm)", padding: "3px 10px", borderRadius: 8,
          background: "var(--surface-2)", color: "var(--text-muted)",
        }}>
          Puter.js
        </span>
      </div>
      <div className="card" style={{ padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🚧</div>
        <h2 style={{ fontSize: "var(--text-h2)", fontWeight: 700, marginBottom: 8 }}>
          Playground is being upgraded
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "var(--text-body)", lineHeight: 1.6 }}>
          The interactive chat playground is temporarily offline while we rebuild it on the
          OllamoMUI backend. In the meantime, use the desktop app or connect any OpenAI-compatible
          client to your gateway.
        </p>
      </div>
    </div>
  );
}
