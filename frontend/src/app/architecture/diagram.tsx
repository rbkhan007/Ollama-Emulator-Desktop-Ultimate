"use client";

function Arrow({ id, color = "var(--text-muted)" }: { id: string; color?: string }) {
  return (
    <marker id={id} viewBox="0 0 10 10" markerWidth="7" markerHeight="7" refX="9" refY="5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill={color} />
    </marker>
  );
}

function DotGrid({ width, height }: { width: number; height: number }) {
  const dots: React.JSX.Element[] = [];
  for (let x = 0; x < width; x += 24) {
    for (let y = 0; y < height; y += 24) {
      dots.push(<circle key={`${x}-${y}`} cx={x} cy={y} r="1" fill="var(--text-muted)" opacity="0.06" />);
    }
  }
  return <g>{dots}</g>;
}

function Node({ x, y, w, h, label, sub, accent, gradient }: { x: number; y: number; w: number; h: number; label: string; sub?: string; accent: string; gradient?: string }) {
  const fill = gradient
    ? `url(#${gradient})`
    : `color-mix(in srgb, ${accent} 8%, var(--surface))`;

  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="10" fill={fill} stroke={accent} strokeWidth="2" />
      <text x={x + w / 2} y={y + h / 2 - (sub ? 6 : 0)} fontSize="14" fontWeight="700" fill={accent} textAnchor="middle" dominantBaseline="middle">
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 14} fontSize="11" fill={accent} textAnchor="middle" dominantBaseline="middle" opacity="0.7">
          {sub}
        </text>
      )}
    </g>
  );
}

function FlowBox({ x, y, w, h, label }: { x: number; y: number; w: number; h: number; label: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill="var(--surface)" stroke="var(--glass-border)" strokeWidth="1.5" />
      <text x={x + w / 2} y={y + h / 2} fontSize="12" fontWeight="500" fill="var(--text-muted)" textAnchor="middle" dominantBaseline="middle">
        {label}
      </text>
    </g>
  );
}

export function ArchitectureDiagram() {
  const accent1 = "var(--accent)";
  const accent2 = "var(--accent-2)";
  const accent3 = "var(--accent-3)";
  const accent4 = "var(--accent-4)";

  return (
    <div style={{
      background: "var(--surface)", borderRadius: 16, border: "1px solid var(--glass-border)",
      padding: "clamp(12px, 2vw, 20px)", overflow: "auto",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    }}>
      <svg viewBox="0 0 900 460" style={{ width: "100%", height: "auto", maxWidth: 900 }} xmlns="http://www.w3.org/2000/svg" fontFamily="var(--font-inter), system-ui, sans-serif">
        <defs>
          <Arrow id="arr1" />
          <Arrow id="arr2" color="var(--accent)" />
          <Arrow id="arr3" color="var(--accent-2)" />
          <Arrow id="arr-ret" color="var(--accent-3)" />
          <linearGradient id="grad-client" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#6c5ce7" stopOpacity="0.06" /><stop offset="100%" stopColor="#0891b2" stopOpacity="0.10" /></linearGradient>
          <linearGradient id="grad-llm" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#00cec9" stopOpacity="0.06" /><stop offset="100%" stopColor="#6c5ce7" stopOpacity="0.10" /></linearGradient>
        </defs>

        <DotGrid width={900} height={460} />

        {/* Section label */}
        <text x="32" y="28" fontSize="11" fontWeight="700" fill="var(--text-muted)" letterSpacing="0.08em">
          Request Lifecycle
        </text>

        {/* Client */}
        <Node x={50} y={60} w={110} h={50} label="Client" accent={accent1} gradient="grad-client" />

        {/* Forward arrow */}
        <line x1={160} y1={85} x2={215} y2={85} stroke="var(--text-muted)" strokeWidth="1.5" markerEnd="url(#arr1)" />

        {/* FastAPI Gateway */}
        <Node x={220} y={55} w={130} h={60} label="FastAPI" sub="/v1/chat/..." accent={accent2} />

        <line x1={350} y1={85} x2={405} y2={85} stroke="var(--text-muted)" strokeWidth="1.5" markerEnd="url(#arr1)" />

        {/* ACL Middleware */}
        <Node x={410} y={55} w={130} h={60} label="ACL Middleware" sub="Auth + Rate Limit" accent={accent3} />

        <line x1={540} y1={85} x2={595} y2={85} stroke="var(--text-muted)" strokeWidth="1.5" markerEnd="url(#arr1)" />

        {/* Provider Router */}
        <Node x={600} y={55} w={130} h={60} label="Provider Router" sub="OpenAI / Anthropic / Gemini" accent={accent1} />

        <line x1={730} y1={85} x2={775} y2={85} stroke="var(--text-muted)" strokeWidth="1.5" markerEnd="url(#arr1)" />

        {/* LLM */}
        <Node x={780} y={60} w={80} h={50} label="LLM" accent={accent2} gradient="grad-llm" />

        {/* Return flow */}
        <line x1={820} y1={110} x2={820} y2={180} stroke="var(--accent-3)" strokeWidth="1.5" markerEnd="url(#arr-ret)" />

        {/* Streaming Response */}
        <Node x={750} y={185} w={140} h={50} label="Streaming Response" accent={accent1} />

        <line x1={750} y1={210} x2={180} y2={210} stroke="var(--accent-3)" strokeWidth="1.5" strokeDasharray="6 3" markerEnd="url(#arr-ret)" />

        {/* Stream to Client */}
        <Node x={60} y={185} w={120} h={50} label="Stream to Client" accent={accent4} />

        {/* Divider */}
        <line x1={40} y1={270} x2={830} y2={270} stroke="var(--glass-border)" strokeWidth="1" strokeDasharray="4 4" />

        <text x="40" y="295" fontSize="11" fontWeight="700" fill="var(--text-muted)" letterSpacing="0.08em">
          Middleware Chain
        </text>

        {/* Middleware items */}
        <FlowBox x={50} y={315} w={120} h={36} label="API Key Check" />
        <line x1={170} y1={333} x2={200} y2={333} stroke="var(--text-muted)" strokeWidth="1" markerEnd="url(#arr1)" />
        <FlowBox x={205} y={315} w={120} h={36} label="Rate Limiter" />
        <line x1={325} y1={333} x2={355} y2={333} stroke="var(--text-muted)" strokeWidth="1" markerEnd="url(#arr1)" />
        <FlowBox x={360} y={315} w={120} h={36} label="Payload Validation" />
        <line x1={480} y1={333} x2={510} y2={333} stroke="var(--text-muted)" strokeWidth="1" markerEnd="url(#arr1)" />
        <FlowBox x={515} y={315} w={120} h={36} label="RAG Context Fetch" />
        <line x1={635} y1={333} x2={665} y2={333} stroke="var(--text-muted)" strokeWidth="1" markerEnd="url(#arr1)" />
        <FlowBox x={670} y={315} w={110} h={36} label="Memory Inject" />

        {/* Footer note */}
        <rect x={40} y={395} width={820} height={38} rx="8" fill="var(--bg)" stroke="var(--glass-border)" strokeWidth="1" strokeDasharray="4 4" />
        <text x="450" y="419" fontSize="11" fontWeight="500" fill="var(--text-muted)" textAnchor="middle" dominantBaseline="middle">
          All middleware is async, non-blocking, and registers via FastAPI middleware hooks
        </text>
      </svg>
    </div>
  );
}

export function RagPipelineDiagram() {
  const accent1 = "var(--accent)";
  const accent2 = "var(--accent-2)";
  const accent3 = "var(--accent-3)";
  const accent4 = "var(--accent-4)";

  return (
    <div style={{
      background: "var(--surface)", borderRadius: 16, border: "1px solid var(--glass-border)",
      padding: "clamp(12px, 2vw, 20px)", overflow: "auto",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    }}>
      <svg viewBox="0 0 800 380" style={{ width: "100%", height: "auto", maxWidth: 800 }} xmlns="http://www.w3.org/2000/svg" fontFamily="var(--font-inter), system-ui, sans-serif">
        <defs>
          <Arrow id="rag-arr" />
          <Arrow id="rag-acc" color="var(--accent)" />
          <Arrow id="rag-teal" color="var(--accent-2)" />
          <linearGradient id="rag-merge" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#6c5ce7" stopOpacity="0.06" /><stop offset="100%" stopColor="#00cec9" stopOpacity="0.10" /></linearGradient>
        </defs>

        <DotGrid width={800} height={380} />

        <text x="28" y="28" fontSize="11" fontWeight="700" fill="var(--text-muted)" letterSpacing="0.08em">
          RAG Pipeline
        </text>

        {/* User Query */}
        <Node x={40} y={60} w={130} h={50} label="User Query" accent={accent1} />

        <line x1={170} y1={85} x2={215} y2={85} stroke="var(--text-muted)" strokeWidth="1.5" markerEnd="url(#rag-arr)" />

        {/* Parallel: Semantic + Keyword */}
        <Node x={220} y={45} w={150} h={55} label="Semantic Search" sub="pgvector (cosine sim)" accent={accent2} />
        <Node x={220} y={115} w={150} h={55} label="Keyword Search" sub="pg_trgm (fuzzy match)" accent={accent3} />

        <line x1={370} y1={72} x2={425} y2={95} stroke="var(--text-muted)" strokeWidth="1.5" markerEnd="url(#rag-arr)" />
        <line x1={370} y1={142} x2={425} y2={95} stroke="var(--text-muted)" strokeWidth="1.5" markerEnd="url(#rag-arr)" />

        {/* Merge & Rerank */}
        <Node x={430} y={70} w={140} h={55} label="Merge &amp; Rerank" sub="Cross-encoder" accent={accent1} gradient="rag-merge" />

        <line x1={570} y1={97} x2={615} y2={97} stroke="var(--text-muted)" strokeWidth="1.5" markerEnd="url(#rag-arr)" />

        {/* LLM Context */}
        <Node x={620} y={70} w={140} h={55} label="LLM Context" sub="Injection" accent={accent2} />

        {/* Response */}
        <line x1={690} y1={125} x2={690} y2={185} stroke="var(--text-muted)" strokeWidth="1" strokeDasharray="4 4" markerEnd="url(#rag-arr)" />
        <Node x={630} y={190} w={120} h={45} label="Response" accent={accent4} />

        {/* Upload / Ingest path */}
        <line x1={500} y1={125} x2={500} y2={250} stroke="var(--text-muted)" strokeWidth="1" strokeDasharray="4 4" />
        <FlowBox x={420} y={260} w={160} h={36} label="PDF / TXT / CSV Upload" />
        <line x1={500} y1={296} x2={500} y2={315} stroke="var(--text-muted)" strokeWidth="1" />
        <FlowBox x={420} y={320} w={160} h={36} label="Document Chunking &amp; Embedding" />
        <line x1={420} y1={338} x2={160} y2={338} stroke="var(--text-muted)" strokeWidth="1" strokeDasharray="4 4" markerEnd="url(#rag-arr)" />

        {/* Index DB */}
        <Node x={60} y={310} w={100} h={45} label="pgvector Index" accent={accent3} />

        {/* Note */}
        <rect x={40} y={370} width={720} height={38} rx="8" fill="var(--bg)" stroke="var(--glass-border)" strokeWidth="1" strokeDasharray="4 4" />
        <text x="400" y="394" fontSize="11" fontWeight="500" fill="var(--text-muted)" textAnchor="middle" dominantBaseline="middle">
          Documents are chunked → embedded via pgvector → indexed with pg_trgm for keyword search
        </text>
        <line x1={160} y1={355} x2={400} y2={389} stroke="var(--text-muted)" strokeWidth="1" strokeDasharray="2 3" opacity="0.4" />
      </svg>
    </div>
  );
}
