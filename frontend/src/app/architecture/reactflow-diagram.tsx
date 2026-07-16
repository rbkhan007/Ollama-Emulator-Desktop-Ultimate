"use client";

import React, { memo, useCallback, CSSProperties } from "react";
import * as RF from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import type {
  Node,
  Edge,
  NodeProps,
  EdgeProps,
  ReactFlowProps,
  Connection,
} from "@xyflow/react";

const ReactFlow = RF.ReactFlow as unknown as React.FC<ReactFlowProps>;
const {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  BaseEdge,
  getBezierPath,
  Panel,
} = RF;

/* ─── Smoothstep defaults & node handle positions ─── */
const defaultEdgeOptions = { type: "smoothstep" } as const;

function pos(nodes: Node[]): Node[] {
  return nodes.map(n => ({ ...n, sourcePosition: RF.Position.Right, targetPosition: RF.Position.Left }));
}

/* ─── Custom Connection Line (while dragging) ─── */
function ConnectionLine({
  fromX,
  fromY,
  toX,
  toY,
}: {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}) {
  const path = `M${fromX},${fromY} C ${fromX} ${(fromY + toY) / 2} ${toX} ${(fromY + toY) / 2} ${toX},${toY}`;
  return (
    <g>
      <path fill="none" stroke="var(--accent)" strokeWidth={2} strokeDasharray="8 4" d={path} style={{ animation: "dash-flow 1s linear infinite" }} />
      <circle r={4} fill="var(--accent)" stroke="var(--surface)" strokeWidth={1.5}>
        <animateMotion dur="2s" repeatCount="indefinite" path={path} />
      </circle>
      <circle cx={toX} cy={toY} fill="var(--accent)" r={4} stroke="var(--surface)" strokeWidth={1.5} />
    </g>
  );
}

/* ─── Custom Edge Component ─── */
const CustomEdge = memo(function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  label,
  animated,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const strokeColor = (style as CSSProperties)?.stroke || "var(--accent)";

  return (
    <g>
      {/* Background passive path */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{ stroke: "var(--border)", strokeWidth: 2, ...(animated ? { strokeDasharray: "8 4" } : {}) }}
        markerEnd={markerEnd}
      />
      {/* Active animated flow path */}
      {animated && (
        <>
          <path
            fill="none"
            stroke={strokeColor}
            strokeWidth={2}
            strokeDasharray="8 4"
            d={edgePath}
            style={{ animation: "dash-flow 1s linear infinite", opacity: 0.8 }}
          />
          {/* Flowing particle */}
          <circle r={4} fill={strokeColor} stroke="var(--surface)" strokeWidth={1.5}>
            <animateMotion dur="2.5s" repeatCount="indefinite" path={edgePath} />
          </circle>
        </>
      )}
      {label && (
        <g>
          <rect x={labelX - 4} y={labelY - 10} width={0} height={0} />
          <text
            x={labelX}
            y={labelY}
            fill="var(--text-muted)"
            fontSize={11}
            fontWeight={500}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ pointerEvents: "none" }}
          >
            {label}
          </text>
        </g>
      )}
    </g>
  );
});

const edgeTypes = {
  custom: CustomEdge,
};

/* ─── Custom Node Components ─── */

const nodeColor = (type: string, data: Record<string, unknown>): string => {
  if (data.color) return data.color as string;
  switch (type) {
    case "client": return "var(--green)";
    case "gateway": return "var(--accent)";
    case "middleware": return "var(--accent-3)";
    case "storage": return "var(--accent-4)";
    default: return "var(--accent-2)";
  }
};

const BaseNode = memo(function BaseNode({ type, data }: { type: string; data: Record<string, unknown> }) {
  const color = nodeColor(type, data);
  const label = typeof data.label === "string" ? data.label : "";
  const sub = typeof data.sub === "string" ? data.sub : null;
  return (
    <div style={{
      padding: "12px 20px",
      borderRadius: 12,
      background: `color-mix(in srgb, ${color} 10%, var(--surface))`,
      border: `2px solid ${color}`,
      minWidth: 160,
      textAlign: "center",
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{sub}</div>}
    </div>
  );
});

const GatewayNode = memo(function GatewayNode({ data }: NodeProps) {
  return <BaseNode type="gateway" data={data} />;
});

const MiddlewareNode = memo(function MiddlewareNode({ data }: NodeProps) {
  return <BaseNode type="middleware" data={data} />;
});

const ProviderNode = memo(function ProviderNode({ data }: NodeProps) {
  return <BaseNode type="provider" data={data} />;
});

const StorageNode = memo(function StorageNode({ data }: NodeProps) {
  return <BaseNode type="storage" data={data} />;
});

const ClientNode = memo(function ClientNode({ data }: NodeProps) {
  return <BaseNode type="client" data={data} />;
});

/* ─── Group Node (boundary box) ─── */
const GroupNode = memo(function GroupNode({ data }: NodeProps) {
  const label = typeof data.label === "string" ? data.label : "";
  return (
    <div style={{
      width: "100%", height: "100%",
      border: "2px dashed var(--text-muted)",
      borderRadius: 16, background: "color-mix(in srgb, var(--text-muted) 3%, transparent)",
      position: "relative", pointerEvents: "none",
    }}>
      <div style={{
        position: "absolute", top: 8, left: 14,
        fontSize: 13, fontWeight: 700, color: "var(--text-muted)",
        letterSpacing: "0.02em", textTransform: "uppercase",
      }}>{label}</div>
    </div>
  );
});

/* ─── Hidden Junction Node (invisible convergence point) ─── */
const JunctionNode = memo(function _JunctionNode() {
  return <div style={{ width: 1, height: 1 }} />;
});

const nodeTypes = {
  gateway: GatewayNode,
  middleware: MiddlewareNode,
  provider: ProviderNode,
  storage: StorageNode,
  client: ClientNode,
  group: GroupNode,
  junction: JunctionNode,
};

/* ─── Adaptive edge factory ─── */
const arrowClsd = { type: MarkerType.ArrowClosed, width: 18, height: 18 } as const;

function colorOf(nodes: Node[], id: string): string {
  const n = nodes.find((x) => x.id === id);
  if (!n) return "var(--accent)";
  return nodeColor(n.type || "gateway", n.data as Record<string, unknown>);
}

function createEdge(
  id: string,
  source: string,
  target: string,
  nodes: Node[],
  opts?: { animated?: boolean; label?: string; dashed?: boolean },
): Edge {
  const c = colorOf(nodes, source);
  return {
    id,
    source,
    target,
    type: "custom",
    animated: opts?.animated !== false,
    style: {
      stroke: c,
      strokeWidth: 2,
      ...(opts?.dashed ? { strokeDasharray: "6 3" } : {}),
    },
    markerEnd: { ...arrowClsd, color: c },
    ...(opts?.label ? { label: opts.label } : {}),
  } as Edge;
}

/* ─── Unified nodes combining both systems ─── */

const initialNodes: Node[] = pos([
  /* ── Boundary groups ── */
  { id: "grp-internal", type: "group", position: { x: 10, y: 10 }, data: { label: "Internal Services" }, style: { width: 750, height: 430 } },
  { id: "grp-providers", type: "group", position: { x: 780, y: 10 }, data: { label: "External AI Providers" }, style: { width: 210, height: 370 } },
  { id: "grp-rag", type: "group", position: { x: 1130, y: 10 }, data: { label: "RAG Pipeline" }, style: { width: 960, height: 440 } },

  /* ── Request Lifecycle ── */
  { id: "cli", type: "client", position: { x: 50, y: 180 }, data: { label: "CLI Client", sub: "Claude Code / Cursor" } },
  { id: "proxy", type: "gateway", position: { x: 300, y: 180 }, data: { label: "OllamoMUI Proxy", sub: "localhost:11434" } },
  { id: "memory", type: "storage", position: { x: 300, y: 330 }, data: { label: "PostgreSQL", sub: "Memory & Sessions" } },
  { id: "acl", type: "middleware", position: { x: 560, y: 70 }, data: { label: "ACL Middleware", sub: "Auth & Rate Limiting" } },
  { id: "router", type: "gateway", position: { x: 560, y: 190 }, data: { label: "Provider Router", sub: "Smart Model Selection" } },
  { id: "stream", type: "gateway", position: { x: 560, y: 310 }, data: { label: "Stream Handler", sub: "SSE Response Buffer" } },
  { id: "openai", type: "provider", position: { x: 850, y: 40 }, data: { label: "OpenAI", sub: "gpt-4o, o1-pro", color: "var(--green)" } },
  { id: "anthropic", type: "provider", position: { x: 850, y: 110 }, data: { label: "Anthropic", sub: "claude-3.7-sonnet", color: "var(--accent-3)" } },
  { id: "groq", type: "provider", position: { x: 850, y: 180 }, data: { label: "Groq", sub: "llama-3.3-70b", color: "var(--accent-2)" } },
  { id: "deepseek", type: "provider", position: { x: 850, y: 250 }, data: { label: "DeepSeek", sub: "deepseek-v3", color: "var(--accent)" } },
  { id: "gemini", type: "provider", position: { x: 850, y: 320 }, data: { label: "Gemini", sub: "gemini-2.5-pro", color: "var(--accent-2)" } },

  /* ── Observability ── */
  { id: "monitor", type: "middleware", position: { x: 560, y: 400 }, data: { label: "Monitoring & Logging", sub: "Prometheus + Loki" } },

  /* ── Error handling ── */
  { id: "error", type: "middleware", position: { x: 560, y: 480 }, data: { label: "Error Handler", sub: "Retry / Fallback / Circuit Breaker" } },

  /* ── RAG Pipeline (Ingestion) ── */
  { id: "upload", type: "client", position: { x: 1170, y: 350 }, data: { label: "Document Upload", sub: "PDF / TXT / CSV" } },
  { id: "chunk", type: "gateway", position: { x: 1380, y: 350 }, data: { label: "Chunking", sub: "Split into Passages" } },
  { id: "embed", type: "gateway", position: { x: 1590, y: 350 }, data: { label: "Embedding", sub: "Vector Representation" } },
  { id: "pgvector", type: "storage", position: { x: 1830, y: 290 }, data: { label: "pgvector Index", sub: "Cosine Similarity" } },
  { id: "pgtrgm", type: "storage", position: { x: 1830, y: 400 }, data: { label: "pg_trgm Index", sub: "Fuzzy Keyword Match" } },

  /* ── RAG Pipeline (Query) ── */
  { id: "query", type: "client", position: { x: 1170, y: 110 }, data: { label: "User Query", sub: "Natural Language" } },
  { id: "semantic", type: "provider", position: { x: 1380, y: 50 }, data: { label: "Semantic Search", sub: "Vector Cosine Sim", color: "var(--accent-2)" } },
  { id: "keyword", type: "provider", position: { x: 1380, y: 170 }, data: { label: "Keyword Search", sub: "pg_trgm Fuzzy", color: "var(--accent-3)" } },
  { id: "merge", type: "gateway", position: { x: 1600, y: 110 }, data: { label: "Merge & Rerank", sub: "Cross-Encoder" } },
  { id: "llm", type: "gateway", position: { x: 1830, y: 110 }, data: { label: "LLM Provider", sub: "Context Injection" } },
]);

/* ─── Edges auto-derived from node colors, all animated ─── */

const initialEdges: Edge[] = [
  /* ── Request Lifecycle ── */
  createEdge("l1", "cli", "proxy", initialNodes, { label: "HTTP / REST" }),
  createEdge("l2", "proxy", "memory", initialNodes, { dashed: true, label: "SQL / Auto-save" }),
  createEdge("l3", "proxy", "acl", initialNodes, { label: "Token Extract" }),
  createEdge("l4", "acl", "router", initialNodes, { label: "Allow / Authorized" }),
  createEdge("l5", "router", "stream", initialNodes, { label: "Route Response" }),
  createEdge("l6", "router", "openai", initialNodes, { label: "OpenAI API" }),
  createEdge("l7", "router", "anthropic", initialNodes, { label: "Anthropic API" }),
  createEdge("l8", "router", "groq", initialNodes, { label: "Groq API" }),
  createEdge("l9", "router", "deepseek", initialNodes, { label: "DeepSeek API" }),
  createEdge("l10", "router", "gemini", initialNodes, { label: "Gemini API" }),
  createEdge("l11", "openai", "stream", initialNodes, { label: "SSE Stream" }),
  createEdge("l12", "anthropic", "stream", initialNodes, { label: "SSE Stream" }),
  createEdge("l13", "groq", "stream", initialNodes, { label: "SSE Stream" }),
  createEdge("l14", "deepseek", "stream", initialNodes, { label: "SSE Stream" }),
  createEdge("l15", "gemini", "stream", initialNodes, { label: "SSE Stream" }),
  createEdge("l16", "stream", "cli", initialNodes, { label: "SSE / NDJSON" }),

  /* ── Observability ── */
  createEdge("m1", "proxy", "monitor", initialNodes, { dashed: true, label: "Metrics / Logs" }),
  createEdge("m2", "router", "monitor", initialNodes, { dashed: true, label: "Metrics / Logs" }),
  createEdge("m3", "stream", "monitor", initialNodes, { dashed: true, label: "Metrics / Logs" }),

  /* ── Error handling ── */
  createEdge("e1", "router", "error", initialNodes, { dashed: true, label: "Provider Error" }),
  createEdge("e2", "stream", "error", initialNodes, { dashed: true, label: "Stream Error" }),
  createEdge("e3", "error", "router", initialNodes, { dashed: true, label: "Retry / Fallback" }),

  /* ── RAG Ingestion ── */
  createEdge("r1", "upload", "chunk", initialNodes, { label: "File Parse" }),
  createEdge("r2", "chunk", "embed", initialNodes, { label: "Text → Vector" }),
  createEdge("r3", "embed", "pgvector", initialNodes, { label: "Vector Index" }),
  createEdge("r4", "chunk", "pgtrgm", initialNodes, { label: "Keyword Index" }),

  /* ── RAG Query ── */
  createEdge("r5", "query", "semantic", initialNodes, { label: "Embed Query" }),
  createEdge("r6", "query", "keyword", initialNodes, { label: "Tokenize Query" }),
  createEdge("r7", "semantic", "pgvector", initialNodes, { dashed: true, label: "Cosine Search" }),
  createEdge("r8", "keyword", "pgtrgm", initialNodes, { dashed: true, label: "Fuzzy Match" }),
  createEdge("r9", "pgvector", "merge", initialNodes, { label: "Similarity Scores" }),
  createEdge("r10", "pgtrgm", "merge", initialNodes, { label: "Similarity Scores" }),
  createEdge("r11", "merge", "llm", initialNodes, { label: "Augmented Prompt" }),
];

/* ─── Exported unified diagram ─── */

const minimapStyle = {
  height: 80,
  width: 120,
  background: "var(--surface)",
  border: "1px solid var(--glass-border)",
  borderRadius: 8,
};

const flowContainerStyle: CSSProperties = {
  background: "var(--surface)",
  borderRadius: 16,
  border: "1px solid var(--glass-border)",
  overflow: "hidden",
};

const panelStyle: CSSProperties = {
  background: "color-mix(in srgb, var(--surface) 85%, transparent)",
  padding: "8px 14px",
  borderRadius: 8,
  margin: 8,
  backdropFilter: "blur(4px)",
};

const panelLabelStyle: CSSProperties = { fontSize: 13, fontWeight: 700, color: "var(--text)" };

export function ArchitectureFlow() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: "custom", animated: true }, eds)),
    [setEdges],
  );

  return (
    <div className="arch-flow" style={{ ...flowContainerStyle, height: 520 }}>
      <ReactFlow
        className="arch-flow"
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineComponent={ConnectionLine}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
      >
        <Background color="var(--text-muted)" gap={24} size={1} />
        <Controls style={{ background: "var(--surface)", borderRadius: 8, border: "1px solid var(--glass-border)" }} />
        <MiniMap style={minimapStyle} />
        <Panel position="top-left" style={panelStyle}>
          <span style={panelLabelStyle}>🔄 Request Lifecycle</span>
        </Panel>
        <Panel position="top-right" style={panelStyle}>
          <span style={panelLabelStyle}>📚 Hybrid RAG Pipeline</span>
        </Panel>
      </ReactFlow>
    </div>
  );
}

/* ─── Deployment Architecture ─── */

const deployNodes: Node[] = pos([
  { id: "grp-infra", type: "group", position: { x: 10, y: 10 }, data: { label: "Cloud Infrastructure" }, style: { width: 760, height: 420 } },
  { id: "grp-external", type: "group", position: { x: 790, y: 10 }, data: { label: "External Services" }, style: { width: 210, height: 420 } },
  { id: "user", type: "client", position: { x: 50, y: 160 }, data: { label: "User / Browser", sub: "Desktop, Mobile, CLI" } },
  { id: "cloudflare", type: "middleware", position: { x: 300, y: 160 }, data: { label: "Cloudflare Tunnel", sub: "DDoS mitigation & SSL" } },
  { id: "vercel", type: "gateway", position: { x: 550, y: 40 }, data: { label: "Vercel (Frontend)", sub: "Next.js static export" } },
  { id: "render", type: "gateway", position: { x: 550, y: 160 }, data: { label: "Render (Backend)", sub: "FastAPI + Uvicorn" } },
  { id: "neondb", type: "storage", position: { x: 550, y: 280 }, data: { label: "NeonDB (PostgreSQL)", sub: "pgvector + pg_trgm" } },
  { id: "github", type: "provider", position: { x: 850, y: 40 }, data: { label: "GitHub", sub: "Source code & releases", color: "var(--text-muted)" } },
  { id: "lemonsqueezy", type: "provider", position: { x: 850, y: 160 }, data: { label: "Lemon Squeezy", sub: "Payment processing", color: "var(--accent-4)" } },
  { id: "desktop", type: "client", position: { x: 850, y: 280 }, data: { label: "Desktop EXE", sub: "PySide6 + QML bundle" } },
  { id: "mobile", type: "client", position: { x: 850, y: 360 }, data: { label: "Mobile App", sub: "React Native + Expo" } },
]);

const deployEdges: Edge[] = [
  createEdge("d1", "user", "cloudflare", deployNodes, { label: "HTTPS / DNS" }),
  createEdge("d2", "cloudflare", "render", deployNodes, { label: "Reverse Proxy" }),
  createEdge("d3", "cloudflare", "vercel", deployNodes, { label: "Reverse Proxy" }),
  createEdge("d4", "render", "neondb", deployNodes, { label: "SQL / TLS" }),
  createEdge("d5", "vercel", "github", deployNodes, { dashed: true, label: "Webhook / Build" }),
  createEdge("d6", "render", "lemonsqueezy", deployNodes, { dashed: true, label: "Webhook / REST" }),
  createEdge("d7", "neondb", "desktop", deployNodes, { dashed: true, label: "API / Local Sync" }),
  createEdge("d8", "render", "mobile", deployNodes, { dashed: true, label: "REST API" }),
  createEdge("d9", "neondb", "mobile", deployNodes, { dashed: true, label: "REST API" }),
];

export function DeploymentFlow() {
  const [nodes, , onNodesChange] = useNodesState(deployNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(deployEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: "custom", animated: true }, eds)),
    [setEdges],
  );

  return (
    <div className="arch-flow" style={{ ...flowContainerStyle, height: 480 }}>
      <ReactFlow
        className="arch-flow"
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineComponent={ConnectionLine}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
      >
        <Background color="var(--text-muted)" gap={24} size={1} />
        <Controls style={{ background: "var(--surface)", borderRadius: 8, border: "1px solid var(--glass-border)" }} />
        <Panel position="top-left" style={panelStyle}>
          <span style={panelLabelStyle}>☁️ Deployment Architecture</span>
        </Panel>
      </ReactFlow>
    </div>
  );
}

/* ─── Auth & Security Flow ─── */

const authNodes: Node[] = pos([
  { id: "grp-authz", type: "group", position: { x: 10, y: 10 }, data: { label: "Authz Services" }, style: { width: 520, height: 340 } },
  { id: "grp-store", type: "group", position: { x: 550, y: 10 }, data: { label: "Data Stores" }, style: { width: 350, height: 340 } },
  { id: "client", type: "client", position: { x: 50, y: 120 }, data: { label: "Client Request", sub: "API key or session cookie" } },
  { id: "rate", type: "middleware", position: { x: 280, y: 40 }, data: { label: "Rate Limiter", sub: "Sliding window per IP/key" } },
  { id: "acl", type: "middleware", position: { x: 280, y: 200 }, data: { label: "ACL Middleware", sub: "Role & scope check" } },
  { id: "auth", type: "middleware", position: { x: 280, y: 120 }, data: { label: "Auth Resolver", sub: "Session / API key / none" } },
  { id: "sessions", type: "storage", position: { x: 780, y: 40 }, data: { label: "Sessions Table", sub: "Token → email lookup" } },
  { id: "apikeys", type: "storage", position: { x: 780, y: 120 }, data: { label: "API Keys Table", sub: "Key hash → role lookup" } },
  { id: "users", type: "storage", position: { x: 780, y: 200 }, data: { label: "Users Table", sub: "Email, role, subscription" } },
  { id: "audit", type: "storage", position: { x: 780, y: 280 }, data: { label: "Audit Log", sub: "All auth events recorded" } },
  { id: "allow", type: "gateway", position: { x: 1040, y: 120 }, data: { label: "Allow → Route", sub: "Request proceeds" } },
]);

/* ── Hidden junction for clean branching ── */
const authJunction: Node = { id: "aj", type: "junction", position: { x: 170, y: 120 }, data: {}, sourcePosition: RF.Position.Right, targetPosition: RF.Position.Left };

const authEdges: Edge[] = [
  createEdge("a1", "client", "aj", [...authNodes, authJunction]),
  createEdge("a2", "aj", "rate", [...authNodes, authJunction], { label: "Parse Token" }),
  createEdge("a3", "aj", "acl", [...authNodes, authJunction], { label: "Extract Role" }),
  createEdge("a4", "rate", "auth", [...authNodes, authJunction], { label: "Under Limit" }),
  createEdge("a5", "acl", "auth", [...authNodes, authJunction], { label: "Authorized" }),
  createEdge("a6", "auth", "sessions", [...authNodes, authJunction], { dashed: true, label: "Cookie / Token" }),
  createEdge("a7", "auth", "apikeys", [...authNodes, authJunction], { dashed: true, label: "API Key Hash" }),
  createEdge("a8", "auth", "users", [...authNodes, authJunction], { dashed: true, label: "Role / Subscription" }),
  createEdge("a9", "auth", "audit", [...authNodes, authJunction], { dashed: true, label: "Log Event" }),
  createEdge("a10", "auth", "allow", [...authNodes, authJunction], { label: "Authenticated" }),
];

export function AuthFlow() {
  const [nodes, , onNodesChange] = useNodesState([...authNodes, authJunction]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(authEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: "custom", animated: true }, eds)),
    [setEdges],
  );

  return (
    <div className="arch-flow" style={{ ...flowContainerStyle, height: 400 }}>
      <ReactFlow
        className="arch-flow"
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineComponent={ConnectionLine}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
      >
        <Background color="var(--text-muted)" gap={24} size={1} />
        <Controls style={{ background: "var(--surface)", borderRadius: 8, border: "1px solid var(--glass-border)" }} />
        <Panel position="top-left" style={panelStyle}>
          <span style={panelLabelStyle}>🔐 Auth &amp; Security Flow</span>
        </Panel>
      </ReactFlow>
    </div>
  );
}

/* ─── Waterfall SDLC ─── */

const sdlcNodes: Node[] = pos([
  { id: "req", type: "gateway", position: { x: 50, y: 60 }, data: { label: "1. Requirements", sub: "Gather specs & define scope" } },
  { id: "design", type: "gateway", position: { x: 50, y: 180 }, data: { label: "2. Design", sub: "System architecture & UI mockups" } },
  { id: "impl", type: "gateway", position: { x: 50, y: 300 }, data: { label: "3. Implementation", sub: "Code the backend, frontend, clients" } },
  { id: "test", type: "middleware", position: { x: 50, y: 420 }, data: { label: "4. Testing", sub: "Unit, integration, E2E, security" } },
  { id: "deploy", type: "gateway", position: { x: 50, y: 540 }, data: { label: "5. Deployment", sub: "Release to Vercel, Render, stores" } },
  { id: "maintain", type: "client", position: { x: 50, y: 660 }, data: { label: "6. Maintenance", sub: "Bug fixes, updates, monitoring" } },

  /* Right column — deliverables */
  { id: "req-out", type: "storage", position: { x: 340, y: 60 }, data: { label: "PRD & User Stories", sub: "Functional specification" } },
  { id: "design-out", type: "storage", position: { x: 340, y: 180 }, data: { label: "Figma Mockups & ERD", sub: "UI/UX + database schema" } },
  { id: "impl-out", type: "storage", position: { x: 340, y: 300 }, data: { label: "Source Code & Assets", sub: "FastAPI, Next.js, QML, RN" } },
  { id: "test-out", type: "storage", position: { x: 340, y: 420 }, data: { label: "Test Reports & QA", sub: "Coverage, benchmarks" } },
  { id: "deploy-out", type: "storage", position: { x: 340, y: 540 }, data: { label: "Live Site & Binaries", sub: "vercel.app + EXE + APK" } },
  { id: "maintain-out", type: "storage", position: { x: 340, y: 660 }, data: { label: "CHANGELOG & Issues", sub: "GitHub releases & roadmap" } },

  /* Feedback arcs */
  { id: "feedback", type: "middleware", position: { x: 550, y: 360 }, data: { label: "Feedback Loops", sub: "Issues → earlier phases" } },
]);

const sdlcEdges: Edge[] = [
  /* Sequential waterfall */
  createEdge("s1", "req", "design", sdlcNodes, { label: "Spec Handoff" }),
  createEdge("s2", "design", "impl", sdlcNodes, { label: "Design Sign-off" }),
  createEdge("s3", "impl", "test", sdlcNodes, { label: "Code Complete" }),
  createEdge("s4", "test", "deploy", sdlcNodes, { label: "QA Passed" }),
  createEdge("s5", "deploy", "maintain", sdlcNodes, { label: "Release Live" }),

  /* To deliverables */
  createEdge("s6", "req", "req-out", sdlcNodes, { label: "Document" }),
  createEdge("s7", "design", "design-out", sdlcNodes, { label: "Document" }),
  createEdge("s8", "impl", "impl-out", sdlcNodes, { label: "Produce" }),
  createEdge("s9", "test", "test-out", sdlcNodes, { label: "Produce" }),
  createEdge("s10", "deploy", "deploy-out", sdlcNodes, { label: "Produce" }),
  createEdge("s11", "maintain", "maintain-out", sdlcNodes, { label: "Produce" }),

  /* Feedback arcs back */
  createEdge("s12", "maintain", "req", sdlcNodes, { dashed: true, label: "New Requirements" }),
  createEdge("s13", "test", "design", sdlcNodes, { dashed: true, label: "Design Fixes" }),
  createEdge("s14", "deploy", "impl", sdlcNodes, { dashed: true, label: "Hotfix" }),
];

export function WaterfallSdlcFlow() {
  const [nodes, , onNodesChange] = useNodesState(sdlcNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(sdlcEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: "custom", animated: true }, eds)),
    [setEdges],
  );

  return (
    <div className="arch-flow" style={{ ...flowContainerStyle, height: 780 }}>
      <ReactFlow
        className="arch-flow"
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineComponent={ConnectionLine}
        fitView
        fitViewOptions={{ padding: 0.12 }}
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
      >
        <Background color="var(--text-muted)" gap={24} size={1} />
        <Controls style={{ background: "var(--surface)", borderRadius: 8, border: "1px solid var(--glass-border)" }} />
        <Panel position="top-left" style={panelStyle}>
          <span style={panelLabelStyle}>🌊 Waterfall SDLC</span>
        </Panel>
      </ReactFlow>
    </div>
  );
}
