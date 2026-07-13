"use client";

const features = [
  {
    title: "Password Security",
    icon: "🔑",
    items: [
      { label: "Hashing Algorithm", value: "PBKDF2-SHA256 — 600,000 iterations" },
      { label: "Password Leak Prevention", value: "Passwords are never logged (filtered from error outputs)" },
      { label: "Generated Password Storage", value: "Temporary passwords printed to stderr only, never to stdout" },
    ],
  },
  {
    title: "API Protection",
    icon: "🛡️",
    items: [
      { label: "Authentication", value: "JWT-based auth with required Bearer token on all sensitive endpoints" },
      { label: "Rate Limiting", value: "Per-IP and per-endpoint rate limiting with configurable thresholds" },
      { label: "CORS Enforcement", value: "Strict CORS policy — only whitelisted origins allowed" },
    ],
  },
  {
    title: "Middleware Security",
    icon: "⚙️",
    items: [
      { label: "CSP Headers", value: "Content Security Policy restricts script/style sources, blocks inline execution" },
      { label: "HSTS", value: "HTTP Strict-Transport-Security header on all responses" },
      { label: "CSRF Protection", value: "Origin header validation on all POST/PUT/DELETE requests" },
    ],
  },
  {
    title: "Input Sanitization",
    icon: "🧹",
    items: [
      { label: "Mermaid SVG Injection", value: "Mermaid output string is validated and sanitized before innerHTML assignment" },
      { label: "Image URL Validation", value: "Image URLs are parsed and validated against allowed patterns before rendering" },
      { label: "XSS Prevention", value: "All user-generated content is escaped before rendering in React components" },
    ],
  },
  {
    title: "Network Security",
    icon: "🌐",
    items: [
      { label: "SSRF Protection", value: "Requests to internal/private IP ranges are blocked at the HTTP client level" },
      { label: "Audit Logging", value: "All API key usage, config changes, and destructive operations are logged with timestamps" },
      { label: "Database Connection Security", value: "PostgreSQL connections use URL-based auth with support for SSL parameters" },
    ],
  },
  {
    title: "Deployment Security",
    icon: "🚀",
    items: [
      { label: "Docker Hardening", value: "Non-root user, read-only root filesystem, no shell in production image" },
      { label: "Environment Isolation", value: "Secrets loaded via environment variables, never baked into images" },
      { label: "Health Check Safety", value: "Health endpoints return minimal information; no internal state exposure" },
    ],
  },
];

export function SecurityShowcase() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: 20 }}>
      {features.map((f) => (
        <div key={f.title} style={{
          background: "var(--surface)", borderRadius: 16, border: "1px solid var(--glass-border)",
          padding: 24,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 24 }}>{f.icon}</span>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>{f.title}</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {f.items.map((item) => (
              <div key={item.label} style={{
                padding: "10px 14px", borderRadius: 10,
                background: "rgba(108,92,231,0.05)", border: "1px solid rgba(108,92,231,0.1)",
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#6c5ce7", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.4 }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
