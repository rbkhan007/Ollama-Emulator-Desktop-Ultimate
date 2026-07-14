"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import "@xyflow/react/dist/style.css";

const ReactFlow = dynamic(() => import("@xyflow/react").then(m => m.ReactFlow), { ssr: false });
const Background = dynamic(() => import("@xyflow/react").then(m => m.Background), { ssr: false });

export default function FlowRenderer({ code }: { code: string }) {
  let parsed: { nodes?: any[]; edges?: any[] } = {};
  try { parsed = JSON.parse(code); } catch {
    return <p style={{ color: "var(--red)", fontSize: "var(--text-sm)", padding: 8 }}>Invalid flow JSON</p>;
  }

  const nodes = useMemo(() => parsed.nodes || [], [parsed.nodes]);
  const edges = useMemo(() => parsed.edges || [], [parsed.edges]);

  if (!nodes.length) {
    return <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", padding: 8 }}>No nodes in flow</p>;
  }

  return (
    <div style={{ width: "100%", height: 300, borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)", background: "var(--bg)", position: "relative" }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background gap={12} size={1.5} />
      </ReactFlow>
    </div>
  );
}
