import { SITE_URL } from "@/lib/config";
import type { Metadata } from "next";
import SeoArticle, { buildSeoMetadata, type SeoArticleProps } from "@/components/SeoArticle";

const props: SeoArticleProps = {
  slug: "hire-nextjs-developer-bangladesh",
  phase: "BOFU",
  title: "Hire Next.js Developer in Bangladesh — Remote, WFH & Freelance",
  description:
    "Hire a Next.js 15 developer in Bangladesh for production web apps, dashboards, and AI-integrated frontends. Remote, work-from-home, and freelance engagements with Rakibul Hasan (Rhasan@dev), a Dhaka-based full-stack engineer.",
  keywords: [
    "hire nextjs developer in bangladesh", "nextjs developer dhaka", "remote nextjs developer bangladesh",
    "freelance nextjs developer", "react developer bangladesh", "full-stack developer dhaka",
    "Rhasan@dev", "Rakibul Hasan", "hire full-stack developer", "nextjs 15 bangladesh",
  ],
  intro: [
    "If you need to hire a Next.js developer in Bangladesh, you want someone who ships production-grade apps — not just prototypes.",
    "Rakibul Hasan (Rhasan@dev) is a Dhaka-based full-stack developer with deep Next.js 15, React, and TypeScript experience, available for remote, work-from-home, and freelance roles worldwide.",
  ],
  sections: [
    {
      heading: "What a Bangladesh-based Next.js developer delivers",
      body: [
        "Next.js 15 App Router applications with server components, streaming, and Turbopack for fast builds.",
        "Type-safe frontends with TypeScript, Tailwind CSS, and accessible, responsive design systems.",
        "AI-integrated UIs: chat playgrounds, RAG interfaces, and streaming LLM responses wired to your backend.",
      ],
      list: [
        "Production dashboards, SaaS frontends, and marketing sites",
        "Authentication, API routes, and database integration (PostgreSQL, Prisma)",
        "SEO: metadata, JSON-LD, sitemaps, and Core Web Vitals optimization",
        "Cross-platform alignment with React Native and PySide6 desktop apps",
      ],
    },
    {
      heading: "Engagement models",
      body: [
        "Remote (any timezone, async with GMT+6 overlap), work-from-home within Dhaka, or fixed-scope freelance contracts.",
        "Billing in USD via Bkash, Nagad, bank transfer, or international payment — flexible per project.",
      ],
    },
    {
      heading: "Why hire from Dhaka, Bangladesh",
      body: [
        "Bangladesh offers a strong pool of English-speaking engineers at competitive rates without sacrificing quality.",
        "Working with a single full-stack developer means faster communication, lower overhead, and end-to-end ownership.",
      ],
    },
  ],
  faqs: [
    {
      question: "How much does it cost to hire a Next.js developer in Bangladesh?",
      answer:
        "Rates typically range from $8–$40/hour depending on scope, with fixed-scope freelance projects quoted per deliverable. Rakibul Hasan offers both hourly and project-based pricing.",
    },
    {
      question: "Can I hire a Bangladesh Next.js developer remotely?",
      answer: "Yes. Rakibul Hasan works remotely with clients worldwide, overlapping GMT+6 with your team's hours and using async tools (GitHub, Slack, email).",
    },
    {
      question: "Do you build AI-integrated Next.js apps?",
      answer: "Yes. Recent work includes an AI chat playground, RAG knowledge base UI, and streaming LLM interfaces using the Ollama/OpenAI-compatible APIs.",
    },
  ],
  ctaLabel: "View resume / Hire me",
  ctaHref: "/resume",
};

export const metadata: Metadata = buildSeoMetadata(props);
export default function Page() {
  return <SeoArticle {...props} />;
}
