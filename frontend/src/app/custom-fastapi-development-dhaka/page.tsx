import { SITE_URL } from "@/lib/config";
import type { Metadata } from "next";
import SeoArticle, { buildSeoMetadata, type SeoArticleProps } from "@/components/SeoArticle";

const props: SeoArticleProps = {
  slug: "custom-fastapi-development-dhaka",
  phase: "BOFU",
  title: "Custom FastAPI Development Company in Dhaka — Backend & AI APIs",
  description:
    "Custom FastAPI development in Dhaka, Bangladesh. Rakibul Hasan (Rhasan@dev) builds high-performance Python backends, REST/LLM APIs, RAG pipelines, and PostgreSQL systems for remote and freelance clients worldwide.",
  keywords: [
    "custom fastapi development company dhaka", "fastapi developer bangladesh", "python backend developer dhaka",
    "fastapi development services", "hire fastapi developer", "backend developer bangladesh",
    "Rhasan@dev", "Rakibul Hasan", "llm api development", "postgresql developer bangladesh",
  ],
  intro: [
    "Need a reliable FastAPI backend but don't want enterprise agency overhead?",
    "Rakibul Hasan (Rhasan@dev) is a Dhaka-based backend engineer building custom FastAPI services — from REST APIs to LLM gateways and RAG pipelines — for remote, work-from-home, and freelance clients.",
  ],
  sections: [
    {
      heading: "FastAPI services we deliver",
      body: [
        "Async REST APIs with Pydantic validation, dependency injection, and OpenAPI docs out of the box.",
        "LLM proxy and gateway layers that emulate the Ollama/OpenAI APIs and route to free or paid models.",
        "Retrieval-augmented generation (RAG) with pgvector cosine similarity and PostgreSQL persistence.",
      ],
      list: [
        "Authentication (JWT/OAuth), role-based access control, and audit logging",
        "PostgreSQL schema design, migrations, and connection pooling (psycopg, pgvector)",
        "Background tasks, webhooks, and streaming responses",
        "Docker packaging and Vercel/Render deployment",
      ],
    },
    {
      heading: "Why a Dhaka-based FastAPI developer",
      body: [
        "FastAPI is Python-native and pairs perfectly with the large Bangladeshi Python talent pool.",
        "A single engineer owning backend + AI integration reduces handoff risk and speeds delivery.",
      ],
    },
    {
      heading: "How engagement works",
      body: [
        "Start with a scoped discovery call, then a fixed quote or hourly retainer.",
        "Communication via GitHub, email, and WhatsApp; demos and docs delivered continuously.",
      ],
    },
  ],
  faqs: [
    {
      question: "What does a custom FastAPI development company in Dhaka charge?",
      answer: "Project pricing is quoted per scope; hourly remote work typically runs $8–$40/hour. Rakibul Hasan provides transparent quotes before any coding begins.",
    },
    {
      question: "Can you build LLM/RAG APIs with FastAPI?",
      answer: "Yes. The OllamoMUI backend is a real-world example: a FastAPI service emulating Ollama/OpenAI APIs with RAG and persistent PostgreSQL memory.",
    },
    {
      question: "Do you deploy FastAPI apps?",
      answer: "Yes — Docker images, Render, and Vercel backends, with CI via GitHub Actions and health checks.",
    },
  ],
  ctaLabel: "Hire me for backend / FastAPI",
  ctaHref: "/resume",
};

export const metadata: Metadata = buildSeoMetadata(props);
export default function Page() {
  return <SeoArticle {...props} />;
}
