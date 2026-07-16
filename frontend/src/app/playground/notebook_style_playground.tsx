"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus, Globe, Zap, FileText, ArrowRight, Play, Presentation,
  Video, BrainCircuit, FileSpreadsheet, BookOpen, MessageSquareText,
  BarChart3, Settings, ChevronDown, Send, Copy, Download, Trash2,
  Sun, Moon, Loader2, Wifi, WifiOff,
} from "lucide-react";
import { useChat, useModels, type ChatMessage } from "./chat-hooks";
import {
  downloadMarkdown, generateFlashcards, generateMindMap, generateQuiz, generateReport,
  type StudioArtifact,
} from "./studio";

/* ------------------------------------------------------------------ */
/* Sources panel                                                       */
/* ------------------------------------------------------------------ */
interface Source {
  id: string;
  label: string;
  type: "web" | "doc" | "note";
}

function SourcesPanel({ sources, addSource }: { sources: Source[]; addSource: (s: Source) => void }) {
  return (
    <div className="w-72 bg-white dark:bg-gray-900 rounded-xl p-4 flex flex-col border border-gray-200 dark:border-gray-800 shrink-0 shadow-sm">
      <h2 className="font-semibold mb-4">Sources</h2>
      <button
        onClick={() =>
          addSource({ id: `src-${Date.now()}`, label: "New source", type: "note" })
        }
        className="w-full py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 mb-4 transition"
      >
        + Add sources
      </button>
      <div className="bg-gray-100 dark:bg-gray-950 rounded-lg p-3 border border-gray-200 dark:border-gray-800">
        <div className="flex gap-2 text-xs">
          <button className="flex items-center gap-1 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Globe className="w-3 h-3" /> Web
          </button>
          <button className="flex items-center gap-1 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Zap className="w-3 h-3" /> Fast Research
          </button>
        </div>
      </div>
      <div className="mt-4 flex-1 overflow-y-auto space-y-2">
        {sources.map((s) => (
          <div
            key={s.id}
            className="text-xs px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center gap-2"
          >
            <FileText className="w-3 h-3 text-gray-400" />
            <span className="truncate">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chat message bubble                                                 */
/* ------------------------------------------------------------------ */
function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed border ${
          isUser
            ? "bg-accent-2/10 border-accent-2/30 text-gray-900 dark:text-gray-100"
            : msg.error
            ? "bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300"
            : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
        }`}
      >
        {msg.pending && !msg.content ? (
          <span className="inline-flex items-center gap-2 text-gray-500">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> thinking…
          </span>
        ) : (
          msg.content
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chat panel                                                          */
/* ------------------------------------------------------------------ */
function ChatPanel({
  messages, streaming, error, onSend, onStop, onReset, model, onModelChange, models, backendOnline,
}: {
  messages: ChatMessage[];
  streaming: boolean;
  error: string | null;
  onSend: (t: string) => void;
  onStop: () => void;
  onReset: () => void;
  model: string;
  onModelChange: (m: string) => void;
  models: { id: string; name: string }[];
  backendOnline: boolean;
}) {
  const [input, setInput] = useState("");

  const submit = () => {
    if (!input.trim() || streaming) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl flex flex-col border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Untitled notebook</h2>
          <p className="text-sm text-gray-500 flex items-center gap-1.5">
            {backendOnline ? (
              <><Wifi className="w-3 h-3 text-green-500" /> gateway online</>
            ) : (
              <><WifiOff className="w-3 h-3 text-red-400" /> gateway offline</>
            )}
            {" · "}{messages.filter((m) => m.role === "user").length} messages
          </p>
        </div>
        <div className="relative">
          <select
            value={model}
            onChange={(e) => onModelChange(e.target.value)}
            className="appearance-none bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-3 pr-8 py-2 text-xs font-medium outline-none cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition max-w-[220px]"
          >
            {models.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 absolute right-2 top-3 pointer-events-none text-gray-500" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-sm text-gray-400 gap-2">
            <BrainCircuit className="w-8 h-8 text-gray-300 dark:text-gray-600" />
            <p>Ask anything to start your notebook.</p>
            {!backendOnline && (
              <p className="text-xs text-red-400 max-w-xs text-center">
                Backend not detected — start it to get real streamed replies.
              </p>
            )}
          </div>
        ) : (
          messages.map((m) => <MessageBubble key={m.id} msg={m} />)
        )}
        {error && !backendOnline && (
          <p className="text-xs text-red-400">{error}</p>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-2 flex items-center gap-2 border border-gray-200 dark:border-gray-700">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Start typing…"
            className="flex-1 bg-transparent outline-none text-sm px-2 placeholder-gray-500 dark:placeholder-gray-600"
          />
          <button
            onClick={onReset}
            title="Clear conversation"
            className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {streaming ? (
            <button
              onClick={onStop}
              className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
              title="Stop"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
            </button>
          ) : (
            <button
              onClick={submit}
              className="p-1.5 bg-accent-2 text-white rounded-full hover:opacity-90 disabled:opacity-50"
              disabled={!input.trim()}
              title="Send"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Studio panel                                                        */
/* ------------------------------------------------------------------ */
type GenerateKind = "mindmap" | "report" | "flashcards" | "quiz";
const studioItems = [
  { icon: Play, label: "Audio Overview", beta: false, gen: null as null | GenerateKind },
  { icon: Presentation, label: "Slide Deck", beta: true, gen: null },
  { icon: Video, label: "Video Overview", beta: false, gen: null },
  { icon: BrainCircuit, label: "Mind Map", beta: false, gen: "mindmap" as const },
  { icon: FileSpreadsheet, label: "Reports", beta: false, gen: "report" as const },
  { icon: BookOpen, label: "Flashcards", beta: false, gen: "flashcards" as const },
  { icon: MessageSquareText, label: "Quiz", beta: false, gen: "quiz" as const },
  { icon: BarChart3, label: "Infographic", beta: true, gen: null },
  { icon: FileText, label: "Data Table", beta: false, gen: null },
];

function StudioPanel({
  artifacts, generate, removeArtifact,
}: {
  artifacts: StudioArtifact[];
  generate: (kind: "mindmap" | "report" | "flashcards" | "quiz") => void;
  removeArtifact: (id: string) => void;
}) {
  return (
    <div className="w-80 bg-white dark:bg-gray-900 rounded-xl p-4 flex flex-col border border-gray-200 dark:border-gray-800 gap-4 shrink-0 shadow-sm">
      <h2 className="font-semibold">Studio</h2>
      <div className="grid grid-cols-3 gap-2">
        {studioItems.map((item) => (
          <button
            key={item.label}
            disabled={!item.gen}
            onClick={() => item.gen && generate(item.gen)}
            title={item.gen ? `Generate ${item.label}` : `${item.label} (coming soon)`}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700 text-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="text-[10px] leading-tight font-medium">{item.label}</span>
            {item.beta && <span className="text-[8px] bg-blue-500 text-white px-1 rounded">BETA</span>}
          </button>
        ))}
      </div>

      <div className="mt-2 flex-1 overflow-y-auto space-y-2">
        {artifacts.length === 0 ? (
          <p className="text-xs text-gray-500 text-center pt-4">Generated studio output appears here.</p>
        ) : (
          artifacts.map((a) => (
            <div
              key={a.id}
              className="text-xs px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium truncate">{a.title}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => navigator.clipboard?.writeText(a.markdown)} title="Copy">
                    <Copy className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                  </button>
                  <button onClick={() => downloadMarkdown(a)} title="Download .md">
                    <Download className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                  </button>
                  <button onClick={() => removeArtifact(a.id)} title="Remove">
                    <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              </div>
              <pre className="mt-1 max-h-28 overflow-hidden text-[10px] text-gray-500 whitespace-pre-wrap">
                {a.markdown.split("\n").slice(0, 4).join("\n")}
              </pre>
            </div>
          ))
        )}
      </div>

      <button className="flex items-center justify-center gap-2 w-full py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium">
        <Plus className="w-4 h-4" /> Add note
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Theme sync helper                                                   */
/* ------------------------------------------------------------------ */
function useAppTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  useEffect(() => {
    const el = document.documentElement;
    const current = (el.getAttribute("data-theme") as "light" | "dark") || "dark";
    setTheme(current);
  }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("ollamomui-theme", next); } catch {}
    setTheme(next);
  };
  return { theme, toggle };
}

/* ------------------------------------------------------------------ */
/* Main workspace                                                      */
/* ------------------------------------------------------------------ */
export default function PlaygroundWorkspace() {
  const { theme, toggle } = useAppTheme();
  const { models, backendOnline, refresh } = useModels();
  const [selectedModel, setSelectedModel] = useState(models[0]?.id ?? "");
  const [sources, setSources] = useState<Source[]>([
    { id: "s1", label: "OllamoMUI docs", type: "doc" },
    { id: "s2", label: "Project notes", type: "note" },
  ]);
  const [artifacts, setArtifacts] = useState<StudioArtifact[]>([]);

  const { messages, streaming, error, send, stop, reset } = useChat({
    model: selectedModel,
    onUserMessage: () => {},
  });

  useEffect(() => { refresh(); }, [refresh]);

  const modelList = useMemo(() => models.map((m) => ({ id: m.id, name: m.name })), [models]);

  const addSource = (s: Source) => setSources((prev) => [...prev, s]);

  const generate = (kind: "mindmap" | "report" | "flashcards" | "quiz") => {
    const fn = { mindmap: generateMindMap, report: generateReport, flashcards: generateFlashcards, quiz: generateQuiz }[kind];
    setArtifacts((prev) => [fn(messages), ...prev]);
  };

  const removeArtifact = (id: string) => setArtifacts((prev) => prev.filter((a) => a.id !== id));

  return (
    <div className={`${theme === "dark" ? "dark" : ""} h-[calc(100vh-120px)]`}>
      <div className="h-full w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300 p-2">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs text-gray-500">Notebook-style AI workspace</span>
          <button
            onClick={toggle}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <main className="flex h-[calc(100%-36px)] w-full gap-2">
          <SourcesPanel sources={sources} addSource={addSource} />
          <ChatPanel
            messages={messages}
            streaming={streaming}
            error={error}
            onSend={send}
            onStop={stop}
            onReset={reset}
            model={selectedModel}
            onModelChange={setSelectedModel}
            models={modelList}
            backendOnline={backendOnline}
          />
          <StudioPanel artifacts={artifacts} generate={generate} removeArtifact={removeArtifact} />
        </main>
      </div>
    </div>
  );
}
