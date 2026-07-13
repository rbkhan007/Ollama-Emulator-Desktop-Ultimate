import type { Metadata } from "next";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "RAG Knowledge Base",
  description: "Upload documents, paste text, and search with semantic TF-IDF retrieval. OllamoMUI's RAG engine grounds AI answers in your own data using pgvector vector search.",
  alternates: { canonical: `${SITE_URL}/rag` },
  openGraph: {
    title: "RAG Knowledge Base",
    description: "Upload documents and ground AI answers in your own data. Semantic search with pgvector, TF-IDF indexing, and multi-collection management.",
    url: `${SITE_URL}/rag`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "OllamoMUI RAG Knowledge Base" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RAG Knowledge Base",
    description: "Upload documents and ground AI answers in your own data. Semantic search with pgvector.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

export default function RagLayout({ children }: { children: React.ReactNode }) {
  return children;
}
