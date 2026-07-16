"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/lib/ThemeContext";
import { useDb } from "@/lib/DbContext";
import { REPO_URL } from "@/lib/config";
import styles from "./UniversalNav.module.css";
import { House, Code2, Library, BrainCircuit, Activity, FileText, GitBranch, BookOpen, Shield, DollarSign, Download, UserCheck, Info, Settings, ShieldCheck, Sun, Moon, Star, ChevronDown, Briefcase, Server, Coins, Database, Zap, Workflow, TrendingUp, Layers, Atom } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
}

const PRIMARY_LINKS: NavLink[] = [
  { label: "Home", href: "/", icon: House },
  { label: "Playground", href: "/playground", icon: Code2 },
  { label: "Knowledge", href: "/rag", icon: Library },
  { label: "Memory", href: "/memory", icon: BrainCircuit },
  { label: "Status", href: "/status", icon: Activity },
  { label: "Case Study", href: "/case-study", icon: FileText },
];

const MORE_LINKS: NavLink[] = [
  { label: "Architecture", href: "/architecture", icon: GitBranch },
  { label: "API Docs", href: "/api-docs", icon: BookOpen },
  { label: "Security", href: "/security", icon: Shield },
  { label: "Pricing", href: "/pricing", icon: DollarSign },
  { label: "Download", href: "/download", icon: Download },
  { label: "Resume", href: "/resume", icon: UserCheck },
  { label: "About", href: "/about", icon: Info },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Admin", href: "/admin", icon: ShieldCheck },
];

const BLOG_LINKS: NavLink[] = [
  { label: "Hire Next.js Dev (BD)", href: "/hire-nextjs-developer-bangladesh", icon: Briefcase },
  { label: "FastAPI Dev Dhaka", href: "/custom-fastapi-development-dhaka", icon: Server },
  { label: "AI App Cost in BD", href: "/cost-to-build-ai-applications-bangladesh", icon: Coins },
  { label: "Prisma + pgvector", href: "/configure-prisma-orm-with-pgvector", icon: Database },
  { label: "Vercel Edge Cache", href: "/optimizing-vercel-edge-cache-nextjs-15", icon: Zap },
  { label: "Monorepo CI", href: "/multi-app-monorepo-github-actions", icon: Workflow },
  { label: "SE Trends BD 2026", href: "/software-engineering-trends-bangladesh-2026", icon: TrendingUp },
  { label: "Scalable Architecture", href: "/best-practices-scalable-system-architecture", icon: Layers },
  { label: "React 19 Enterprise", href: "/react-19-features-enterprise-systems", icon: Atom },
];

const ALL_LINKS = [...PRIMARY_LINKS, ...MORE_LINKS];

export default memo(function UniversalNav() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const { databaseConnected } = useDb();
  const [isOpen, setIsOpen] = useState(false);
  const [ddOpen, setDdOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const ddRef = useRef<HTMLDivElement>(null);
  const blogRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  const prevOverflowRef = useRef("");
  useEffect(() => {
    prevOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = prevOverflowRef.current; };
  }, [isOpen]);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (ddRef.current && !ddRef.current.contains(e.target as Node)) {
      setDdOpen(false);
    }
    if (blogRef.current && !blogRef.current.contains(e.target as Node)) {
      setBlogOpen(false);
    }
  }, []);

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") { setDdOpen(false); setBlogOpen(false); }
  }, []);

  useEffect(() => {
    if (ddOpen || blogOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [ddOpen, blogOpen, handleClickOutside, handleEscape]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.brand} onClick={() => { setIsOpen(false); setDdOpen(false); setBlogOpen(false); }}>
          <div className={styles.brandLogo}>
            <svg width="28" height="28" viewBox="0 0 64 64" fill="none" role="img" aria-label="OllamoMUI logo" style={{ display: 'block' }}>
              <defs>
                <linearGradient id="brandCyan" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#00f0ff" />
                  <stop offset="100%" stopColor="#00bcd4" />
                </linearGradient>
                <linearGradient id="brandPurple" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
                <linearGradient id="boltGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#00f0ff" />
                  <stop offset="55%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g transform="translate(32, 32)">
                <polygon points="0,-24 21,-12 21,12 0,24 -21,12 -21,-12" fill="none" stroke="url(#brandCyan)" strokeWidth="2" filter="url(#glow)" />
                <polygon points="0,-18 16,-9 16,9 0,18 -16,9 -16,-9" fill="none" stroke="url(#brandPurple)" strokeWidth="1" opacity="0.6" />
                <path d="M -6,-10 L 6,-10 L 3,-2 L 8,-2 L -6,12 L -3,3 L -9,3 Z" fill="url(#boltGrad)" filter="url(#glow)" />
                <circle cx="0" cy="-24" r="2" fill="url(#brandCyan)" filter="url(#glow)" />
                <circle cx="21" cy="-12" r="2" fill="url(#brandPurple)" filter="url(#glow)" />
                <circle cx="21" cy="12" r="2" fill="url(#brandCyan)" filter="url(#glow)" />
                <circle cx="0" cy="24" r="2" fill="url(#brandPurple)" filter="url(#glow)" />
                <circle cx="-21" cy="12" r="2" fill="url(#brandCyan)" filter="url(#glow)" />
                <circle cx="-21" cy="-12" r="2" fill="url(#brandPurple)" filter="url(#glow)" />
                <circle cx="0" cy="0" r="3" fill="url(#brandCyan)" opacity="0.8" filter="url(#glow)" />
              </g>
            </svg>
          </div>
          <span className={styles.brandText}>OllamoMUI</span>
          <span className={styles.badge}>v1.0.4</span>
        </Link>

        {/* Desktop: inline primary links */}
        <div className={styles.desktopNav}>
          {PRIMARY_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${isActive(link.href) ? styles.navLinkActive : ""}`}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}

          {/* More dropdown */}
          <div className={styles.dropdownWrap} ref={ddRef}>
            <button
              className={styles.dropdownBtn}
              onClick={() => setDdOpen((o) => !o)}
              aria-expanded={ddOpen}
              aria-haspopup="true"
            >
              More
              <ChevronDown size={14} style={{ transition: "transform 0.2s", transform: ddOpen ? "rotate(180deg)" : "" }} />
            </button>
            {ddOpen && (
              <div className={styles.dropdownPanel}>
                {MORE_LINKS.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`${styles.ddLink} ${isActive(link.href) ? styles.ddLinkActive : ""}`}
                      onClick={() => setDdOpen(false)}
                    >
                      <Icon size={16} />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Blog / SEO content dropdown */}
          <div className={styles.dropdownWrap} ref={blogRef}>
            <button
              className={styles.dropdownBtn}
              onClick={() => setBlogOpen((o) => !o)}
              aria-expanded={blogOpen}
              aria-haspopup="true"
            >
              Blog
              <ChevronDown size={14} style={{ transition: "transform 0.2s", transform: blogOpen ? "rotate(180deg)" : "" }} />
            </button>
            {blogOpen && (
              <div className={styles.dropdownPanel}>
                {BLOG_LINKS.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`${styles.ddLink} ${isActive(link.href) ? styles.ddLinkActive : ""}`}
                      onClick={() => setBlogOpen(false)}
                    >
                      <Icon size={16} />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Mobile: burger menu */}
        <div
          className={`${styles.menu} ${isOpen ? styles.menuOpen : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {ALL_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.link} ${isActive(link.href) ? styles.linkActive : ""}`}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
          <div className={styles.menuSectionLabel}>Blog</div>
          {BLOG_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.link} ${isActive(link.href) ? styles.linkActive : ""}`}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
          <div className={styles.menuActions}>
            <button
              onClick={toggle}
              className={styles.menuActionBtn}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              <span>{theme === "dark" ? "Light" : "Dark"}</span>
            </button>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.menuActionBtn}
            >
              <Star size={16} /> Star
            </a>
            <span className={`${styles.dbStatus} ${databaseConnected ? styles.dbConnected : styles.dbDisconnected}`}>
              <span className={styles.dbDot} />
              <span>{databaseConnected ? "DB" : "DB Offline"}</span>
            </span>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            onClick={toggle}
            className={styles.desktopBtn}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.desktopBtn}
          >
            <Star size={16} /> Star
          </a>
          <span
            className={`${styles.dbStatus} ${databaseConnected ? styles.dbConnected : styles.dbDisconnected}`}
            title={databaseConnected ? "Database connected" : "Database disconnected"}
          >
            <span className={styles.dbDot} />
          </span>
          <button
            className={`${styles.burger} ${isOpen ? styles.burgerOpen : ""}`}
            onClick={() => setIsOpen((o) => !o)}
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </nav>
  );
});
