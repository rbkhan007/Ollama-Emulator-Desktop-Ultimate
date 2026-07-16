import type { ChatMessage } from "./chat-hooks";

export type GenerateKind = "mindmap" | "report" | "flashcards" | "quiz";

export interface StudioArtifact {
  id: string;
  kind: "mindmap" | "quiz" | "flashcards" | "report" | "infographic" | "slides" | "datatable";
  title: string;
  markdown: string;
  createdAt: number;
}

function stripThinking(text: string): string {
  return text
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/^\s*\[system\][\s\S]*?\[\/system\]\s*/gi, "")
    .trim();
}

function lastAssistant(messages: ChatMessage[]): string {
  const m = [...messages].reverse().find((x) => x.role === "assistant" && !x.error && x.content);
  return m ? stripThinking(m.content) : "";
}

function sourceText(messages: ChatMessage[]): string {
  const parts = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join("\n\n");
  return (parts || "Untitled notebook").slice(0, 4000);
}

export function generateMindMap(messages: ChatMessage[]): StudioArtifact {
  const src = lastAssistant(messages) || sourceText(messages);
  const lines = src
    .split(/\n+/)
    .map((l) => l.replace(/^#+\s*/, "").replace(/[*_`]/g, "").trim())
    .filter(Boolean)
    .slice(0, 12);
  const subtopics = lines
    .map((l, i) => `  - ${l.slice(0, 70)}\n    - detail ${i + 1}`)
    .join("\n");
  const markdown = `# 🧠 Mind Map\n\n- **Central Topic**\n${subtopics || "  - (add a prompt to grow this map)"}\n`;
  return { id: `mm-${Date.now()}`, kind: "mindmap", title: "Mind Map", markdown, createdAt: Date.now() };
}

export function generateQuiz(messages: ChatMessage[]): StudioArtifact {
  const src = lastAssistant(messages) || sourceText(messages);
  const sentences = src
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.replace(/[*_`#]/g, "").trim())
    .filter((s) => s.length > 30)
    .slice(0, 5);
  const qs = sentences.length
    ? sentences
        .map(
          (s, i) =>
            `**Q${i + 1}.** ${s.slice(0, 110)}?\n- A) ___\n- B) ___\n- C) ___\n- D) ___\n_Answer: ___`
        )
        .join("\n\n")
    : "**Q1.** What did we discuss in this notebook? (ask the model first)";
  const markdown = `# 📝 Quiz\n\n${qs}\n`;
  return { id: `qz-${Date.now()}`, kind: "quiz", title: "Quiz", markdown, createdAt: Date.now() };
}

export function generateFlashcards(messages: ChatMessage[]): StudioArtifact {
  const src = lastAssistant(messages) || sourceText(messages);
  const chunks = src
    .split(/\n+/)
    .map((l) => l.replace(/^#+\s*/, "").replace(/[*_`]/g, "").trim())
    .filter((l) => l.length > 20)
    .slice(0, 6);
  const cards = chunks.length
    ? chunks
        .map((c, i) => `**Card ${i + 1}**\n- **Front:** ${c.slice(0, 90)}\n- **Back:** ${c.slice(0, 200)}`)
        .join("\n\n")
    : "**Card 1**\n- **Front:** Key concept\n- **Back:** Add content to generate cards";
  const markdown = `# 🃏 Flashcards\n\n${cards}\n`;
  return { id: `fc-${Date.now()}`, kind: "flashcards", title: "Flashcards", markdown, createdAt: Date.now() };
}

export function generateReport(messages: ChatMessage[]): StudioArtifact {
  const convo = messages
    .map((m) => `**${m.role === "user" ? "👤 User" : "🤖 Assistant"}:** ${m.content.replace(/[*_`#]/g, "").slice(0, 1400)}`)
    .join("\n\n");
  const markdown = `# 📊 Report\n\n> Generated from notebook · ${new Date().toLocaleString()}\n\n${
    convo || "No conversation yet."
  }\n`;
  return { id: `rp-${Date.now()}`, kind: "report", title: "Report", markdown, createdAt: Date.now() };
}

export function createNote(): StudioArtifact {
  return {
    id: `note-${Date.now()}`,
    kind: "datatable",
    title: "Untitled note",
    markdown: "# 📝 Note\n\nStart writing…\n",
    createdAt: Date.now(),
  };
}

export function downloadMarkdown(artifact: StudioArtifact) {
  const blob = new Blob([artifact.markdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${artifact.title.replace(/\s+/g, "-").toLowerCase()}.md`;
  a.click();
  URL.revokeObjectURL(url);
}
