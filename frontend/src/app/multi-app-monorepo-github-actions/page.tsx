import { SITE_URL } from "@/lib/config";
import type { Metadata } from "next";
import SeoArticle, { buildSeoMetadata, type SeoArticleProps } from "@/components/SeoArticle";

const props: SeoArticleProps = {
  slug: "multi-app-monorepo-github-actions",
  phase: "MOFU",
  title: "Setting Up a Multi-App Monorepo with GitHub Actions CI",
  description:
    "Step-by-step guide to setting up a multi-app monorepo (frontend, mobile, backend) with GitHub Actions: path-filtered workflows, caching, and parallel CI for faster, safer deployments.",
  keywords: [
    "setting up multi-app monorepo github actions", "monorepo github actions", "turborepo ci",
    "path filter github actions", "monorepo frontend mobile backend", "github actions cache",
    "Rhasan@dev", "Rakibul Hasan", "devops bangladesh", "full-stack developer",
  ],
  intro: [
    "A monorepo keeps frontend, mobile, and backend in one place — but CI must be smart to stay fast.",
    "This guide shows how to set up a multi-app monorepo with GitHub Actions using path filters and caching, the same pattern used by OllamoMUI.",
  ],
  sections: [
    {
      heading: "1. Repo layout",
      body: [
        "Organize apps under a clear root so workflows can target them with paths filters.",
      ],
      code: {
        lang: "text",
        content: `repo/\n  frontend/   (Next.js)\n  mobile/     (React Native / Expo)\n  backend/    (FastAPI)\n  .github/workflows/ci.yml`,
      },
    },
    {
      heading: "2. Path-filtered CI",
      body: [
        "Only run a job when files in its app changed — this keeps CI fast in a multi-app repo.",
      ],
      code: {
        lang: "yaml",
        content: `name: CI\non: [push, pull_request]\njobs:\n  frontend:\n    if: \${{ github.event_name == 'push' || contains(github.event.pull_request.changed_files, 'frontend') }}\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with: { node-version: 20, cache: npm, cache-dependency-path: frontend/package-lock.json }\n      - run: npm ci\n        working-directory: frontend\n      - run: npm run build\n        working-directory: frontend`,
      },
    },
    {
      heading: "3. Cache and parallelize",
      body: [
        "Use the built-in npm/pip caches keyed by lockfile, and run jobs in parallel.",
        "For larger monorepos, adopt Turborepo or Nx to share build caches across apps.",
      ],
    },
    {
      heading: "4. Secure secrets & Dependabot",
      body: [
        "Store deploy keys in GitHub Encrypted Secrets; enable Dependabot for npm, pip, and github-actions ecosystems.",
      ],
    },
  ],
  faqs: [
    {
      question: "How do I run CI only for changed apps?",
      answer: "Use path filters or check changed files in an `if:` condition, as shown above. For many apps, a matrix with paths is cleaner.",
    },
    {
      question: "Should I use Turborepo or Nx?",
      answer: "Both work. Turborepo is lighter and pairs well with Next.js; Nx is more feature-rich. Either shares task caches across the monorepo.",
    },
    {
      question: "Can a Dhaka developer set this up for me?",
      answer: "Yes. Rakibul Hasan (Rhasan@dev) configures monorepo CI/CD, GitHub Actions, and Dependabot as part of freelance/devops engagements.",
    },
  ],
  ctaLabel: "Hire me for CI/CD setup",
  ctaHref: "/resume",
};

export const metadata: Metadata = buildSeoMetadata(props);
export default function Page() {
  return <SeoArticle {...props} />;
}
