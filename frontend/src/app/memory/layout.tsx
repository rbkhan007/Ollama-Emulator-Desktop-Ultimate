import type { Metadata } from "next";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Persistent AI Memory",
  description: "Every conversation auto-saves to PostgreSQL. Browse sessions, extract facts, search history, and export memory — your AI companion never forgets.",
  alternates: { canonical: `${SITE_URL}/memory` },
  openGraph: {
    title: "Persistent AI Memory",
    description: "PostgreSQL-powered persistent memory for your AI conversations. Auto-save sessions, extract key facts, search history, and export data.",
    url: `${SITE_URL}/memory`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "OllamoMUI Persistent AI Memory" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Persistent AI Memory",
    description: "PostgreSQL-powered persistent memory for your AI conversations. Auto-save, search, export.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

export default function MemoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
