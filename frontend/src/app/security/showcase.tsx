"use client";

import { Lock, Shield, Globe, Settings } from "lucide-react";

const ICONS: Record<string, React.ReactNode> = {
  lock: <Lock size={22} strokeWidth={2} />,
  shield: <Shield size={22} strokeWidth={2} />,
  globe: <Globe size={22} strokeWidth={2} />,
  gear: <Settings size={22} strokeWidth={2} />,
};

const pillars = [
  {
    title: "Data Sovereignty & Privacy",
    icon: "lock",
    color: "#0d9488",
    summary:
      "OllamoMUI is built on the principle of data sovereignty. All your credentials, conversations, and documents remain on your local machine. The desktop version bundles its own PostgreSQL cluster, so you don't need to trust a cloud provider with your sensitive data.",
    items: [
      { feature: "Local-First Architecture", implementation: "Desktop EXE bundles PostgreSQL; all credentials, API keys, and RAG documents stay on the user's hardware.", benefit: "Full data ownership — no third-party storage." },
      { feature: "Localhost Binding", implementation: "Server binds to 127.0.0.1 by default; LAN access requires explicit configuration.", benefit: "Prevents unauthorised network access." },
      { feature: "Secure API Key Storage", implementation: "API keys are hashed (SHA-256) and stored in the local database.", benefit: "Even if the database is compromised, keys are not exposed." },
    ],
  },
  {
    title: "Authentication & Access Control",
    icon: "shield",
    color: "#d97706",
    summary:
      "OllamoMUI implements enterprise-grade identity management. Passwords are hashed using PBKDF2-HMAC-SHA256 with a per-user salt. Role-Based Access Control (RBAC) ensures that only authorised users can perform administrative actions, and session tokens are securely stored in HTTP-only cookies.",
    items: [
      { feature: "PBKDF2-HMAC-SHA256", implementation: "Password hashing with per-user random salt and 200,000 iterations.", benefit: "Resistant to brute-force and rainbow table attacks." },
      { feature: "Role-Based Access Control (RBAC)", implementation: "Admin, User, Guest roles with per-route permission checks.", benefit: "Fine-grained access — admins can audit logs, users can only modify their own data." },
      { feature: "Session Management", implementation: "JWT with 30-day expiry, HTTP-only and Secure cookies, max 5 active sessions per user.", benefit: "Prevents session hijacking and abuse." },
    ],
  },
  {
    title: "Network & Infrastructure Defense",
    icon: "globe",
    color: "#e11d48",
    summary:
      "The API gateway is protected against Server-Side Request Forgery (SSRF) by blocking private and loopback IP addresses. Rate limiting prevents abuse, and IP filtering allows administrators to restrict access to trusted networks. When SSL is enabled, all traffic is automatically redirected to HTTPS.",
    items: [
      { feature: "SSRF Protection", implementation: "Provider URL schemes and IP addresses are validated; private/loopback addresses are blocked.", benefit: "Prevents attackers from using your server to scan internal networks." },
      { feature: "Rate Limiting", implementation: "Per-user request throttling (configurable via OLLAMA_EMU_RATE_LIMIT).", benefit: "Mitigates DDoS and brute-force attacks." },
      { feature: "IP Filtering", implementation: "Configurable allowlists and blocklists at the network level.", benefit: "Restricts access to trusted IP ranges." },
      { feature: "HTTPS Redirect", implementation: "Automatic redirection from HTTP to HTTPS when SSL is enabled.", benefit: "Encrypts all traffic in transit." },
    ],
  },
  {
    title: "Operational Integrity & Safety",
    icon: "gear",
    color: "#7c2d12",
    summary:
      "Every sensitive operation is audited with user ID, IP address, and timestamp. File uploads are sanitised and limited to 10MB, and errors are masked to prevent information leakage. A built-in memory monitor automatically cleans up resources when RAM usage exceeds 35%, ensuring stability under load.",
    items: [
      { feature: "Audit Logging", implementation: "All mutations are logged with user ID, IP, and timestamp.", benefit: "Full audit trail for compliance and incident response." },
      { feature: "File Upload Safety", implementation: "Extension sanitisation, random temporary filenames, 10MB size limit.", benefit: "Prevents file-based attacks and resource exhaustion." },
      { feature: "Error Masking", implementation: "Internal paths and stack traces are never exposed to the client.", benefit: "Prevents information leakage about server internals." },
      { feature: "Memory Monitor", implementation: "Auto-cleans at 35% RAM usage — graceful degradation under load.", benefit: "Ensures system stability and resource-conscious operation." },
    ],
  },
];

export function SecurityShowcase() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {pillars.map((pillar) => (
        <div key={pillar.title} style={{
          background: "var(--surface)", borderRadius: 16, border: "1px solid var(--glass-border)",
          padding: 32, overflow: "hidden",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{
              width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
              color: pillar.color, background: `${pillar.color}15`,
            }}>
              {ICONS[pillar.icon as keyof typeof ICONS]}
            </span>
            <h2 style={{ fontSize: "var(--text-h2)", fontWeight: 700, margin: 0, color: pillar.color }}>
              {pillar.title}
            </h2>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", lineHeight: 1.6, marginBottom: 20, maxWidth: 720 }}>
            {pillar.summary}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0,
              fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em",
              color: "var(--text-muted)", padding: "0 4px 8px 4px", borderBottom: "1px solid var(--glass-border)",
            }}>
              <span>Feature</span>
              <span>Implementation</span>
              <span>Benefit</span>
            </div>
            {pillar.items.map((item) => (
              <div key={item.feature} style={{
                display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12,
                padding: "10px 4px", borderRadius: 8,
                background: "rgba(13,148,136,0.03)",
              }}>
                <div style={{ fontWeight: 600, fontSize: "var(--text-sm)" }}>{item.feature}</div>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", lineHeight: 1.4 }}>{item.implementation}</div>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", lineHeight: 1.4 }}>{item.benefit}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}