"use client";

import { useState } from "react";
import {
  Plus, Globe, Zap, FileText, Trash2, Pencil, Check, X,
  Database, Sparkles,
} from "lucide-react";
import { GlassCard, IconButton, IconChip, Pill } from "./playground-ui";

export interface Source {
  id: string;
  label: string;
  type: "web" | "doc" | "note";
}

const TYPE_ICON: Record<Source["type"], typeof Globe> = {
  web: Globe,
  doc: FileText,
  note: FileText,
};

export function SourcesPanel({
  sources,
  onCreate,
  onUpdate,
  onDelete,
}: {
  sources: Source[];
  onCreate: (s: Source) => void;
  onUpdate: (s: Source) => void;
  onDelete: (id: string) => void;
}) {
  const [label, setLabel] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");

  const add = () => {
    const v = label.trim();
    if (!v) return;
    onCreate({ id: `src-${Date.now()}`, label: v, type: "note" });
    setLabel("");
  };

  const saveEdit = () => {
    const v = editLabel.trim();
    if (!v || !editingId) return;
    const target = sources.find((s) => s.id === editingId);
    if (target) onUpdate({ ...target, label: v });
    setEditingId(null);
    setEditLabel("");
  };

  return (
    <GlassCard className="w-72 shrink-0 flex flex-col p-4">
      <header className="flex items-center gap-2 mb-4">
        <IconChip color="var(--accent)"><Database className="w-4 h-4" /></IconChip>
        <h2 className="font-semibold text-[15px] flex-1" style={{ color: "var(--text)" }}>Sources</h2>
        <Pill color="var(--text-muted)">{sources.length}</Pill>
      </header>

      <div className="flex gap-2 mb-3">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add a source…"
          className="pg-input flex-1 px-3 py-2 rounded-xl text-sm outline-none bg-[var(--bg-2)] border border-[var(--glass-border)]"
          style={{ color: "var(--text)" }}
        />
        <IconButton onClick={add} title="Create source" variant="accent" disabled={!label.trim()}>
          <Plus className="w-4 h-4" />
        </IconButton>
      </div>

      <div
        className="rounded-xl p-3 mb-3 flex gap-2"
        style={{ background: "color-mix(in srgb, var(--accent) 7%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 18%, transparent)" }}
      >
        <button className="pg-studio-btn !flex-row !gap-1.5 !py-1.5 !px-2 !flex-1 !text-[11px]" style={{ flexDirection: "row" }}>
          <Globe className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} /> Web
        </button>
        <button className="pg-studio-btn !flex-row !gap-1.5 !py-1.5 !px-2 !flex-1 !text-[11px]" style={{ flexDirection: "row" }}>
          <Zap className="w-3.5 h-3.5" style={{ color: "var(--accent-2)" }} /> Fast Research
        </button>
      </div>

      <div className="pg-scroll mt-1 flex-1 overflow-y-auto space-y-2 pr-1">
        {sources.length === 0 && (
          <div className="text-center py-8" style={{ color: "var(--text-muted)" }}>
            <Sparkles className="w-6 h-6 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No sources yet. Add your first one above.</p>
          </div>
        )}
        {sources.map((s) => {
          const Icon = TYPE_ICON[s.type];
          const editing = editingId === s.id;
          return (
            <div
              key={s.id}
              className="group flex items-center gap-2 rounded-xl px-3 py-2 transition-colors"
              style={{ background: "var(--bg-2)", border: "1px solid var(--glass-border)" }}
            >
              <IconChip color="var(--accent)" size={14}><Icon className="w-3.5 h-3.5" /></IconChip>
              {editing ? (
                <input
                  autoFocus
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                  className="flex-1 bg-transparent outline-none text-xs"
                  style={{ color: "var(--text)" }}
                />
              ) : (
                <span className="truncate flex-1 text-xs font-medium" style={{ color: "var(--text)" }}>{s.label}</span>
              )}
              {editing ? (
                <div className="flex items-center gap-1">
                  <IconButton onClick={saveEdit} title="Save"><Check className="w-3.5 h-3.5" /></IconButton>
                  <IconButton onClick={() => setEditingId(null)} title="Cancel"><X className="w-3.5 h-3.5" /></IconButton>
                </div>
              ) : (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <IconButton onClick={() => { setEditingId(s.id); setEditLabel(s.label); }} title="Edit"><Pencil className="w-3.5 h-3.5" /></IconButton>
                  <IconButton onClick={() => onDelete(s.id)} title="Delete" variant="danger"><Trash2 className="w-3.5 h-3.5" /></IconButton>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
