"use client";

import React, { memo } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  NodeProps,
  ConnectionLineComponent,
  EdgeProps,
  BaseEdge,
  getBezierPath,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";

/* ─── Custom Connection Line (while dragging) ─── */
const ConnectionLine: ConnectionLineComponent = ({ fromX, fromY, toX, toY }) => {
  const path = `M${fromX},${fromY} C ${fromX} ${(fromY + toY) / 2} ${toX} ${(fromY + toY) / 2} ${toX},${toY}`;
  return (
    <g>
      <path fill="none" stroke="var(--accent)" strokeWidth={2} className="animated" d={path} />
      <circle cx={toX} cy={toY} fill="var(--accent)" r={4} stroke="#fff" strokeWidth={1.5} />
    </g>
  );
};

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

  return (
    <g>
      <BaseEdge id={id} path={edgePath} style={style} markerEnd={markerEnd} />
      {animated && (
        <path
          fill="none"
          stroke={(style as React.CSSProperties)?.stroke || "var(--accent)"}
          strokeWidth={2}
          strokeDasharray="4 4"
          className="animated"
          d={edgePath}
          style={{ animation: "react-flow-edge-dash 1s linear infinite" }}
        />
      )}
      {label && (
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
      )}
    </g>
  );
});

const edgeTypes = {
  custom: CustomEdge,
};

/* ─── Theme color palette ─── */
const C = {
  green: "var(--green)",
  blue: "var(--accent)",
  purple: "var(--accent-2)",
  pink: "var(--accent-3)",
  orange: "#f59e0b",
  teal: "#0d9488",
  brown: "var(--accent-4)",
  gray: "var(--text-muted)",
};

/* ─── Custom Node Components ─── */

const GatewayNode = memo(function GatewayNode({ data }: NodeProps) {
  return (
    <div style={{
      padding: "12px 20px",
      borderRadius: 12,
      background: "color-mix(in srgb, var(--accent) 10%, var(--surface))",
      border: "2px solid var(--accent)",
      minWidth: 160,
      textAlign: "center",
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>{data.label}</div>
      {data.sub && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{data.sub}</div>}
    </div>
  );
});

const MiddlewareNode = memo(function MiddlewareNode({ data }: NodeProps) {
  return (
    <div style={{
      padding: "12px 20px",
      borderRadius: 12,
      background: "color-mix(in srgb, var(--accent-3) 10%, var(--surface))",
      border: "2px solid var(--accent-3)",
      minWidth: 160,
      textAlign: "center",
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--accent-3)" }}>{data.label}</div>
      {data.sub && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{data.sub}</div>}
    </div>
  );
});

const ProviderNode = memo(function ProviderNode({ data }: NodeProps) {
  const color = data.color || "var(--accent-2)";
  return (
    <div style={{
      padding: "12px 20px",
      borderRadius: 12,
      background: `color-mix(in srgb, ${color} 10%, var(--surface))`,
      border: `2px solid ${color}`,
      minWidth: 160,
      textAlign: "center",
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color }}>{data.label}</div>
      {data.sub && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{data.sub}</div>}
    </div>
  );
});

const StorageNode = memo(function StorageNode({ data }: NodeProps) {
  return (
    <div style={{
      padding: "12px 20px",
      borderRadius: 12,
      background: "color-mix(in srgb, var(--accent-4) 10%, var(--surface))",
      border: "2px solid var(--accent-4)",
      minWidth: 160,
      textAlign: "center",
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--accent-4)" }}>{data.label}</div>
      {data.sub && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{data.sub}</div>}
    </div>
  );
});

const ClientNode = memo(function ClientNode({ data }: NodeProps) {
  return (
    <div style={{
      padding: "12px 20px",
      borderRadius: 12,
      background: "color-mix(in srgb, var(--green) 10%, var(--surface))",
      border: "2px solid var(--green)",
      minWidth: 160,
      textAlign: "center",
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--green)" }}>{data.label}</div>
      {data.sub && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{data.sub}</div>}
    </div>
  );
});

const nodeTypes = {
  gateway: GatewayNode,
  middleware: MiddlewareNode,
  provider: ProviderNode,
  storage: StorageNode,
  client: ClientNode,
};

/* ─── Unified nodes combining both systems ─── */

const initialNodes: Node[] = [
  // ── Request Lifecycle ──
  { id: "cli", type: "client", position: { x: 50, y: 180 }, data: { label: "CLI Client", sub: "Claude Code / Cursor" } },
  { id: "proxy", type: "gateway", position: { x: 300, y: 180 }, data: { label: "OllamoMUI Proxy", sub: "localhost:11434" } },
  { id: "memory", type: "storage", position: { x: 300, y: 320 }, data: { label: "PostgreSQL", sub: "Memory & Sessions" } },
  { id: "acl", type: "middleware", position: { x: 580, y: 80 }, data: { label: "ACL Middleware", sub: "Auth & Rate Limiting" } },
  { id: "router", type: "gateway", position: { x: 580, y: 190 }, data: { label: "Provider Router", sub: "Smart Model Selection" } },
  { id: "stream", type: "gateway", position: { x: 580, y: 300 }, data: { label: "Stream Handler", sub: "SSE Response Buffer" } },
  { id: "openai", type: "provider", position: { x: 850, y: 40 }, data: { label: "OpenAI", sub: "gpt-4o, o1-pro", color: "#10a37f" } },
  { id: "anthropic", type: "provider", position: { x: 850, y: 110 }, data: { label: "Anthropic", sub: "claude-3.7-sonnet", color: "var(--accent-3)" } },
  { id: "groq", type: "provider", position: { x: 850, y: 180 }, data: { label: "Groq", sub: "llama-3.3-70b", color: "#f59e0b" } },
  { id: "deepseek", type: "provider", position: { x: 850, y: 250 }, data: { label: "DeepSeek", sub: "deepseek-v3", color: "var(--accent)" } },
  { id: "gemini", type: "provider", position: { x: 850, y: 320 }, data: { label: "Gemini", sub: "gemini-2.5-pro", color: "var(--accent-2)" } },

  // ── RAG Pipeline (Ingestion) ──
  { id: "upload", type: "client", position: { x: 1200, y: 320 }, data: { label: "Document Upload", sub: "PDF / TXT / CSV" } },
  { id: "chunk", type: "gateway", position: { x: 1450, y: 320 }, data: { label: "Chunking", sub: "Split into Passages" } },
  { id: "embed", type: "gateway", position: { x: 1700, y: 320 }, data: { label: "Embedding", sub: "Vector Representation" } },
  { id: "pgvector", type: "storage", position: { x: 1980, y: 260 }, data: { label: "pgvector Index", sub: "Cosine Similarity" } },
  { id: "pgtrgm", type: "storage", position: { x: 1980, y: 370 }, data: { label: "pg_trgm Index", sub: "Fuzzy Keyword Match" } },

  // ── RAG Pipeline (Query) ──
  { id: "query", type: "client", position: { x: 1200, y: 90 }, data: { label: "User Query", sub: "Natural Language" } },
  { id: "semantic", type: "provider", position: { x: 1450, y: 40 }, data: { label: "Semantic Search", sub: "Vector Cosine Sim", color: "var(--accent-2)" } },
  { id: "keyword", type: "provider", position: { x: 1450, y: 140 }, data: { label: "Keyword Search", sub: "pg_trgm Fuzzy", color: "var(--accent-3)" } },
  { id: "merge", type: "gateway", position: { x: 1720, y: 90 }, data: { label: "Merge & Rerank", sub: "Cross-Encoder" } },
  { id: "llm", type: "gateway", position: { x: 1980, y: 90 }, data: { label: "LLM Provider", sub: "Context Injection" } },
];

/* ─── Unified edges ─── */

const arrowClsd = { type: MarkerType.ArrowClosed, width: 18, height: 18 } as const;

const initialEdges: Edge[] = [
  // ── Request Lifecycle ──
  { id: "l1", type: "custom", source: "cli", target: "proxy", animated: true, style: { stroke: C.green }, markerEnd: arrowClsd },
  { id: "l2", type: "custom", source: "proxy", target: "memory", style: { stroke: C.brown, strokeDasharray: "5 5" }, markerEnd: arrowClsd, label: "Auto-save" },
  { id: "l3", type: "custom", source: "proxy", target: "acl", style: { stroke: C.pink }, markerEnd: arrowClsd },
  { id: "l4", type: "custom", source: "acl", target: "router", style: { stroke: C.teal }, markerEnd: arrowClsd, label: "Allow" },
  { id: "l5", type: "custom", source: "router", target: "stream", style: { stroke: C.green }, markerEnd: arrowClsd },
  { id: "l6", type: "custom", source: "router", target: "openai", style: { stroke: "#10a37f" }, markerEnd: arrowClsd },
  { id: "l7", type: "custom", source: "router", target: "anthropic", style: { stroke: "var(--accent-3)" }, markerEnd: arrowClsd },
  { id: "l8", type: "custom", source: "router", target: "groq", style: { stroke: "#f59e0b" }, markerEnd: arrowClsd },
  { id: "l9", type: "custom", source: "router", target: "deepseek", style: { stroke: "var(--accent)" }, markerEnd: arrowClsd },
  { id: "l10", type: "custom", source: "router", target: "gemini", style: { stroke: "var(--accent-2)" }, markerEnd: arrowClsd },
  { id: "l11", type: "custom", source: "openai", target: "stream", style: { stroke: "#10a37f" }, markerEnd: arrowClsd },
  { id: "l12", type: "custom", source: "anthropic", target: "stream", style: { stroke: "var(--accent-3)" }, markerEnd: arrowClsd },
  { id: "l13", type: "custom", source: "groq", target: "stream", style: { stroke: "#f59e0b" }, markerEnd: arrowClsd },
  { id: "l14", type: "custom", source: "deepseek", target: "stream", style: { stroke: "var(--accent)" }, markerEnd: arrowClsd },
  { id: "l15", type: "custom", source: "gemini", target: "stream", style: { stroke: "var(--accent-2)" }, markerEnd: arrowClsd },
  { id: "l16", type: "custom", source: "stream", target: "cli", animated: true, style: { stroke: C.green }, markerEnd: arrowClsd, label: "SSE Stream" },

  // ── RAG Ingestion ──
  { id: "r1", type: "custom", source: "upload", target: "chunk", style: { stroke: C.green }, markerEnd: arrowClsd },
  { id: "r2", type: "custom", source: "chunk", target: "embed", style: { stroke: C.teal }, markerEnd: arrowClsd },
  { id: "r3", type: "custom", source: "embed", target: "pgvector", style: { stroke: C.brown }, markerEnd: arrowClsd, label: "Vector index" },
  { id: "r4", type: "custom", source: "chunk", target: "pgtrgm", style: { stroke: "var(--accent-3)" }, markerEnd: arrowClsd, label: "Keyword index" },

  // ── RAG Query ──
  { id: "r5", type: "custom", source: "query", target: "semantic", style: { stroke: "var(--accent-2)" }, markerEnd: arrowClsd },
  { id: "r6", type: "custom", source: "query", target: "keyword", style: { stroke: "var(--accent-3)" }, markerEnd: arrowClsd },
  { id: "r7", type: "custom", source: "semantic", target: "pgvector", style: { stroke: "var(--accent-2)", strokeDasharray: "5 5" }, markerEnd: arrowClsd },
  { id: "r8", type: "custom", source: "keyword", target: "pgtrgm", style: { stroke: "var(--accent-3)", strokeDasharray: "5 5" }, markerEnd: arrowClsd },
  { id: "r9", type: "custom", source: "pgvector", target: "merge", style: { stroke: "var(--accent-2)" }, markerEnd: arrowClsd, label: "Results" },
  { id: "r10", type: "custom", source: "pgtrgm", target: "merge", style: { stroke: "var(--accent-3)" }, markerEnd: arrowClsd, label: "Results" },
  { id: "r11", type: "custom", source: "merge", target: "llm", animated: true, style: { stroke: C.teal }, markerEnd: arrowClsd },
];

/* ─── Exported unified diagram ─── */

const minimapStyle = {
  height: 80,
  width: 120,
  background: "var(--surface)",
  border: "1px solid var(--glass-border)",
  borderRadius: 8,
};

export function ArchitectureFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div style={{
      background: "var(--surface)", borderRadius: 16, border: "1px solid var(--glass-border)",
      overflow: "hidden", height: 520,
    }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
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
        <Panel position="top-left" style={{
          background: "color-mix(in srgb, var(--surface) 85%, transparent)",
          padding: "8px 14px", borderRadius: 8, margin: 8,
          backdropFilter: "blur(4px)",
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
            🔄 Request Lifecycle
          </span>
        </Panel>
        <Panel position="top-right" style={{
          background: "color-mix(in srgb, var(--surface) 85%, transparent)",
          padding: "8px 14px", borderRadius: 8, margin: 8,
          backdropFilter: "blur(4px)",
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
            📚 Hybrid RAG Pipeline
          </span>
        </Panel>
      </ReactFlow>
    </div>
  );
}
