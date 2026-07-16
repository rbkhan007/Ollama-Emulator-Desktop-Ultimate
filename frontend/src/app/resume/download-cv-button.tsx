"use client";

import { useState } from "react";

export function DownloadCvButton() {
  const [busy, setBusy] = useState(false);

  function handleDownload() {
    setBusy(true);
    // Use the browser's native print-to-PDF. A dedicated @media print rule in the
    // resume page isolates #cv-document onto clean A4 white paper, so "Save as PDF"
    // produces a perfect, dependency-free CV file. No external libs / iframes.
    setTimeout(() => {
      window.print();
      setBusy(false);
    }, 50);
  }

  return (
    <button
      onClick={handleDownload}
      style={{
        padding: "12px 22px", borderRadius: 8, fontSize: 13, fontWeight: 700,
        background: "var(--surface)", color: "var(--text)", cursor: "pointer",
        border: "1px solid var(--glass-border)",
        display: "inline-flex", alignItems: "center", gap: 8,
      }}
    >
      ⬇ Download / Print CV (PDF)
    </button>
  );
}
