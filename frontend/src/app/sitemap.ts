import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/resume`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/playground`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/rag`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/memory`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/architecture`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/api-docs`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/status`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/security`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/case-study`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/download`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/settings`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/admin`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/cancel`, lastModified: now, changeFrequency: "monthly", priority: 0.2 },
    { url: `${SITE_URL}/payment-result`, lastModified: now, changeFrequency: "monthly", priority: 0.2 },
    { url: `${SITE_URL}/success`, lastModified: now, changeFrequency: "monthly", priority: 0.2 },

    // Phase 1 — BOFU (hire / services)
    { url: `${SITE_URL}/hire-nextjs-developer-bangladesh`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/custom-fastapi-development-dhaka`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/cost-to-build-ai-applications-bangladesh`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },

    // Phase 2 — MOFU (engineering guides)
    { url: `${SITE_URL}/configure-prisma-orm-with-pgvector`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/optimizing-vercel-edge-cache-nextjs-15`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/multi-app-monorepo-github-actions`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },

    // Phase 3 — TOFU (industry insights)
    { url: `${SITE_URL}/software-engineering-trends-bangladesh-2026`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/best-practices-scalable-system-architecture`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/react-19-features-enterprise-systems`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}
