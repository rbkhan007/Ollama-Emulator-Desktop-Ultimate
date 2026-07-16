import { SITE_URL } from "@/lib/config";
import type { Metadata } from "next";
import SeoArticle, { buildSeoMetadata, type SeoArticleProps } from "@/components/SeoArticle";

const props: SeoArticleProps = {
  slug: "configure-prisma-orm-with-pgvector",
  phase: "MOFU",
  title: "How to Configure Prisma ORM with pgvector for Vector Search",
  description:
    "Step-by-step guide to configure Prisma ORM with pgvector for semantic/vector search in PostgreSQL. Includes schema, migrations, and a cosine-similarity query pattern used in RAG pipelines.",
  keywords: [
    "how to configure prisma orm with pgvector", "prisma pgvector", "postgresql vector search",
    "rag vector database", "prisma vector embeddings", "semantic search postgres",
    "Rhasan@dev", "Rakibul Hasan", "ai engineer bangladesh", "nextjs prisma pgvector",
  ],
  intro: [
    "pgvector turns PostgreSQL into a vector database — perfect for RAG and semantic search.",
    "This guide shows how to configure Prisma ORM with pgvector, run the migration, and query nearest neighbors with cosine similarity.",
  ],
  sections: [
    {
      heading: "1. Enable the pgvector extension",
      body: [
        "First, ensure your PostgreSQL instance has the pgvector extension available, then enable it in a migration.",
      ],
      code: {
        lang: "sql",
        content: `-- migration.sql\nCREATE EXTENSION IF NOT EXISTS vector;\n\n-- table for embedded documents\nCREATE TABLE "DocumentChunk" (\n  "id" SERIAL PRIMARY KEY,\n  "content" TEXT NOT NULL,\n  "embedding" vector(1536) NOT NULL,\n  "documentId" INTEGER NOT NULL\n);`,
      },
    },
    {
      heading: "2. Model it in the Prisma schema",
      body: [
        "Prisma does not have a native vector type, so store embeddings as a raw type and manage them via raw SQL for inserts/queries.",
      ],
      code: {
        lang: "prisma",
        content: `model DocumentChunk {\n  id        Int    @id @default(autoincrement())\n  content   String\n  embedding Unsupported("vector(1536)")?\n  documentId Int\n}`,
      },
    },
    {
      heading: "3. Insert and query with cosine similarity",
      body: [
        "Insert embeddings as a parameterized vector literal, then order by the `<=>` cosine-distance operator (smaller = closer).",
      ],
      code: {
        lang: "ts",
        content: `import { PrismaClient } from "@prisma/client";\nconst prisma = new PrismaClient();\n\n// insert\nawait prisma.$executeRaw\n  \`INSERT INTO "DocumentChunk" ("content","embedding","documentId")\n    VALUES (\${content}, \${emb}::vector, \${docId})\`;\n\n// nearest neighbors\nconst hits = await prisma.$queryRaw\n  \`SELECT "content", "embedding" <=> \${emb}::vector AS distance\n     FROM "DocumentChunk" ORDER BY distance LIMIT 5\`;`,
      },
    },
    {
      heading: "4. Performance notes",
      body: [
        "Add an IVFFlat or HNSW index on the embedding column for large datasets.",
        "Keep embedding dimensions consistent with your model (e.g., 1536 for OpenAI text-embedding-3-small).",
      ],
    },
  ],
  faqs: [
    {
      question: "Does Prisma natively support pgvector?",
      answer: "Not directly — use the Unsupported(\"vector(n)\") type and raw SQL for inserts/queries. The schema still syncs normally via migrate.",
    },
    {
      question: "Which distance operator should I use?",
      answer: "Use <=> for cosine distance (most common for embeddings), <#> for negative inner product, and <-> for L2/Euclidean.",
    },
    {
      question: "Can I use pgvector with Next.js?",
      answer: "Yes. Run Prisma in a server component, API route, or backend service. Rakibul Hasan (Rhasan@dev) builds this pattern in RAG apps from Dhaka, Bangladesh.",
    },
  ],
  ctaLabel: "Hire me for RAG / Prisma work",
  ctaHref: "/resume",
};

export const metadata: Metadata = buildSeoMetadata(props);
export default function Page() {
  return <SeoArticle {...props} />;
}
