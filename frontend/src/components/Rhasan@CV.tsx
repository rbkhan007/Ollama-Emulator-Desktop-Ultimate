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
    <div className="bg-white text-slate-900 p-8 font-sans print:p-0" style={{ color: "#0f172a" }}>
      <div className="max-w-[794px] mx-auto">
        {/* Header */}
        <header className="border-b-2 border-slate-900 pb-6 mb-6">
          <div className="flex justify-between items-start gap-6 flex-wrap">
            <div className="min-w-0">
              <h1 className="text-4xl font-extrabold text-slate-950 tracking-tight">Rakibul Hasan</h1>
              <p className="text-xl text-slate-800 font-bold mt-1">Rhasan@dev · Full-Stack Developer</p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-sm text-slate-700 font-medium">
                <span className="flex items-center gap-1"><MapPin size={14} /> Dhaka, Bangladesh (GMT+6)</span>
                <span className="flex items-center gap-1"><Phone size={14} /> +880 1774 471120</span>
                <span className="flex items-center gap-1"><Mail size={14} /> rbkhan00009@gmail.com</span>
                <span className="flex items-center gap-1"><Globe size={14} /> ollamomui.vercel.app</span>
              </div>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-300 px-3 py-1 text-xs font-bold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Open to work — Remote / WFH / Local (Bangladesh)
              </div>
            </div>
            <div className="w-32 h-32 rounded-lg border-2 border-slate-900 overflow-hidden flex items-center justify-center bg-slate-200 shrink-0">
              <img src="/Rhasan%40dev.jpg" alt="Rakibul Hasan" width={128} height={128} className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Body */}
        <main className="grid grid-cols-3 gap-8">
          {/* Left column */}
          <div className="col-span-2 space-y-7">
            <section>
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-3 border-b border-slate-300 pb-1">
                Professional Summary
              </h2>
              <p className="text-sm leading-relaxed text-slate-800 font-medium">
                Results-driven Full-Stack Developer specializing in AI / LLM systems, API orchestration, and
                cross-platform product design. Proven ability to architect production-grade software from
                database schema to polished UI. Adept at building secure, performant, and scalable applications
                with modern DevOps practices. Based in Bangladesh (GMT+6) and available for remote,
                work-from-home, and local roles.
              </p>
            </section>

            <section>
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-3 border-b border-slate-300 pb-1">
                Experience
              </h2>
              <div className="space-y-5">
                {EXPERIENCE.map((job) => (
                  <div key={job.role + job.org}>
                    <h3 className="font-bold text-slate-950 text-base">{job.role}</h3>
                    <p className="text-xs font-semibold text-slate-600 mb-1">
                      {job.org} · {job.period}
                    </p>
                    <ul className="text-xs text-slate-800 list-disc list-inside space-y-1 font-medium">
                      {job.points.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-3 border-b border-slate-300 pb-1">
                Selected Projects
              </h2>
              <div className="space-y-2">
                {PROJECTS.map((proj) => (
                  <div
                    key={proj.name}
                    className="flex justify-between items-center bg-slate-100 px-3 py-2 rounded-md border border-slate-200 text-xs"
                  >
                    <span className="font-bold text-slate-950">{proj.name}</span>
                    <div className="flex gap-4">
                      <a
                        href={`https://${proj.repo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-700 font-semibold hover:text-slate-950 flex items-center gap-1"
                      >
                        <Code size={12} /> Code
                      </a>
                      <a
                        href={`https://${proj.link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-700 font-semibold hover:text-slate-950 flex items-center gap-1"
                      >
                        <ExternalLink size={12} /> Live
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-3 border-b border-slate-300 pb-1">
                Education
              </h2>
              <div className="text-sm text-slate-800 font-medium">
                <p className="font-bold text-slate-950">B.Sc. in Computer Science & Engineering</p>
                <p>Independent University, Bangladesh (UIU) · 2022 — Present (Continuing)</p>
              </div>
            </section>
          </div>

          {/* Right column */}
          <aside className="space-y-7">
            <section>
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-3 border-b border-slate-300 pb-1">
                Looking For
              </h2>
              <ul className="text-xs text-slate-800 font-medium list-disc list-inside space-y-1.5">
                {AVAILABILITY.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-3 border-b border-slate-300 pb-1">
                Core Skills
              </h2>
              <div className="text-xs space-y-3 text-slate-800 font-medium">
                {SKILLS.map((g) => (
                  <div key={g.group}>
                    <strong className="block text-slate-950 font-bold mb-0.5">{g.group}</strong>
                    {g.items.join(", ")}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-3 border-b border-slate-300 pb-1">
                Contact
              </h2>
              <ul className="text-xs text-slate-800 font-medium space-y-1.5">
                <li className="flex items-center gap-1"><Phone size={12} /> WhatsApp: +880 1774 471120</li>
                <li className="flex items-center gap-1"><Code size={12} /> GitHub: github.com/rbkhan007</li>
                <li className="flex items-center gap-1"><Briefcase size={12} /> Freelancer: u/Rakibul0007</li>
                <li className="flex items-center gap-1"><Globe size={12} /> Portfolio: rhasan-dev-bd-com.vercel.app</li>
              </ul>
            </section>
          </aside>
        </main>

        <footer className="mt-6 pt-4 border-t border-slate-300 text-center text-[11px] text-slate-600">
          Open to full-time, contract, and part-time remote / work-from-home / local (Bangladesh) roles.
          References and detailed case studies available on request.
        </footer>
      </div>
    </div>
  );
};

export default RhasanCV;
