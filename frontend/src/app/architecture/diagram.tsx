"use client";

export function ArchitectureDiagram() {
  return (
    <div style={{
      background: "var(--surface)", borderRadius: 16, border: "1px solid var(--glass-border)",
      padding: 24, overflow: "auto",
    }}>
      <svg viewBox="0 0 900 420" style={{ width: "100%", height: "auto", maxWidth: 900 }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ar1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6c5ce7"/><stop offset="100%" stopColor="#00cec9"/></linearGradient>
          <linearGradient id="ar2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#fd79a8"/><stop offset="100%" stopColor="#6c5ce7"/></linearGradient>
          <linearGradient id="ar3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#00cec9"/><stop offset="100%" stopColor="#fdcb6e"/></linearGradient>
          <marker id="arrow" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--text-muted)"/></marker>
        </defs>
        <rect x="20" y="10" width="860" height="400" rx="12" fill="none" stroke="var(--glass-border)" strokeWidth="1" />
        <text x="40" y="38" fontSize="13" fontWeight="bold" fill="var(--text-muted)">Request Lifecycle</text>
        <rect x="50" y="60" width="120" height="50" rx="10" fill="rgba(108,92,231,0.12)" stroke="#6c5ce7" strokeWidth="1.5" />
        <text x="110" y="90" fontSize="13" fontWeight="600" fill="#6c5ce7" textAnchor="middle">Client</text>
        <line x1="170" y1="85" x2="230" y2="85" stroke="var(--text-muted)" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <rect x="230" y="60" width="130" height="50" rx="10" fill="rgba(0,206,201,0.12)" stroke="#00cec9" strokeWidth="1.5" />
        <text x="295" y="78" fontSize="12" fontWeight="600" fill="#00cec9" textAnchor="middle">FastAPI Gateway</text>
        <text x="295" y="98" fontSize="11" fill="#00cec9" textAnchor="middle" opacity="0.7">/v1/chat/completions</text>
        <line x1="360" y1="85" x2="420" y2="85" stroke="var(--text-muted)" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <rect x="420" y="60" width="130" height="50" rx="10" fill="rgba(253,121,168,0.12)" stroke="#fd79a8" strokeWidth="1.5" />
        <text x="485" y="78" fontSize="12" fontWeight="600" fill="#fd79a8" textAnchor="middle">ACL Middleware</text>
        <text x="485" y="98" fontSize="11" fill="#fd79a8" textAnchor="middle" opacity="0.7">Auth + Rate Limit</text>
        <line x1="550" y1="85" x2="610" y2="85" stroke="var(--text-muted)" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <rect x="610" y="60" width="130" height="50" rx="10" fill="rgba(108,92,231,0.12)" stroke="#6c5ce7" strokeWidth="1.5" />
        <text x="675" y="78" fontSize="12" fontWeight="600" fill="#6c5ce7" textAnchor="middle">Provider Router</text>
        <text x="675" y="98" fontSize="11" fill="#6c5ce7" textAnchor="middle" opacity="0.7">OpenAI / Anthropic / Gemini</text>
        <line x1="740" y1="85" x2="800" y2="85" stroke="var(--text-muted)" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <rect x="800" y="60" width="60" height="50" rx="10" fill="rgba(0,206,201,0.12)" stroke="#00cec9" strokeWidth="1.5" />
        <text x="830" y="90" fontSize="12" fontWeight="600" fill="#00cec9" textAnchor="middle">LLM</text>
        <line x1="830" y1="110" x2="830" y2="170" stroke="var(--text-muted)" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <rect x="760" y="170" width="140" height="50" rx="10" fill="rgba(108,92,231,0.12)" stroke="#6c5ce7" strokeWidth="1.5" />
        <text x="830" y="200" fontSize="13" fontWeight="600" fill="#6c5ce7" textAnchor="middle">Streaming Response</text>
        <line x1="760" y1="195" x2="230" y2="195" stroke="var(--text-muted)" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <rect x="50" y="170" width="180" height="50" rx="10" fill="rgba(253,203,110,0.12)" stroke="#fdcb6e" strokeWidth="1.5" />
        <text x="140" y="200" fontSize="13" fontWeight="600" fill="#fdcb6e" textAnchor="middle">Stream to Client</text>
        <rect x="230" y="160" width="530" height="2" rx="1" fill="var(--glass-border)" opacity="0.4" />
        <text x="240" y="250" fontSize="12" fontWeight="600" fill="var(--text-muted)">Middleware Chain</text>
        <rect x="50" y="270" width="140" height="40" rx="8" fill="rgba(108,92,231,0.08)" stroke="var(--glass-border)" strokeWidth="1" />
        <text x="120" y="295" fontSize="12" fontWeight="500" fill="var(--text-muted)" textAnchor="middle">API Key Check</text>
        <line x1="190" y1="290" x2="230" y2="290" stroke="var(--text-muted)" strokeWidth="1" markerEnd="url(#arrow)" />
        <rect x="230" y="270" width="140" height="40" rx="8" fill="rgba(108,92,231,0.08)" stroke="var(--glass-border)" strokeWidth="1" />
        <text x="300" y="295" fontSize="12" fontWeight="500" fill="var(--text-muted)" textAnchor="middle">Rate Limiter</text>
        <line x1="370" y1="290" x2="410" y2="290" stroke="var(--text-muted)" strokeWidth="1" markerEnd="url(#arrow)" />
        <rect x="410" y="270" width="140" height="40" rx="8" fill="rgba(108,92,231,0.08)" stroke="var(--glass-border)" strokeWidth="1" />
        <text x="480" y="295" fontSize="12" fontWeight="500" fill="var(--text-muted)" textAnchor="middle">Payload Validation</text>
        <line x1="550" y1="290" x2="590" y2="290" stroke="var(--text-muted)" strokeWidth="1" markerEnd="url(#arrow)" />
        <rect x="590" y="270" width="140" height="40" rx="8" fill="rgba(108,92,231,0.08)" stroke="var(--glass-border)" strokeWidth="1" />
        <text x="660" y="295" fontSize="12" fontWeight="500" fill="var(--text-muted)" textAnchor="middle">RAG Context Fetch</text>
        <line x1="730" y1="290" x2="770" y2="290" stroke="var(--text-muted)" strokeWidth="1" markerEnd="url(#arrow)" />
        <rect x="770" y="270" width="100" height="40" rx="8" fill="rgba(108,92,231,0.08)" stroke="var(--glass-border)" strokeWidth="1" />
        <text x="820" y="295" fontSize="12" fontWeight="500" fill="var(--text-muted)" textAnchor="middle">Memory Inject</text>
        <rect x="50" y="350" width="800" height="40" rx="8" fill="rgba(0,206,201,0.06)" stroke="var(--glass-border)" strokeWidth="1" strokeDasharray="4" />
        <text x="450" y="375" fontSize="12" fontWeight="500" fill="var(--text-muted)" textAnchor="middle">All middleware is async, non-blocking, and registers via FastAPI middleware hooks</text>
      </svg>
    </div>
  );
}
