import type { Metadata } from "next";
import { SITE_URL } from "@/lib/config";
import RhasanCV from "@/components/Rhasan@CV";
import { DownloadCvButton } from "./download-cv-button";

export const metadata: Metadata = {
  title: "Resume — Rakibul Hasan (Rhasan@dev) — Full-Stack Developer",
  description: "Bangladesh-based (UIU) full-stack developer (GMT+6) open to remote, work-from-home, and local roles. AI/LLM, cross-platform desktop/mobile, developer tools. FastAPI, Next.js, React Native, PySide6, PostgreSQL, Docker.",
  alternates: { canonical: `${SITE_URL}/resume` },
  openGraph: {
    title: "Resume — Rakibul Hasan (Rhasan@dev)",
    description: "Bangladesh-based full-stack developer · AI/LLM · Cross-platform · Open to remote / WFH / local roles.",
    url: `${SITE_URL}/resume`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume — Rakibul Hasan (Rhasan@dev)",
    description: "Full-stack developer · AI/LLM · Cross-platform · Open to remote / WFH / local roles.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

export default function ResumePage() {
  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh", padding: "clamp(16px, 4vw, 32px)" }}>
      <style>{`
        @media print {
          @page { size: A4; margin: 12mm; }
          html, body { background: #fff !important; }
          body * { visibility: hidden; }
          #cv-document, #cv-document * { visibility: visible; }
          #cv-document {
            position: absolute; left: 0; top: 0; width: 100%;
            max-width: 100% !important; margin: 0 !important; padding: 0 !important;
          }
          .no-print { display: none !important; }
          a { text-decoration: none !important; color: #0f172a !important; }
        }
      `}</style>

      <div className="no-print" style={{ maxWidth: 794, margin: "0 auto 18px", display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap" }}>
        <DownloadCvButton />
        <a href="mailto:rbkhan00009@gmail.com" style={{
          padding: "12px 22px", borderRadius: 8, fontSize: 13, fontWeight: 700,
          background: "var(--gradient-1)", color: "white", textDecoration: "none",
        }}>
          Email Me
        </a>
      </div>
      <div id="cv-document">
        <RhasanCV />
      </div>
    </main>
  );
}
