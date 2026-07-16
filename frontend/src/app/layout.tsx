import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import UniversalNav from "@/components/UniversalNav";
import Footer from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { GradientOrbs, MeshGrid } from "@/components/Background";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "@/lib/ThemeContext";
import { AuthProvider } from "@/lib/AuthContext";
import { DbProvider } from "@/lib/DbContext";
import GlobalScripts from "@/components/GlobalScripts";
import { SITE_URL, ASSET_BASE, BACKEND_URL } from "@/lib/config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: false,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

const themeScript = `
(function(){
  try {
    if (typeof localStorage === 'undefined' || typeof document === 'undefined') return;
    var t = localStorage.getItem('ollamomui-theme');
    if (t === 'light' || t === 'dark') {
      document.documentElement.setAttribute('data-theme', t);
    } else if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  } catch (e) {}
})();
`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "OllamoMUI — The #1 Ollama Alternative with 26 Free LLMs & RAG",
    template: "%s · OllamoMUI",
  },
  description: "OllamoMUI is the best free Ollama alternative — a local LLM proxy that emulates the Ollama API and routes your prompts to 26 real, 100% FREE models from OpenRouter, OpenAI, Anthropic, Groq, DeepSeek, Gemini and more. Built-in RAG knowledge base, persistent PostgreSQL memory with pgvector, usage analytics, and a polished dashboard. Works with Claude Code, OpenCode, Cursor, Continue.dev and any Ollama-compatible AI coding tool.",
  applicationName: "OllamoMUI",
  keywords: [
    "ollamomui", "ollama alternative", "ollama emulator", "free Ollama alternative",
    "free AI coding assistant", "best Ollama alternative", "free LLM proxy",
    "local LLM", "free AI models", "RAG knowledge base", "retrieval augmented generation",
    "TF-IDF search", "vector search", "AI coding assistant", "Claude Code", "OpenCode", "Cursor", "Continue.dev",
    "multi-provider AI", "OpenRouter free models", "OpenAI compatible", "Anthropic compatible",
    "local AI proxy", "AI chat playground", "persistent memory", "PostgreSQL AI memory",
    "LM Studio alternative", "run free models locally", "open source AI gateway",
    "fake ollama server", "ollama api emulator", "local gpt proxy", "free chatgpt alternative",
    "private AI", "self-hosted LLM", "offline AI proxy", "free github copilot alternative",
    "ai agent proxy", "llm load balancer", "streaming chat completions",
  ],
  authors: [{ name: "Rhasan@dev" }, { name: "rbkhan007" }],
  creator: "Rhasan@dev",
  publisher: "OllamoMUI",
  category: "technology",
  alternates: { canonical: SITE_URL },
  manifest: `${ASSET_BASE}/manifest.webmanifest`,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "OllamoMUI",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "OllamoMUI",
    title: "OllamoMUI — The #1 Ollama Alternative with 26 Free LLMs",
    description: "Best free Ollama alternative. Local LLM proxy routing prompts to 26 free models. RAG knowledge base, persistent AI memory, analytics, and dashboard in one file.",
    images: [{ url: `${ASSET_BASE}/og-image.png`, width: 1200, height: 630, alt: "OllamoMUI — free Ollama alternative with 26 LLMs" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "OllamoMUI — Free Local LLM Proxy with RAG & Memory",
    description: "Free & Open Source local Ollama API emulator routing prompts to 100% free LLMs. RAG, memory, analytics in one file.",
    images: [`${ASSET_BASE}/og-image.png`],
    creator: "@rbkhan007",
  },
  icons: {
    icon: [`${ASSET_BASE}/favicon.ico`, { url: `${ASSET_BASE}/icon-192.png`, type: "image/png", sizes: "192x192" }],
    apple: `${ASSET_BASE}/apple-touch-icon.png`,
  },
  verification: {
    google: "B9BhgbOr0QhuTmOzNOmBvFMm5d8wuyjyMqKgGFRPbTc",
  },
  other: {
    "dns-prefetch": "https://github.com",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f2ed" },
    { media: "(prefers-color-scheme: dark)", color: "#080c14" },
  ],
};

const softwareApplicationLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "OllamoMUI",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Windows, macOS, Linux, Web, Android",
  url: SITE_URL,
  image: `${ASSET_BASE}/og-image.png`,
  screenshot: `${ASSET_BASE}/og-image.png`,
  description:
    "Free, self-hosted AI gateway that emulates the Ollama API and routes prompts to 26 free LLMs with RAG, memory, desktop and mobile clients.",
  offers: [
    { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD" },
    { "@type": "Offer", name: "Desktop Pro", price: "4.99", priceCurrency: "USD" },
    { "@type": "Offer", name: "Mobile Ultimate", price: "2.99", priceCurrency: "USD" },
    { "@type": "Offer", name: "Web Pro", price: "9.99", priceCurrency: "USD" },
  ],
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "OllamoMUI",
  url: SITE_URL,
  logo: `${ASSET_BASE}/icon-192.png`,
  sameAs: ["https://github.com/rbkhan007/ollamomui"],
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "OllamoMUI",
  url: SITE_URL,
  description: "Best free Ollama alternative — local LLM proxy with 26 free models, RAG, and persistent AI memory.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/playground`,
    },
    "query-input": "required",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrains.variable}`}>
      <head>
        <link rel="dns-prefetch" href="https://github.com" />
        <link rel="preconnect" href="https://github.com" />
        <link rel="dns-prefetch" href={BACKEND_URL} />
        <link rel="preconnect" href={BACKEND_URL} />
        <link rel="dns-prefetch" href={SITE_URL} />
        <link rel="preconnect" href={SITE_URL} />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
        <link rel="preconnect" href="https://va.vercel-scripts.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <JsonLd data={softwareApplicationLd} />
        <JsonLd data={organizationLd} />
        <JsonLd data={websiteLd} />
      </head>
      <body>
        <GlobalScripts />
        <ScrollToTop />
        <ThemeProvider>
          <AuthProvider>
            <DbProvider>
              <GradientOrbs />
              <MeshGrid />
              <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                <UniversalNav />
                <main style={{ flex: 1 }}>
                  {children}
                </main>
                <Footer />
              </div>
            </DbProvider>
          </AuthProvider>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
