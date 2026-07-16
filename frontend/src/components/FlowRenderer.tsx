"use client";

import { useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { useNodesState, useEdgesState, addEdge, type Node, type Edge, type Connection } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const ReactFlow = dynamic(() => import("@xyflow/react").then(m => m.ReactFlow), { ssr: false });
const Background = dynamic(() => import("@xyflow/react").then(m => m.Background), { ssr: false });
const Controls = dynamic(() => import("@xyflow/react").then(m => m.Controls), { ssr: false });

export default function FlowRenderer({ code }: { code: string }) {
  const { initialNodes, initialEdges, parseError } = useMemo(() => {
    try {
      const parsed = JSON.parse(code);
      return {
        initialNodes: (parsed.nodes || []) as Node[],
        initialEdges: (parsed.edges || []) as Edge[],
        parseError: false,
      };
    } catch {
      return { initialNodes: [] as Node[], initialEdges: [] as Edge[], parseError: true };
    }
  }, [code]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges(eds => addEdge(params, eds)),
    [setEdges]
  );

  if (parseError) {
    return <p style={{ color: "var(--red)", fontSize: "var(--text-sm)", padding: 8 }}>Invalid flow JSON</p>;
  }

  if (!initialNodes.length) {
    return <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", padding: 8 }}>No nodes in flow</p>;
  }

  return (
    <div style={{ width: "100%", height: 300, borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)", background: "var(--bg)", position: "relative" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background gap={12} size={1.5} />
        <Controls style={{ background: "var(--surface)", borderRadius: 8, border: "1px solid var(--border)" }} />
      </ReactFlow>
    </div>
  );
}
