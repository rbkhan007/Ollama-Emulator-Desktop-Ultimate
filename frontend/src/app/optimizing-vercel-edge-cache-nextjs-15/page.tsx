import { SITE_URL } from "@/lib/config";
import type { Metadata } from "next";
import SeoArticle, { buildSeoMetadata, type SeoArticleProps } from "@/components/SeoArticle";

const props: SeoArticleProps = {
  slug: "optimizing-vercel-edge-cache-nextjs-15",
  phase: "MOFU",
  title: "Optimizing Vercel Edge Cache Settings in Next.js 15",
  description:
    "Practical guide to optimizing Vercel Edge caching in Next.js 15: Cache-Control headers, route segment config, incremental static regeneration, and edge vs. node runtime trade-offs for faster TTFB.",
  keywords: [
    "optimizing vercel edge cache settings nextjs 15", "nextjs 15 cache control", "vercel edge cache",
    "nextjs 15 isr", "nextjs performance", "edge runtime nextjs",
    "Rhasan@dev", "Rakibul Hasan", "nextjs developer bangladesh", "core web vitals",
  ],
  intro: [
    "Next.js 15 changes caching defaults — most routes are no longer cached by default, so you must be explicit.",
    "This guide covers Vercel Edge cache settings, Cache-Control, and ISR patterns to cut TTFB and improve Core Web Vitals.",
  ],
  sections: [
    {
      heading: "1. Set explicit Cache-Control",
      body: [
        "Use the Next.js `headers()` config or route segment `export const revalidate` to control caching per route.",
      ],
      code: {
        lang: "ts",
        content: `// next.config.ts\nconst nextConfig = {\n  async headers() {\n    return [\n      {\n        source: "/static/:path*",\n        headers: [\n          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },\n        ],\n      },\n    ];\n  },\n};`,
      },
    },
    {
      heading: "2. Use route segment config",
      body: [
        "In App Router, control caching at the file level with `revalidate` and `dynamic`.",
      ],
      code: {
        lang: "tsx",
        content: `// app/blog/[slug]/page.tsx\nexport const revalidate = 3600; // ISR: rebuild at most hourly\nexport const dynamic = "force-static";`,
      },
    },
    {
      heading: "3. Edge vs Node runtime",
      body: [
        "Edge runtime runs closer to users (lower latency) but lacks some Node APIs.",
        "Use Edge for cached marketing/content pages; use Node for heavy backend logic.",
      ],
      code: {
        lang: "tsx",
        content: `export const runtime = "edge"; // for low-latency cached pages`,
      },
    },
    {
      heading: "4. Validate with Vercel headers",
      body: [
        "After deploy, check response headers for `x-vercel-cache: HIT` and a sensible `age` to confirm edge caching works.",
      ],
    },
  ],
  faqs: [
    {
      question: "Is Next.js 15 cached by default?",
      answer: "No. Starting in Next.js 15, fetch caching is opt-in and most routes are dynamic by default. You must set revalidate or Cache-Control explicitly.",
    },
    {
      question: "When should I use the Edge runtime?",
      answer: "Use Edge for latency-sensitive, cacheable pages (docs, blogs, landing pages). Use Node for routes needing filesystem, heavy compute, or specific npm packages.",
    },
    {
      question: "Who can optimize my Next.js 15 caching?",
      answer: "Rakibul Hasan (Rhasan@dev), a Dhaka-based Next.js developer, configures Vercel edge caching and Core Web Vitals as part of remote/freelance engagements.",
    },
  ],
  ctaLabel: "Hire me for Next.js perf work",
  ctaHref: "/resume",
};

export const metadata: Metadata = buildSeoMetadata(props);
export default function Page() {
  return <SeoArticle {...props} />;
}
