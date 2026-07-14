"use client";

import React, { useMemo, useCallback } from "react";
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
} from "reactflow";
import "reactflow/dist/style.css";

/* ─── Custom Node Components ─── */

function GatewayNode({ data }: NodeProps) {
  return (
    <div style={{
      padding: "12px 20px",
      borderRadius: 12,
      background: "color-mix(in srgb, var(--accent) 10%, var(--surface))",
      border: "2px solid var(--accent)",
      minWidth: 140,
      textAlign: "center",
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>{data.label}</div>
      {data.sub && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{data.sub}</div>}
    </div>
  );
}

function MiddlewareNode({ data }: NodeProps) {
  return (
    <div style={{
      padding: "12px 20px",
      borderRadius: 12,
      background: "color-mix(in srgb, var(--accent-3) 10%, var(--surface))",
      border: "2px solid var(--accent-3)",
      minWidth: 140,
      textAlign: "center",
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--accent-3)" }}>{data.label}</div>
      {data.sub && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{data.sub}</div>}
    </div>
  );
}

function ProviderNode({ data }: NodeProps) {
  const color = data.color || "var(--accent-2)";
  return (
    <div style={{
      padding: "12px 20px",
      borderRadius: 12,
      background: `color-mix(in srgb, ${color} 10%, var(--surface))`,
      border: `2px solid ${color}`,
      minWidth: 140,
      textAlign: "center",
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color }}>{data.label}</div>
      {data.sub && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{data.sub}</div>}
    </div>
  );
}

function StorageNode({ data }: NodeProps) {
  return (
    <div style={{
      padding: "12px 20px",
      borderRadius: 12,
      background: "color-mix(in srgb, var(--accent-4) 10%, var(--surface))",
      border: "2px solid var(--accent-4)",
      minWidth: 140,
      textAlign: "center",
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--accent-4)" }}>{data.label}</div>
      {data.sub && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{data.sub}</div>}
    </div>
  );
}

function ClientNode({ data }: NodeProps) {
  return (
    <div style={{
      padding: "12px 20px",
      borderRadius: 12,
      background: "color-mix(in srgb, var(--green) 10%, var(--surface))",
      border: "2px solid var(--green)",
      minWidth: 140,
      textAlign: "center",
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--green)" }}>{data.label}</div>
      {data.sub && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{data.sub}</div>}
    </div>
  );
}

const nodeTypes = {
  gateway: GatewayNode,
  middleware: MiddlewareNode,
  provider: ProviderNode,
  storage: StorageNode,
  client: ClientNode,
};

/* ─── Request Lifecycle Flow ─── */

const requestLifecycleNodes: Node[] = [
  { id: "client", type: "client", position: { x: 0, y: 120 }, data: { label: "CLI Client", sub: "Claude Code / Cursor / OpenCode" } },
  { id: "proxy", type: "gateway", position: { x: 250, y: 120 }, data: { label: "OllamoMUI Proxy", sub: "localhost:11434" } },
  { id: "acl", type: "middleware", position: { x: 500, y: 60 }, data: { label: "ACL Middleware", sub: "Auth & rate limiting" } },
  { id: "router", type: "gateway", position: { x: 500, y: 180 }, data: { label: "Provider Router", sub: "Smart model selection" } },
  { id: "openai", type: "provider", position: { x: 750, y: 20 }, data: { label: "OpenAI", sub: "gpt-4o, o1-pro", color: "#10a37f" } },
  { id: "anthropic", type: "provider", position: { x: 750, y: 100 }, data: { label: "Anthropic", sub: "claude-3.7-sonnet", color: "#fd79a8" } },
  { id: "groq", type: "provider", position: { x: 750, y: 180 }, data: { label: "Groq", sub: "llama-3.3-70b", color: "#fdcb6e" } },
  { id: "deepseek", type: "provider", position: { x: 750, y: 260 }, data: { label: "DeepSeek", sub: "deepseek-v3", color: "#4D6BFE" } },
  { id: "gemini", type: "provider", position: { x: 750, y: 340 }, data: { label: "Gemini", sub: "gemini-2.5-pro", color: "#3186FF" } },
  { id: "stream", type: "gateway", position: { x: 500, y: 300 }, data: { label: "Stream Handler", sub: "SSE response buffer" } },
  { id: "memory", type: "storage", position: { x: 250, y: 300 }, data: { label: "PostgreSQL", sub: "Memory & sessions" } },
];

const requestLifecycleEdges: Edge[] = [
  { id: "e1", source: "client", target: "proxy", animated: true, style: { stroke: "var(--green)" }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e2", source: "proxy", target: "acl", style: { stroke: "var(--accent-3)" }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e3", source: "proxy", target: "router", style: { stroke: "var(--accent)" }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e4", source: "router", target: "openai", style: { stroke: "#10a37f" }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e5", source: "router", target: "anthropic", style: { stroke: "#fd79a8" }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e6", source: "router", target: "groq", style: { stroke: "#fdcb6e" }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e7", source: "router", target: "deepseek", style: { stroke: "#4D6BFE" }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e8", source: "router", target: "gemini", style: { stroke: "#3186FF" }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e9", source: "openai", target: "stream", style: { stroke: "#10a37f" }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e10", source: "anthropic", target: "stream", style: { stroke: "#fd79a8" }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e11", source: "groq", target: "stream", style: { stroke: "#fdcb6e" }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e12", source: "deepseek", target: "stream", style: { stroke: "#4D6BFE" }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e13", source: "gemini", target: "stream", style: { stroke: "#3186FF" }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e14", source: "stream", target: "client", animated: true, style: { stroke: "var(--green)" }, markerEnd: { type: MarkerType.ArrowClosed }, label: "SSE Stream" },
  { id: "e15", source: "proxy", target: "memory", style: { stroke: "var(--accent-4)", strokeDasharray: "5 5" }, markerEnd: { type: MarkerType.ArrowClosed }, label: "Auto-save" },
];

/* ─── RAG Pipeline Flow ─── */

const ragPipelineNodes: Node[] = [
  { id: "upload", type: "client", position: { x: 0, y: 200 }, data: { label: "Document Upload", sub: "PDF / TXT / CSV" } },
  { id: "chunk", type: "gateway", position: { x: 220, y: 200 }, data: { label: "Chunking", sub: "Split into passages" } },
  { id: "embed", type: "gateway", position: { x: 440, y: 200 }, data: { label: "Embedding", sub: "Vector representation" } },
  { id: "pgvector", type: "storage", position: { x: 660, y: 140 }, data: { label: "pgvector Index", sub: "Cosine similarity" } },
  { id: "pgtrgm", type: "storage", position: { x: 660, y: 260 }, data: { label: "pg_trgm Index", sub: "Fuzzy keyword match" } },
  { id: "query", type: "client", position: { x: 0, y: 40 }, data: { label: "User Query", sub: "Natural language" } },
  { id: "semantic", type: "provider", position: { x: 220, y: 40 }, data: { label: "Semantic Search", sub: "Vector cosine sim", color: "var(--accent-2)" } },
  { id: "keyword", type: "provider", position: { x: 220, y: 120 }, data: { label: "Keyword Search", sub: "pg_trgm fuzzy", color: "var(--accent-3)" } },
  { id: "merge", type: "gateway", position: { x: 440, y: 80 }, data: { label: "Merge & Rerank", sub: "Cross-encoder" } },
  { id: "context", type: "provider", position: { x: 660, y: 40 }, data: { label: "LLM Context", sub: "Injection", color: "var(--accent)" } },
  { id: "llm", type: "gateway", position: { x: 660, y: 0 }, data: { label: "LLM Provider", sub: "Generate response" } },
];

const ragPipelineEdges: Edge[] = [
  { id: "r1", source: "upload", target: "chunk", style: { stroke: "var(--green)" }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "r2", source: "chunk", target: "embed", style: { stroke: "var(--accent)" }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "r3", source: "embed", target: "pgvector", style: { stroke: "var(--accent-2)" }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "r4", source: "embed", target: "pgtrgm", style: { stroke: "var(--accent-3)" }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "r5", source: "query", target: "semantic", style: { stroke: "var(--accent-2)" }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "r6", source: "query", target: "keyword", style: { stroke: "var(--accent-3)" }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "r7", source: "semantic", target: "pgvector", style: { stroke: "var(--accent-2)", strokeDasharray: "5 5" }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "r8", source: "keyword", target: "pgtrgm", style: { stroke: "var(--accent-3)", strokeDasharray: "5 5" }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "r9", source: "semantic", target: "merge", style: { stroke: "var(--accent-2)" }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "r10", source: "keyword", target: "merge", style: { stroke: "var(--accent-3)" }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "r11", source: "merge", target: "context", style: { stroke: "var(--accent)" }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "r12", source: "context", target: "llm", animated: true, style: { stroke: "var(--accent)" }, markerEnd: { type: MarkerType.ArrowClosed } },
];

/* ─── Exported Components ─── */

const defaultViewport = { x: 0, y: 0, zoom: 0.85 };

const minimapStyle = {
  height: 80,
  width: 120,
  background: "var(--surface)",
  border: "1px solid var(--glass-border)",
  borderRadius: 8,
};

export function RequestLifecycleFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(requestLifecycleNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(requestLifecycleEdges);

  return (
    <div style={{
      background: "var(--surface)", borderRadius: 16, border: "1px solid var(--glass-border)",
      overflow: "hidden", height: 450,
    }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        defaultViewport={defaultViewport}
        fitView
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
      >
        <Background color="var(--text-muted)" gap={24} size={1} />
        <Controls style={{ background: "var(--surface)", borderRadius: 8, border: "1px solid var(--glass-border)" }} />
        <MiniMap style={minimapStyle} />
      </ReactFlow>
    </div>
  );
}

export function RagPipelineFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(ragPipelineNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(ragPipelineEdges);

  return (
    <div style={{
      background: "var(--surface)", borderRadius: 16, border: "1px solid var(--glass-border)",
      overflow: "hidden", height: 380,
    }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        defaultViewport={defaultViewport}
        fitView
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
      >
        <Background color="var(--text-muted)" gap={24} size={1} />
        <Controls style={{ background: "var(--surface)", borderRadius: 8, border: "1px solid var(--glass-border)" }} />
        <MiniMap style={minimapStyle} />
      </ReactFlow>
    </div>
  );
}
