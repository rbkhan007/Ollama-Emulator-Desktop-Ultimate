"use client";

export function GradientOrbs() {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, overflow: "hidden", contain: "strict" }}>
      <div className="orb-1" style={{
        position: "absolute", top: "-15%", right: "-10%", width: 500, height: 500,
        animation: "orbFloat1 20s ease-in-out infinite",
      }} />
      <div className="orb-2" style={{
        position: "absolute", bottom: "-10%", left: "-5%", width: 400, height: 400,
        animation: "orbFloat2 25s ease-in-out infinite",
      }} />
      <div className="orb-3" style={{
        position: "absolute", top: "40%", left: "50%", width: 350, height: 350,
        animation: "orbFloat3 18s ease-in-out infinite",
      }} />
    </div>
  );
}

export function MeshGrid() {
  return (
    <svg
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, opacity: 0.04 }}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}
