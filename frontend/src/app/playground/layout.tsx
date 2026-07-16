import type { Metadata } from "next";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "AI Chat Playground",
  description: "Test 26 free LLMs in real-time. Stream responses from OpenRouter, OpenAI, Anthropic, Groq, DeepSeek, and Gemini — zero cost. Built by Rakibul Hasan (Rhasan@dev), a Dhaka, Bangladesh full-stack developer open to remote and freelance work.",
  keywords: ["AI chat playground", "free LLMs", "OllamoMUI", "Rakibul Hasan", "Rhasan@dev", "full-stack developer Dhaka", "remote jobs Bangladesh", "freelance developer Bangladesh"],
  alternates: { canonical: `${SITE_URL}/playground` },
  openGraph: {
    title: "AI Chat Playground",
    description: "Try 26 free LLMs side-by-side. Stream responses, switch models, export conversations. The best free AI coding assistant playground.",
    url: `${SITE_URL}/playground`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "OllamoMUI AI Chat Playground" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Chat Playground",
    description: "Try 26 free LLMs side-by-side. Stream responses, switch models, export conversations.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return children;
}
