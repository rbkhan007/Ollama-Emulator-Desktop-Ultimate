"use client";

import PlaygroundWorkspace from "./notebook_style_playground";

export default function PlaygroundPage() {
  return (
    <div className="page-container" style={{ maxWidth: "100%", padding: "8px 12px 24px" }}>
      <PlaygroundWorkspace />
    </div>
  );
}
