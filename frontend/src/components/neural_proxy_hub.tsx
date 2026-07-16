"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Cpu, Zap, Cloud, Terminal, Layers, Code, Bot, Server, Database, GitBranch } from "lucide-react";

type NodeType = "agent" | "hub" | "provider";
type NodeData = { id: string; label: string; icon: React.ElementType; type: NodeType; color: string };

const AGENTS: NodeData[] = [
  { id: "n1", label: "Claude Code", icon: Cpu, type: "agent", color: "var(--accent-2)" },
  { id: "n2", label: "OpenCode", icon: Terminal, type: "agent", color: "var(--accent)" },
  { id: "n3", label: "KiloCode", icon: Layers, type: "agent", color: "var(--green)" },
  { id: "n4", label: "Ollama CLI", icon: Code, type: "agent", color: "var(--accent-4)" },
  { id: "n5", label: "Cursor", icon: Bot, type: "agent", color: "var(--accent-3)" },
];

const HUB: NodeData = { id: "hub", label: "OllamoMUI Hub", icon: Zap, type: "hub", color: "var(--accent)" };

const PROVIDERS: NodeData[] = [
  { id: "p1", label: "OpenAI", icon: Cloud, type: "provider", color: "var(--green)" },
  { id: "p2", label: "Anthropic", icon: Cloud, type: "provider", color: "var(--accent-2)" },
  { id: "p3", label: "Groq", icon: Server, type: "provider", color: "var(--accent-4)" },
  { id: "p4", label: "Gemini", icon: Database, type: "provider", color: "var(--accent-3)" },
  { id: "p5", label: "Mistral", icon: GitBranch, type: "provider", color: "var(--accent)" },
];

type Edge = { id: string; d: string; color: string };

export default function NeuralProxyHub() {
  const [activeAgent, setActiveAgent] = useState<string>("n1");
  const [activeProviders, setActiveProviders] = useState<Set<string>>(new Set(["p2"]));
  const [edges, setEdges] = useState<Edge[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const toggleProvider = (id: string) => {
    setActiveProviders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const recompute = useCallback(() => {
    const cont = containerRef.current;
    if (!cont) return;
    const cb = cont.getBoundingClientRect();

    const point = (id: string, side: "left" | "right") => {
      const el = nodeRefs.current[id];
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: (side === "right" ? r.right : r.left) - cb.left,
        y: r.top - cb.top + r.height / 2,
      };
    };

    const curve = (a: { x: number; y: number }, b: { x: number; y: number }) => {
      const cp = (b.x - a.x) * 0.5;
      return `M ${a.x} ${a.y} C ${a.x + cp} ${a.y}, ${b.x - cp} ${b.y}, ${b.x} ${b.y}`;
    };

    const next: Edge[] = [];
    const agent = AGENTS.find((n) => n.id === activeAgent);
    if (agent) {
      const aOut = point(activeAgent, "right");
      const hubIn = point("hub", "left");
      const hubOut = point("hub", "right");
      if (aOut && hubIn) next.push({ id: `${activeAgent}-hub`, d: curve(aOut, hubIn), color: agent.color });
      activeProviders.forEach((pId) => {
        const prov = PROVIDERS.find((p) => p.id === pId);
        const pIn = point(pId, "left");
        if (hubOut && pIn && prov) next.push({ id: `hub-${pId}`, d: curve(hubOut, pIn), color: prov.color });
      });
    }
    setEdges(next);
  }, [activeAgent, activeProviders]);

  useEffect(() => {
    recompute();
    const cont = containerRef.current;
    if (!cont) return;
    const ro = new ResizeObserver(recompute);
    ro.observe(cont);
    window.addEventListener("resize", recompute);
    return () => { ro.disconnect(); window.removeEventListener("resize", recompute); };
  }, [recompute]);

  const columnHeader = (text: string) => (
    <div style={{
      fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
      color: "var(--text-muted)", textAlign: "center", marginBottom: 4,
    }}>{text}</div>
  );

  const nodeButton = (node: NodeData, active: boolean, onClick: () => void) => {
    const Icon = node.icon;
    return (
      <button
        key={node.id}
        ref={(el) => { nodeRefs.current[node.id] = el; }}
        onClick={onClick}
        aria-pressed={active}
        style={{
          appearance: "none", cursor: "pointer", width: "100%", textAlign: "left",
          display: "flex", alignItems: "center", gap: 10, padding: node.type === "hub" ? "16px 18px" : "12px 14px",
          borderRadius: 12, background: "var(--surface)",
          border: active ? `1px solid ${node.color}` : "1px solid var(--glass-border)",
          boxShadow: active ? `0 0 0 1px ${node.color}, 0 0 18px color-mix(in srgb, ${node.color} 35%, transparent)` : "none",
          color: "var(--text)", transition: "border-color .2s, box-shadow .2s",
        }}
      >
        <Icon size={node.type === "hub" ? 22 : 18} style={{ color: node.color, flexShrink: 0 }} />
        <span style={{
          fontSize: node.type === "hub" ? 15 : 13, fontWeight: node.type === "hub" ? 700 : 600,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{node.label}</span>
      </button>
    );
  };

  return (
    <div className="spidey-panel" style={{
      background: "var(--surface)", border: "1px solid var(--glass-border)",
      borderRadius: 16, padding: 24, textAlign: "left",
    }}>
      <div style={{ marginBottom: 20, textAlign: "center" }}>
        <h3 style={{
          margin: "0 0 6px", fontSize: "var(--text-h3)", fontWeight: 700,
          background: "var(--gradient-h3)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          One hub, every provider
        </h3>
        <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
          Pick an agent and toggle providers to trace how OllamoMUI routes your prompts.
        </p>
      </div>

      <div ref={containerRef} style={{ position: "relative" }}>
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1, overflow: "visible" }}
          aria-hidden="true"
        >
          {edges.map((e) => (
            <g key={e.id}>
              <path d={e.d} fill="none" strokeWidth={2} style={{ stroke: e.color, opacity: 0.55 }} />
              <circle r={3.5} style={{ fill: e.color }}>
                <animateMotion dur="1.6s" repeatCount="indefinite" path={e.d} />
              </circle>
            </g>
          ))}
        </svg>

        <div className="nph-grid" style={{
          position: "relative", zIndex: 2,
          display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.1fr) minmax(0,1fr)",
          gap: 16, alignItems: "center",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {columnHeader("CLI Agents")}
            {AGENTS.map((n) => nodeButton(n, activeAgent === n.id, () => setActiveAgent(n.id)))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            {nodeButton(HUB, true, () => {})}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {columnHeader("AI Providers")}
            {PROVIDERS.map((n) => nodeButton(n, activeProviders.has(n.id), () => toggleProvider(n.id)))}
          </div>
        </div>
      </div>
    </div>
  );
}
