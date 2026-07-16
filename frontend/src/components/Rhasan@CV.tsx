import { Mail, Phone, Code, Globe, MapPin, ExternalLink, Briefcase } from "lucide-react";

const SKILLS: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python 3.14", "TypeScript", "JavaScript", "SQL", "HTML / CSS"] },
  { group: "Backend", items: ["FastAPI", "SQLAlchemy", "PostgreSQL + pgvector", "REST API", "JWT / OAuth 2.0"] },
  { group: "Frontend", items: ["Next.js 15", "React 19", "React Native / Expo", "Tailwind", "PWA / SEO"] },
  { group: "Desktop / Mobile", items: ["PySide6 / QML", "Tauri", "Offline-first", "Auto-updaters"] },
  { group: "AI / LLM", items: ["Ollama-compatible API", "RAG + pgvector", "Multi-provider routing", "Streaming SSE"] },
  { group: "DevOps / Security", items: ["Docker", "Vercel / Render", "NeonDB", "RBAC", "CSP / HSTS / CSRF"] },
];

const EXPERIENCE = [
  {
    role: "Founder & Lead Developer",
    org: "OllamoMUI · Bangladesh (Remote)",
    period: "2025 — Present",
    points: [
      "Built a free, open-source local AI gateway emulating Ollama / OpenAI APIs, routing to 26+ free LLMs.",
      "Engineered a RAG pipeline with hybrid vector + keyword search (pgvector + pg_trgm) and cross-encoder reranking.",
      "Shipped cross-platform clients — web (Next.js 15), desktop (PySide6 / QML), and mobile (React Native) — from one backend.",
      "Implemented enterprise security: data sovereignty, PBKDF2 auth, SSRF protection, and audit logging with CSP / HSTS.",
    ],
  },
  {
    role: "Full-Stack Developer (Freelance)",
    org: "Remote · Global Clients",
    period: "2024 — Present",
    points: [
      "Delivered production web apps, AI integrations, and cross-platform tools for international clients via Freelancer.",
      "Built RESTful services with FastAPI, real-time dashboards, and secure end-to-end auth flows.",
      "Worked fully remote / work-from-home, collaborating async with clients across US, EU, and South Asia timezones.",
    ],
  },
];

const PROJECTS = [
  { name: "OllamoMUI", repo: "github.com/rbkhan007/ollamomui-emulator-desktop-ultimate", link: "ollamomui.vercel.app" },
  { name: "GradBridge", repo: "github.com/rbkhan007/GradBridge", link: "grad-bridge-beta.vercel.app" },
  { name: "ClippingBD Studio", repo: "github.com/rbkhan007/ClippingBD-Studio", link: "clippingbdstudio.vercel.app" },
];

const AVAILABILITY = [
  "Open to remote / work-from-home roles with international & local (Bangladesh) teams",
  "Available for full-time, contract, and part-time engagements",
  "Comfortable with async, cross-timezone collaboration (GMT+6)",
  "Open to local Dhaka-based hybrid roles and relocation within Bangladesh",
];

const RhasanCV = () => {
  return (
    <div
      id="cv-root"
      className="cv-root font-sans"
      style={{ color: "var(--cv-text)" }}
    >
      <style>{`
        .cv-root {
          /* A4 page: 210mm x 297mm */
          --cv-page-w: 210mm;
          --cv-page-h: 297mm;
          --cv-bg: #ffffff;
          --cv-surface: #f1f5f9;
          --cv-surface-border: #e2e8f0;
          --cv-text: #0f172a;
          --cv-text-strong: #020617;
          --cv-text-muted: #334155;
          --cv-text-soft: #475569;
          --cv-heading-border: #cbd5e1;
          --cv-accent: #047857;
          --cv-accent-bg: #ecfdf5;
          --cv-accent-border: #a7f3d0;
          --cv-link: #334155;
          --cv-link-hover: #020617;
          --cv-photo-border: #020617;
          --cv-photo-bg: #e2e8f0;
        }
        [data-theme="dark"] .cv-root {
          --cv-bg: #0b1120;
          --cv-surface: #111c31;
          --cv-surface-border: #1e293b;
          --cv-text: #e2e8f0;
          --cv-text-strong: #f8fafc;
          --cv-text-muted: #cbd5e1;
          --cv-text-soft: #94a3b8;
          --cv-heading-border: #334155;
          --cv-accent: #34d399;
          --cv-accent-bg: rgba(16,185,129,0.12);
          --cv-accent-border: rgba(52,211,153,0.35);
          --cv-link: #cbd5e1;
          --cv-link-hover: #f8fafc;
          --cv-photo-border: #34d399;
          --cv-photo-bg: #1e293b;
        }
        @media print {
          .cv-root {
            --cv-bg: #ffffff !important;
            --cv-surface: #f1f5f9 !important;
            --cv-surface-border: #e2e8f0 !important;
            --cv-text: #0f172a !important;
            --cv-text-strong: #020617 !important;
            --cv-text-muted: #334155 !important;
            --cv-text-soft: #475569 !important;
            --cv-heading-border: #cbd5e1 !important;
            --cv-accent: #047857 !important;
            --cv-accent-bg: #ecfdf5 !important;
            --cv-accent-border: #a7f3d0 !important;
            --cv-link: #334155 !important;
            --cv-link-hover: #020617 !important;
            --cv-photo-border: #020617 !important;
            --cv-photo-bg: #e2e8f0 !important;
          }
        }
        .cv-page {
          width: var(--cv-page-w);
          min-height: var(--cv-page-h);
          margin: 0 auto;
          padding: 14mm 14mm 12mm;
          box-sizing: border-box;
        }
        @media screen {
          .cv-page { box-shadow: 0 10px 40px rgba(0,0,0,0.12); border-radius: 4px; }
        }
        @media print {
          .cv-page { width: auto; min-height: auto; padding: 0; box-shadow: none; border-radius: 0; }
        }
        .cv-justify { text-align: justify; text-justify: inter-word; }
        .cv-justify li, .cv-justify p { text-align: justify; text-justify: inter-word; }
      `}</style>

      <div
        className="cv-page"
        style={{ background: "var(--cv-bg)", color: "var(--cv-text)" }}
      >
        <div>
          {/* Header */}
          <header style={{ borderBottom: "2px solid var(--cv-text-strong)", paddingBottom: 24, marginBottom: 24 }}>
            <div className="flex justify-between items-start gap-6 flex-wrap">
              <div className="min-w-0">
                <h1 className="text-4xl font-extrabold tracking-tight" style={{ color: "var(--cv-text-strong)" }}>
                  Rakibul Hasan
                </h1>
                <p className="text-xl font-bold mt-1" style={{ color: "var(--cv-text-muted)" }}>
                  Rhasan@dev · Full-Stack Developer
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-sm font-medium" style={{ color: "var(--cv-text-soft)" }}>
                  <span className="flex items-center gap-1"><MapPin size={14} /> Dhaka, Bangladesh (GMT+6)</span>
                  <span className="flex items-center gap-1"><Phone size={14} /> +880 1774 471120</span>
                  <span className="flex items-center gap-1"><Mail size={14} /> rbkhan00009@gmail.com</span>
                  <span className="flex items-center gap-1"><Globe size={14} /> ollamomui.vercel.app</span>
                </div>
                <div
                  className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold"
                  style={{ background: "var(--cv-accent-bg)", border: `1px solid var(--cv-accent-border)`, color: "var(--cv-accent)" }}
                >
                  <span className="w-2 h-2 rounded-full inline-block" style={{ background: "var(--cv-accent)" }} />
                  Open to work — Remote / WFH / Local (Bangladesh)
                </div>
              </div>
              <div
                className="w-32 h-32 rounded-lg overflow-hidden flex items-center justify-center shrink-0"
                style={{ border: `2px solid var(--cv-photo-border)`, background: "var(--cv-photo-bg)" }}
              >
                <img src="/Rhasan%40dev.jpg" alt="Rakibul Hasan" width={128} height={128} className="w-full h-full object-cover" />
              </div>
            </div>
          </header>

          {/* Body */}
          <main className="grid grid-cols-3 gap-8">
            {/* Left column */}
            <div className="col-span-2 space-y-7">
              <section>
                <h2 className="text-xs font-black uppercase tracking-widest mb-3 pb-1" style={{ color: "var(--cv-text-strong)", borderBottom: `1px solid var(--cv-heading-border)` }}>
                  Professional Summary
                </h2>
                <p className="text-sm leading-relaxed font-medium cv-justify" style={{ color: "var(--cv-text-muted)" }}>
                  Results-driven Full-Stack Developer specializing in AI / LLM systems, API orchestration, and
                  cross-platform product design. Proven ability to architect production-grade software from
                  database schema to polished UI. Adept at building secure, performant, and scalable applications
                  with modern DevOps practices. Based in Bangladesh (GMT+6) and available for remote,
                  work-from-home, and local roles.
                </p>
              </section>

              <section>
                <h2 className="text-xs font-black uppercase tracking-widest mb-3 pb-1" style={{ color: "var(--cv-text-strong)", borderBottom: `1px solid var(--cv-heading-border)` }}>
                  Experience
                </h2>
                <div className="space-y-5">
                  {EXPERIENCE.map((job) => (
                    <div key={job.role + job.org}>
                      <h3 className="font-bold text-base" style={{ color: "var(--cv-text-strong)" }}>{job.role}</h3>
                      <p className="text-xs font-semibold mb-1" style={{ color: "var(--cv-text-soft)" }}>
                        {job.org} · {job.period}
                      </p>
                      <ul className="text-xs list-disc list-inside space-y-1 font-medium cv-justify" style={{ color: "var(--cv-text-muted)" }}>
                        {job.points.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-xs font-black uppercase tracking-widest mb-3 pb-1" style={{ color: "var(--cv-text-strong)", borderBottom: `1px solid var(--cv-heading-border)` }}>
                  Selected Projects
                </h2>
                <div className="space-y-2">
                  {PROJECTS.map((proj) => (
                    <div
                      key={proj.name}
                      className="flex justify-between items-center px-3 py-2 rounded-md border text-xs"
                      style={{ background: "var(--cv-surface)", borderColor: "var(--cv-surface-border)" }}
                    >
                      <span className="font-bold" style={{ color: "var(--cv-text-strong)" }}>{proj.name}</span>
                      <div className="flex gap-4">
                        <a
                          href={`https://${proj.repo}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold flex items-center gap-1 cv-link"
                        >
                          <Code size={12} /> Code
                        </a>
                        <a
                          href={`https://${proj.link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold flex items-center gap-1 cv-link"
                        >
                          <ExternalLink size={12} /> Live
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-xs font-black uppercase tracking-widest mb-3 pb-1" style={{ color: "var(--cv-text-strong)", borderBottom: `1px solid var(--cv-heading-border)` }}>
                  Education
                </h2>
                <div className="text-sm font-medium cv-justify" style={{ color: "var(--cv-text-muted)" }}>
                  <p className="font-bold" style={{ color: "var(--cv-text-strong)" }}>B.Sc. in Computer Science & Engineering</p>
                  <p>Independent University, Bangladesh (UIU) · 2022 — Present (Continuing)</p>
                </div>
              </section>
            </div>

            {/* Right column */}
            <aside className="space-y-7">
              <section>
                <h2 className="text-xs font-black uppercase tracking-widest mb-3 pb-1" style={{ color: "var(--cv-text-strong)", borderBottom: `1px solid var(--cv-heading-border)` }}>
                  Looking For
                </h2>
                <ul className="text-xs font-medium list-disc list-inside space-y-1.5 cv-justify" style={{ color: "var(--cv-text-muted)" }}>
                  {AVAILABILITY.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-xs font-black uppercase tracking-widest mb-3 pb-1" style={{ color: "var(--cv-text-strong)", borderBottom: `1px solid var(--cv-heading-border)` }}>
                  Core Skills
                </h2>
                <div className="text-xs space-y-3 font-medium cv-justify" style={{ color: "var(--cv-text-muted)" }}>
                  {SKILLS.map((g) => (
                    <div key={g.group}>
                      <strong className="block font-bold mb-0.5" style={{ color: "var(--cv-text-strong)" }}>{g.group}</strong>
                      <span>{g.items.join(", ")}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-xs font-black uppercase tracking-widest mb-3 pb-1" style={{ color: "var(--cv-text-strong)", borderBottom: `1px solid var(--cv-heading-border)` }}>
                  Contact
                </h2>
                <ul className="text-xs font-medium space-y-1.5" style={{ color: "var(--cv-text-muted)" }}>
                  <li className="flex items-center gap-1"><Phone size={12} /> WhatsApp: +880 1774 471120</li>
                  <li className="flex items-center gap-1"><Code size={12} /> GitHub: github.com/rbkhan007</li>
                  <li className="flex items-center gap-1"><Briefcase size={12} /> Freelancer: u/Rakibul0007</li>
                  <li className="flex items-center gap-1"><Globe size={12} /> Portfolio: rhasan-dev-bd-com.vercel.app</li>
                </ul>
              </section>
            </aside>
          </main>

          <footer className="mt-6 pt-4 border-t text-center text-[11px]" style={{ borderColor: "var(--cv-heading-border)", color: "var(--cv-text-soft)" }}>
            Open to full-time, contract, and part-time remote / work-from-home / local (Bangladesh) roles.
            References and detailed case studies available on request.
          </footer>
        </div>
      </div>
    </div>
  );
};

export default RhasanCV;
