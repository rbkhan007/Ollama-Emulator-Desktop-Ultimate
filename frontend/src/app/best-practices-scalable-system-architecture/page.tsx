import { SITE_URL } from "@/lib/config";
import type { Metadata } from "next";
import SeoArticle, { buildSeoMetadata, type SeoArticleProps } from "@/components/SeoArticle";

const props: SeoArticleProps = {
  slug: "best-practices-scalable-system-architecture",
  phase: "TOFU",
  title: "Best Practices for Scalable System Architecture",
  description:
    "A practical framework of best practices for scalable system architecture: separation of concerns, stateless services, caching, queues, database scaling, and observability — explained for engineers building products in 2026.",
  keywords: [
    "best practices for scalable system architecture", "scalable architecture", "system design",
    "microservices vs monolith", "caching strategy", "database scaling",
    "Rhasan@dev", "Rakibul Hasan", "software architect bangladesh", "backend best practices",
  ],
  intro: [
    "Scalability is not a single technology — it is a set of disciplined choices made early.",
    "This guide lays out a practical, framework-agnostic set of best practices for designing systems that grow without breaking.",
  ],
  sections: [
    {
      heading: "1. Separate concerns",
      body: [
        "Keep presentation, application, and data layers distinct.",
        "A monolith with clean boundaries scales further than a messy microservice sprawl.",
      ],
    },
    {
      heading: "2. Make services stateless",
      body: [
        "Store session/state externally (Redis, PostgreSQL) so any instance can serve any request.",
        "Statelessness enables horizontal scaling and simpler CI/CD.",
      ],
    },
    {
      heading: "3. Cache aggressively",
      body: [
        "Cache at the edge (CDN), app (in-memory), and data (materialized views) layers.",
        "Use cache-control and ISR for content; use Redis for hot keys.",
      ],
    },
    {
      heading: "4. Use queues for heavy work",
      body: [
        "Offload email, embeddings, and report generation to background workers via queues.",
        "This keeps request paths fast and resilient to spikes.",
      ],
    },
    {
      heading: "5. Scale the database deliberately",
      body: [
        "Start with one well-indexed PostgreSQL; add read replicas and partitioning before sharding.",
        "For vector/semantic search, use pgvector; for analytics, consider columnar stores.",
      ],
    },
    {
      heading: "6. Observability is non-negotiable",
      body: [
        "Instrument logs, metrics, and traces from day one.",
        "Health checks and alerting prevent small issues from becoming outages.",
      ],
    },
  ],
  faqs: [
    {
      question: "Monolith or microservices for scalability?",
      answer: "Start with a modular monolith. Move to services only for parts with distinct scaling or team boundaries. Premature microservices add latency and ops cost.",
    },
    {
      question: "What is the cheapest scaling win?",
      answer: "Caching and statelessness. They let you add instances behind a load balancer with almost no code change.",
    },
    {
      question: "Who can help design my architecture?",
      answer: "Rakibul Hasan (Rhasan@dev), a Dhaka-based full-stack/backend engineer, designs and implements scalable FastAPI + PostgreSQL + Next.js systems for remote clients.",
    },
  ],
  ctaLabel: "Hire me for system design",
  ctaHref: "/resume",
};

export const metadata: Metadata = buildSeoMetadata(props);
export default function Page() {
  return <SeoArticle {...props} />;
}
