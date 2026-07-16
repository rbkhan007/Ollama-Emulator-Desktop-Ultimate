"use client";

import {
  Play, Presentation, Video, BrainCircuit, FileSpreadsheet, BookOpen,
  MessageSquareText, BarChart3, Plus, Copy, Download, Trash2, Pencil, Check, X, StickyNote,
} from "lucide-react";
import { useState } from "react";
import { GlassCard, IconButton, IconChip, Pill } from "./playground-ui";
import { downloadMarkdown, type StudioArtifact, type GenerateKind } from "@/app/playground/studio";

export type { GenerateKind };

const STUDIO_ITEMS: { icon: typeof Play; label: string; beta: boolean; gen: GenerateKind | null; color: string }[] = [
  { icon: Play, label: "Audio Overview", beta: false, gen: null, color: "var(--accent)" },
  { icon: Presentation, label: "Slide Deck", beta: true, gen: null, color: "var(--accent-2)" },
  { icon: Video, label: "Video Overview", beta: false, gen: null, color: "var(--accent-3)" },
  { icon: BrainCircuit, label: "Mind Map", beta: false, gen: "mindmap", color: "var(--accent)" },
  { icon: FileSpreadsheet, label: "Reports", beta: false, gen: "report", color: "var(--green)" },
  { icon: BookOpen, label: "Flashcards", beta: false, gen: "flashcards", color: "var(--accent-2)" },
  { icon: MessageSquareText, label: "Quiz", beta: false, gen: "quiz", color: "var(--accent-3)" },
  { icon: BarChart3, label: "Infographic", beta: true, gen: null, color: "var(--accent-4)" },
  { icon: FileSpreadsheet, label: "Data Table", beta: false, gen: null, color: "var(--text-muted)" },
];

const ARTIFACT_ICON: Record<StudioArtifact["kind"], typeof Play> = {
  mindmap: BrainCircuit,
  quiz: MessageSquareText,
  flashcards: BookOpen,
  report: FileSpreadsheet,
  infographic: BarChart3,
  slides: Presentation,
  datatable: FileSpreadsheet,
};

export function StudioPanel({
  artifacts,
  onGenerate,
  onUpdate,
  onDelete,
  onAddNote,
}: {
  artifacts: StudioArtifact[];
  onGenerate: (kind: GenerateKind) => void;
  onUpdate: (a: StudioArtifact) => void;
  onDelete: (id: string) => void;
  onAddNote: () => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const saveEdit = () => {
    const v = editTitle.trim();
    if (!v || !editingId) return;
    const target = artifacts.find((a) => a.id === editingId);
    if (target) onUpdate({ ...target, title: v });
    setEditingId(null);
    setEditTitle("");
  };

  return (
    <GlassCard className="w-80 shrink-0 flex flex-col p-4">
      <header className="flex items-center gap-2 mb-4">
        <IconChip color="var(--accent-3)"><SparklesIcon /></IconChip>
        <h2 className="font-semibold text-[15px] flex-1" style={{ color: "var(--text)" }}>Studio</h2>
        <Pill color="var(--text-muted)">{artifacts.length}</Pill>
      </header>

      <div className="grid grid-cols-3 gap-2">
        {STUDIO_ITEMS.map((item) => (
          <button
            key={item.label}
            disabled={!item.gen}
            onClick={() => item.gen && onGenerate(item.gen)}
            title={item.gen ? `Generate ${item.label}` : `${item.label} — coming soon`}
            className="pg-studio-btn relative"
          >
            <item.icon className="w-5 h-5" style={{ color: item.color }} />
            <span>{item.label}</span>
            {item.beta && (
              <span className="absolute -top-1.5 -right-1.5 text-[8px] font-bold text-white px-1 rounded bg-blue-500">
                BETA
              </span>
            )}
            {!item.gen && (
              <span className="absolute -bottom-1.5 text-[8px] font-semibold px-1 rounded" style={{ color: "var(--text-muted)", background: "var(--bg-2)" }}>
                SOON
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="pg-scroll mt-3 flex-1 overflow-y-auto space-y-2 pr-1">
        {artifacts.length === 0 ? (
          <div className="text-center py-8" style={{ color: "var(--text-muted)" }}>
            <StickyNote className="w-6 h-6 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Pick a generator above to create study material.</p>
          </div>
        ) : (
          artifacts.map((a) => {
            const Icon = ARTIFACT_ICON[a.kind];
            const editing = editingId === a.id;
            return (
              <div key={a.id} className="rounded-xl px-3 py-2.5" style={{ background: "var(--bg-2)", border: "1px solid var(--glass-border)" }}>
                <div className="flex items-center gap-2">
                  <IconChip color="var(--accent-3)" size={14}><Icon className="w-3.5 h-3.5" /></IconChip>
                  {editing ? (
                    <input
                      autoFocus
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                      className="flex-1 bg-transparent outline-none text-xs font-medium"
                      style={{ color: "var(--text)" }}
                    />
                  ) : (
                    <span className="truncate flex-1 text-xs font-semibold" style={{ color: "var(--text)" }}>{a.title}</span>
                  )}
                  <div className="flex items-center gap-0.5">
                    {editing ? (
                      <>
                        <IconButton onClick={saveEdit} title="Save"><Check className="w-3.5 h-3.5" /></IconButton>
                        <IconButton onClick={() => setEditingId(null)} title="Cancel"><X className="w-3.5 h-3.5" /></IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton onClick={() => navigator.clipboard?.writeText(a.markdown)} title="Copy Markdown"><Copy className="w-3.5 h-3.5" /></IconButton>
                        <IconButton onClick={() => downloadMarkdown(a)} title="Download .md"><Download className="w-3.5 h-3.5" /></IconButton>
                        <IconButton onClick={() => { setEditingId(a.id); setEditTitle(a.title); }} title="Rename"><Pencil className="w-3.5 h-3.5" /></IconButton>
                        <IconButton onClick={() => onDelete(a.id)} title="Delete" variant="danger"><Trash2 className="w-3.5 h-3.5" /></IconButton>
                      </>
                    )}
                  </div>
                </div>
                <pre className="mt-1.5 max-h-24 overflow-hidden text-[10px] whitespace-pre-wrap leading-snug" style={{ color: "var(--text-muted)" }}>
                  {a.markdown.split("\n").slice(0, 5).join("\n")}
                </pre>
              </div>
            );
          })
        )}
      </div>

      <button
        onClick={onAddNote}
        className="pg-studio-btn mt-3 !flex-row !gap-2 !text-xs !font-semibold"
        style={{ flexDirection: "row" }}
      >
        <Plus className="w-4 h-4" /> Add note
      </button>
    </GlassCard>
  );
}

function SparklesIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3z" />
      <path d="M19 14l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2z" />
    </svg>
  );
}
