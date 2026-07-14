"use client";

export function PrintButton() {
  return (
    <button onClick={() => window.print()} style={{
      padding: "12px 24px", borderRadius: 8, fontSize: 13, fontWeight: 600,
      background: "var(--surface)", color: "var(--text)", cursor: "pointer",
      border: "1px solid var(--glass-border)",
    }}>
      Print / Save PDF
    </button>
  );
}
