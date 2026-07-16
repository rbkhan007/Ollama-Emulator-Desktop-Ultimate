import type { Metadata } from "next";
import { SITE_URL } from "@/lib/config";
import RhasanCV from "@/components/Rhasan@CV";
import { DownloadCvButton } from "./download-cv-button";

export const metadata: Metadata = {
  title: "Resume — Rakibul Hasan (Rhasan@dev) — Full-Stack Developer in Dhaka, Bangladesh",
  description: "Rakibul Hasan (Rhasan@dev) — Bangladesh full-stack developer in Dhaka (GMT+6) open to remote jobs, work-from-home, freelance, and local roles. AI/LLM, RAG, cross-platform desktop/mobile, FastAPI, Next.js, React Native, PySide6, PostgreSQL, Docker. Hire for remote or Dhaka-based full-stack, backend, and AI engineer positions.",
  keywords: [
    "Rakibul Hasan", "Rhasan@dev", "full-stack developer Bangladesh", "full-stack developer Dhaka",
    "remote jobs Bangladesh", "work from home Bangladesh", "freelance developer Bangladesh",
    "hire full-stack developer", "Dhaka developer jobs", "remote developer Bangladesh",
    "AI developer Bangladesh", "LLM engineer", "React developer Dhaka", "Python developer Bangladesh",
    "CV", "resume", "jobs in Dhaka", "Bangladesh freelance",
  ],
  alternates: { canonical: `${SITE_URL}/resume` },
  openGraph: {
    title: "Resume — Rakibul Hasan (Rhasan@dev) — Full-Stack Developer Dhaka",
    description: "Bangladesh full-stack developer in Dhaka · AI/LLM · Remote / WFH / Freelance / Local roles · Hire me.",
    url: `${SITE_URL}/resume`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume — Rakibul Hasan (Rhasan@dev) — Full-Stack Developer Dhaka",
    description: "Bangladesh full-stack developer · Remote / WFH / Freelance · Hire me for full-stack & AI roles.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

const PERSON_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Rakibul Hasan",
  alternateName: "Rhasan@dev",
  jobTitle: "Full-Stack Developer",
  description:
    "Bangladesh-based full-stack developer in Dhaka (GMT+6) specializing in AI/LLM systems, cross-platform apps, and backend engineering. Open to remote, work-from-home, freelance, and local roles.",
  url: `${SITE_URL}/resume`,
  email: "mailto:rbkhan00009@gmail.com",
  telephone: "+8801774471120",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dhaka",
    addressCountry: "BD",
  },
  areaServed: ["Bangladesh", "Dhaka", "Remote"],
  availableForHire: true,
  knowsAbout: [
    "Full-Stack Development", "AI/LLM", "FastAPI", "Next.js", "React Native",
    "PySide6", "PostgreSQL", "Docker", "RAG", "TypeScript", "Python",
  ],
  sameAs: [
    "https://github.com/rbkhan007",
    `${SITE_URL}`,
  ],
};

const JOB_POSTING_JSONLD = {
  "@context": "https://schema.org",
  "@type": "JobPosting",
  title: "Full-Stack Developer & AI/LLM Engineer (Remote / Freelance / Dhaka)",
  description:
    "Rakibul Hasan (Rhasan@dev) is a full-stack developer and AI/LLM engineer based in Dhaka, Bangladesh (GMT+6), available for remote, work-from-home, freelance, and local full-stack, backend, and AI engineering roles. Skills: Next.js, React, React Native, TypeScript, Python, FastAPI, PySide6, PostgreSQL, Docker, RAG, LLM integration.",
  datePosted: "2026-07-16",
  employmentType: ["REMOTE", "CONTRACTOR", "FULL_TIME", "PART_TIME"],
  hiringOrganization: {
    "@type": "Organization",
    name: "Independent / Freelance",
    sameAs: [`${SITE_URL}/resume`],
  },
  jobLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dhaka",
      addressCountry: "BD",
    },
  },
  applicantLocationRequirements: {
    "@type": "Country",
    name: "BD",
  },
  jobLocationType: "TELECOMMUTE",
  baseSalary: {
    "@type": "MonetaryAmount",
    currency: "USD",
    value: { "@type": "QuantitativeValue", minValue: 8, maxValue: 40, unitText: "HOUR" },
  },
  industry: "Software Development",
  occupationalCategory: "15-1252.00",
  url: `${SITE_URL}/resume`,
};

const SERVICE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Full-Stack & AI/LLM Development Services",
  serviceType: "Software Development",
  provider: { "@type": "Person", name: "Rakibul Hasan", alternateName: "Rhasan@dev", url: `${SITE_URL}/resume` },
  areaServed: ["Bangladesh", "Dhaka", "Remote"],
  description:
    "Hire Rakibul Hasan (Rhasan@dev), a Dhaka-based full-stack developer, for web apps, cross-platform desktop/mobile apps, AI/LLM integrations, RAG systems, and developer tools. Remote, freelance, and local engagements welcome.",
  url: `${SITE_URL}/resume`,
};

export default function ResumePage() {
  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh", padding: "clamp(16px, 4vw, 32px)" }}>
      <style>{`
        @media print {
          @page { size: A4; margin: 12mm; }
          html, body { background: #fff !important; }
          body * { visibility: hidden; }
          #cv-document, #cv-document * { visibility: visible; }
          #cv-document {
            position: absolute; left: 0; top: 0; width: 100%;
            max-width: 100% !important; margin: 0 !important; padding: 0 !important;
          }
          .no-print { display: none !important; }
          a { text-decoration: none !important; color: #0f172a !important; }
        }
      `}</style>

      <div className="no-print" style={{ maxWidth: 794, margin: "0 auto 18px", display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap" }}>
        <DownloadCvButton />
        <a href="mailto:rbkhan00009@gmail.com" style={{
          padding: "12px 22px", borderRadius: 8, fontSize: 13, fontWeight: 700,
          background: "var(--gradient-1)", color: "white", textDecoration: "none",
        }}>
          Email Me
        </a>
      </div>
      <div id="cv-document">
        <RhasanCV />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JOB_POSTING_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_JSONLD) }}
      />
    </main>
  );
}
