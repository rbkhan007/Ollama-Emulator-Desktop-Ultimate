"use client";

import React, { useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  useNodesState, useEdgesState, addEdge,
  Position, BaseEdge,
  type Node, type Edge, type NodeProps, type Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const ReactFlow = dynamic(() => import("@xyflow/react").then(m => m.ReactFlow), { ssr: false });
const Background = dynamic(() => import("@xyflow/react").then(m => m.Background), { ssr: false });
const Controls = dynamic(() => import("@xyflow/react").then(m => m.Controls), { ssr: false });

const FEATURES_DATA = [
  { id: "f1", label: "Chat Playground", benefit: "Stream any model in the browser — markdown, real-time, no setup.", color: "var(--accent)" },
  { id: "f2", label: "Models Browser", benefit: "Browse & search every model across all connected providers.", color: "var(--accent-2)" },
  { id: "f3", label: "RAG Knowledge Base", benefit: "Upload docs, get answers grounded in your own data via pgvector.", color: "var(--accent-3)" },
  { id: "f4", label: "Persistent Memory", benefit: "Conversations, facts & context survive restarts in PostgreSQL.", color: "var(--accent-4)" },
  { id: "f5", label: "Multi-Provider", benefit: "OpenRouter, OpenAI, Anthropic, Groq, DeepSeek, Gemini — one box.", color: "var(--green)" },
  { id: "f6", label: "Zero Config", benefit: "One file. Run it, paste a free key, point your tools at it.", color: "var(--accent)" },
  { id: "f7", label: "Full Compatibility", benefit: "Ollama, OpenAI & Anthropic formats — works with every AI tool.", color: "var(--accent-2)" },
];

const CANVAS_W = 1500;
const CANVAS_H = 762;
const FEATURE_X = 24;
const BENEFIT_X = 1016;
const PAD_Y = 28;
const GAP = 12;

function FeatureNode({ data }: NodeProps) {
  const d = data as { label: string; color: string };
  return (
    <div style={{
      width: "100%", height: "100%", display: "flex", flexDirection: "column",
      borderRadius: 16, border: `1px solid ${d.color}55`,
      background: "color-mix(in srgb, var(--surface) 85%, transparent)",
      boxShadow: `0 7px 9px 0 rgba(0,0,0,0.02), 0 4px 18px ${d.color}22`, overflow: "hidden",
    }}>
      <div style={{
        borderBottom: `1px solid var(--border)`, padding: "8px 12px",
        fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600,
        color: d.color, display: "flex", alignItems: "center", gap: 8,
        background: `color-mix(in srgb, ${d.color} 10%, transparent)`,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, boxShadow: `0 0 8px ${d.color}` }} />
        FEATURE
      </div>
      <div style={{
        padding: "12px 14px", fontSize: 14, fontWeight: 600, color: "var(--text)",
        fontFamily: "var(--font-mono)", flex: 1, display: "flex", alignItems: "center",
      }}>
        {d.label}
      </div>
    </div>
  );
}

function BenefitNode({ data }: NodeProps) {
  const d = data as { label: string; color: string };
  return (
    <div style={{
      width: "100%", height: "100%", display: "flex", flexDirection: "column",
      borderRadius: 16, border: "1px solid var(--border)",
      background: "color-mix(in srgb, var(--surface) 80%, transparent)",
      boxShadow: "0 7px 9px 0 rgba(0,0,0,0.02)", overflow: "hidden",
    }}>
      <div style={{
        borderBottom: "1px solid var(--border)", padding: "8px 12px",
        fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600,
        color: d.color, background: `color-mix(in srgb, ${d.color} 8%, transparent)`,
      }}>
        OUTCOME
      </div>
      <div style={{
        padding: "12px 14px", fontSize: "var(--text-sm)", lineHeight: 1.5, color: "var(--text-muted)",
        flex: 1, display: "flex", alignItems: "center",
      }}>
        {d.label}
      </div>
    </div>
  );
}

function BlueprintEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }: {
  id: string; sourceX: number; sourceY: number; targetX: number; targetY: number;
  sourcePosition: Position; targetPosition: Position; data?: { color?: string };
}) {
  const dx = Math.abs(targetX - sourceX);
  const curve = Math.max(60, dx * 0.5);
  const edgePath = `M${sourceX},${sourceY} C${sourceX + curve},${sourceY} ${targetX - curve},${targetY} ${targetX},${targetY}`;
  const color = (data?.color as string) || "var(--accent)";
  return (
    <>
      {/* wide invisible hit / stretch path */}
      <path
        d={edgePath} fill="none" strokeOpacity={0} strokeWidth={20}
        className="react-flow__edge-interaction"
      />
      {/* soft glow underlay that carves the path */}
      <path
        d={edgePath} fill="none" stroke={color} strokeWidth={7} strokeOpacity={0.18}
        strokeLinecap="round" className="fb-edge-path"
      />
      {/* colored visible animated dashed path */}
      <BaseEdge
        id={id}
        path={edgePath}
        className="fb-edge-path"
        style={{ stroke: color, strokeWidth: 2.5, strokeDasharray: "6 6", animation: "fb-dash 1s linear infinite" }}
      />
      <circle cx={sourceX} cy={sourceY} r={5} fill={color} style={{ filter: `drop-shadow(0 0 5px ${color})` }} />
      <circle cx={targetX} cy={targetY} r={5} fill={color} style={{ filter: `drop-shadow(0 0 5px ${color})` }} />
    </>
  );
}

const nodeTypes = { feature: FeatureNode, benefit: BenefitNode };
const edgeTypes = { blueprint: BlueprintEdge };

function BlueprintConnectionLine({ fromX, fromY, toX, toY }: { fromX: number; fromY: number; toX: number; toY: number }) {
  const dx = Math.abs(toX - fromX);
  const curve = Math.max(60, dx * 0.5);
  const path = `M${fromX},${fromY} C${fromX + curve},${fromY} ${toX - curve},${toY} ${toX},${toY}`;
  return (
    <g>
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth={2.5} strokeDasharray="6 6" style={{ animation: "fb-dash 1s linear infinite" }} />
      <circle cx={toX} cy={toY} r={5} fill="var(--accent)" style={{ filter: "drop-shadow(0 0 5px var(--accent))" }} />
    </g>
  );
}

export default function FeatureBenefitSection() {
  const rowH = (CANVAS_H - PAD_Y * 2 - GAP * (FEATURES_DATA.length - 1)) / FEATURES_DATA.length;

  const initialNodes: Node[] = useMemo(() => {
    const out: Node[] = [];
    FEATURES_DATA.forEach((f, i) => {
      const y = PAD_Y + i * (rowH + GAP);
      out.push({
        id: f.id, type: "feature", position: { x: FEATURE_X, y },
        data: { label: f.label, color: f.color },
        sourcePosition: Position.Right, targetPosition: Position.Left,
        draggable: true, width: 220, height: rowH,
      });
      out.push({
        id: `b-${f.id}`, type: "benefit", position: { x: BENEFIT_X, y },
        data: { label: f.benefit, color: f.color },
        sourcePosition: Position.Right, targetPosition: Position.Left,
        draggable: true, width: 360, height: rowH,
      });
    });
    return out;
  }, [rowH]);

  const initialEdges: Edge[] = useMemo(() => FEATURES_DATA.map((f) => ({
    id: `e-${f.id}`, source: f.id, target: `b-${f.id}`,
    type: "blueprint", animated: true, data: { color: f.color },
  })), []);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: "blueprint" }, eds)),
    [setEdges],
  );

  return (
    <section className="lazy-section" style={{ padding: "var(--space-3xl) 24px", maxWidth: CANVAS_W, margin: "0 auto" }}>
      <h2 style={{
        textAlign: "center", fontSize: "var(--text-h2)", fontWeight: 700,
        letterSpacing: "-0.02em", marginBottom: 8,
      }}>
        Features <span style={{ color: "var(--text-muted)" }}>→</span> Benefits
      </h2>
      <p style={{
        textAlign: "center", color: "var(--text-muted)", marginBottom: 24,
        fontSize: "var(--text-body)",
      }}>
        Every feature maps to a real outcome. Drag the nodes around — the blueprint paths follow.
      </p>

      <div style={{
        width: "100%", maxWidth: CANVAS_W, margin: "0 auto",
        aspectRatio: `${CANVAS_W} / ${CANVAS_H}`, borderRadius: 16,
        overflow: "hidden", border: "1px solid var(--glass-border)",
        background: "var(--bg)", position: "relative",
      }}>
        <ReactFlow
          className="fb-blueprint"
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionLineComponent={BlueprintConnectionLine}
          nodesDraggable
          nodesConnectable
          elementsSelectable
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          panOnScroll={false}
          preventScrolling={false}
          fitView
          fitViewOptions={{ padding: 0, minZoom: 0.2, maxZoom: 1 }}
          minZoom={0.2}
          maxZoom={1}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={22} size={1} color="var(--border)" />
        </ReactFlow>
      </div>
    </section>
  );
}
