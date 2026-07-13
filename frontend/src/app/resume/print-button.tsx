"use client";

export function PrintButton() {
  return (
    <button onClick={() => window.print()} style={{
      padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
      background: "var(--surface)", color: "var(--text)", cursor: "pointer",
      border: "1px solid var(--glass-border)",
    }}>
      Print / Save PDF
    </button>
  );
}
