import { Home, MessageSquare, Grid, Settings, BookOpen, Brain, Upload, Search, FileText, BarChart3, Shield, Info, Trash2, Plus, Save, Send, RefreshCw, Download } from "lucide-react";

export function LogoSvg({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent-2)" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill="url(#logoGrad)" opacity="0.15" />
      <rect x="1" y="1" width="46" height="46" rx="13" stroke="url(#logoGrad)" strokeWidth="1" opacity="0.4" />
      <path d="M14 18C14 15.7909 15.7909 14 18 14H30C32.2091 14 34 15.7909 34 18V24C34 26.2091 32.2091 28 30 28H26L22 32V28H18C15.7909 28 14 26.2091 14 24V18Z" fill="url(#logoGrad)" />
      <circle cx="20" cy="21" r="2" fill="white" opacity="0.9" />
      <circle cx="28" cy="21" r="2" fill="white" opacity="0.9" />
      <path d="M20 25C20 25 22 27 24 27C26 27 28 25 28 25" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  home: Home,
  chat: MessageSquare,
  models: Grid,
  settings: Settings,
  book: BookOpen,
  brain: Brain,
  upload: Upload,
  search: Search,
  doc: FileText,
  usage: BarChart3,
  shield: Shield,
  info: Info,
  trash: Trash2,
  plus: Plus,
  save: Save,
  send: Send,
  refresh: RefreshCw,
  export: Download,
};

export function PageIcon({ type, color, size = 22 }: { type: string; color: string; size?: number }) {
  const Icon = iconMap[type];
  if (!Icon) return null;
  return <Icon size={size} color={color} strokeWidth={1.8} />;
}
