import type { Metadata } from "next";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Settings",
  description: "Configure your LLM providers, add API keys, manage models, and connect to your local gateway. Supports OpenRouter, OpenAI, Anthropic, Groq, and 20+ more.",
  alternates: { canonical: `${SITE_URL}/settings` },
  openGraph: {
    title: "Settings",
    description: "Configure LLM providers and API keys. Connect OpenRouter, OpenAI, Anthropic, Groq, DeepSeek, Gemini, Mistral, and 20+ providers.",
    url: `${SITE_URL}/settings`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "OllamoMUI Settings" }],
  },
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
