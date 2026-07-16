import { SITE_URL } from "@/lib/config";
import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";

export type SeoSection = {
  heading: string;
  body: string[];
  code?: { lang: string; content: string };
  list?: string[];
};

export type SeoFaq = { question: string; answer: string };

export type SeoArticleProps = {
  slug: string;
  phase: "BOFU" | "MOFU" | "TOFU";
  title: string;
  description: string;
  keywords: string[];
  intro: string[];
  sections: SeoSection[];
  faqs?: SeoFaq[];
  ctaLabel?: string;
  ctaHref?: string;
};

export function buildSeoMetadata(p: SeoArticleProps): Metadata {
  const url = `${SITE_URL}/${p.slug}`;
  const ogDesc =
    p.description.length > 160 ? p.description.slice(0, 157) + "…" : p.description;
  return {
    title: p.title,
    description: p.description,
    keywords: p.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: p.title,
      description: ogDesc,
      url,
      type: "article",
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: p.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: p.title,
      description: ogDesc,
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}

function ArticleJsonLd(p: SeoArticleProps) {
  const url = `${SITE_URL}/${p.slug}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: p.title,
    description: p.description,
    keywords: p.keywords.join(", "),
    inLanguage: "en",
    datePublished: "2026-07-16",
    dateModified: "2026-07-16",
    author: { "@type": "Person", name: "Rakibul Hasan", alternateName: "Rhasan@dev", url: `${SITE_URL}/resume` },
    publisher: { "@type": "Organization", name: "OllamoMUI", url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(p.faqs && p.faqs.length
      ? {
          hasPart: {
            "@type": "FAQPage",
            mainEntity: p.faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        }
      : {}),
  };
  return <JsonLd data={data} />;
}

export default function SeoArticle(p: SeoArticleProps) {
  const url = `${SITE_URL}/${p.slug}`;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: p.title, item: url },
    ],
  };

  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "clamp(64px, 5vw, 96px) clamp(16px, 4vw, 24px)" }}>
      <ArticleJsonLd {...p} />
      <JsonLd data={breadcrumb} />

      <div style={{ marginBottom: 8 }}>
        <span style={{
          fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
          color: p.phase === "BOFU" ? "var(--accent)" : p.phase === "MOFU" ? "var(--accent-2)" : "var(--accent-3)",
        }}>
          {p.phase === "BOFU" ? "Hire · Services" : p.phase === "MOFU" ? "Engineering Guide" : "Industry Insight"}
        </span>
      </div>

      <h1 style={{
        fontSize: "var(--text-h1)", fontWeight: 700, marginBottom: 16, color: "var(--text)",
        lineHeight: "var(--leading-heading)", letterSpacing: "-0.02em",
      }}>
        {p.title}
      </h1>

      <p style={{ color: "var(--text-muted)", fontSize: "var(--text-lg)", lineHeight: 1.7, marginBottom: 32 }}>
        {p.intro.join(" ")}
      </p>

      {p.sections.map((s, i) => (
        <section key={i} style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: "var(--text-h2)", fontWeight: 700, marginBottom: 12, color: "var(--text)" }}>
            {s.heading}
          </h2>
          {s.body.map((para, j) => (
            <p key={j} style={{ color: "var(--text-muted)", fontSize: "var(--text-body)", lineHeight: 1.8, marginBottom: 14 }}>
              {para}
            </p>
          ))}
          {s.list && (
            <ul style={{ color: "var(--text-muted)", fontSize: "var(--text-body)", lineHeight: 1.8, paddingLeft: 20, marginBottom: 14 }}>
              {s.list.map((li, k) => (
                <li key={k} style={{ marginBottom: 6 }}>{li}</li>
              ))}
            </ul>
          )}
          {s.code && (
            <pre style={{
              background: "var(--code-bg, #0b1020)", color: "var(--code-fg, #e2e8f0)", padding: 18, borderRadius: 12,
              overflowX: "auto", fontSize: "var(--text-sm)", lineHeight: 1.6, border: "1px solid var(--glass-border)", marginBottom: 14,
            }}>
              <code>{s.code.content}</code>
            </pre>
          )}
        </section>
      ))}

      {p.faqs && p.faqs.length > 0 && (
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: "var(--text-h2)", fontWeight: 700, marginBottom: 12, color: "var(--text)" }}>FAQ</h2>
          {p.faqs.map((f, i) => (
            <details key={i} style={{
              background: "var(--surface)", border: "1px solid var(--glass-border)", borderRadius: 12,
              padding: "14px 18px", marginBottom: 10,
            }}>
              <summary style={{ fontWeight: 600, color: "var(--text)", cursor: "pointer" }}>{f.question}</summary>
              <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", lineHeight: 1.7, marginTop: 10 }}>{f.answer}</p>
            </details>
          ))}
        </section>
      )}

      <div className="spidey-panel" style={{
        background: "var(--surface)", padding: 28, borderRadius: 16, border: "1px solid var(--glass-border)",
        textAlign: "center", marginTop: 16,
      }}>
        <h3 style={{ fontSize: "var(--text-h3)", fontWeight: 700, marginBottom: 8 }}>
          {p.phase === "BOFU" ? "Hire Rakibul Hasan (Rhasan@dev)" : "Built by a Dhaka-based full-stack developer"}
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", marginBottom: 16, lineHeight: 1.7 }}>
          Rakibul Hasan is a full-stack developer in Dhaka, Bangladesh (GMT+6), open to remote jobs, work-from-home,
          and freelance work. Available for full-stack, backend, and AI/LLM engineering.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href={p.ctaHref || "/resume"} style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "12px 24px", borderRadius: 12,
            background: "var(--gradient-1)", color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: "var(--text-sm)",
          }}>
            {p.ctaLabel || "View resume / Hire me"}
          </Link>
          <a href="mailto:rbkhan00009@gmail.com" style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "12px 24px", borderRadius: 12,
            background: "var(--surface)", color: "var(--text)", textDecoration: "none", fontWeight: 700, fontSize: "var(--text-sm)",
            border: "1px solid var(--glass-border)",
          }}>
            Email me
          </a>
        </div>
      </div>
    </main>
  );
}
