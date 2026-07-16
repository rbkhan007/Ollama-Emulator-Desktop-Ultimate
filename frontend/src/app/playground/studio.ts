import type { ChatMessage } from "./chat-hooks";

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
  const lines = src.split(/\n+/).map((l) => l.trim()).filter(Boolean).slice(0, 14);
  const nodes = lines.map((l) => `- ${l.replace(/^#+\s*/, "").slice(0, 80)}`).join("\n");
  const markdown = `# Mind Map\n\n- Topic\n${nodes || "- (add a prompt to grow this map)"}\n`;
  return { id: `mm-${Date.now()}`, kind: "mindmap", title: "Mind Map", markdown, createdAt: Date.now() };
}

export function generateQuiz(messages: ChatMessage[]): StudioArtifact {
  const src = lastAssistant(messages) || sourceText(messages);
  const sentences = src.split(/(?<=[.!?])\s+/).filter((s) => s.length > 30).slice(0, 4);
  const qs = sentences
    .map((s, i) => `**Q${i + 1}.** ${s.slice(0, 120)}?\n   - A) ___\n   - B) ___\n   - C) ___\n   - D) ___`)
    .join("\n\n");
  const markdown = `# Quiz\n\n${qs || "**Q1.** What did we discuss? (ask the model first)"}\n`;
  return { id: `qz-${Date.now()}`, kind: "quiz", title: "Quiz", markdown, createdAt: Date.now() };
}

export function generateFlashcards(messages: ChatMessage[]): StudioArtifact {
  const src = lastAssistant(messages) || sourceText(messages);
  const chunks = src.split(/\n+/).map((l) => l.trim()).filter((l) => l.length > 20).slice(0, 6);
  const cards = chunks
    .map((c, i) => `**Card ${i + 1}**\n- Front: ${c.slice(0, 90)}\n- Back: ${c.slice(0, 180)}`)
    .join("\n\n");
  const markdown = `# Flashcards\n\n${cards || "Add content to generate cards"}\n`;
  return { id: `fc-${Date.now()}`, kind: "flashcards", title: "Flashcards", markdown, createdAt: Date.now() };
}

export function generateReport(messages: ChatMessage[]): StudioArtifact {
  const convo = messages
    .map((m) => `**${m.role === "user" ? "User" : "Assistant"}:** ${m.content.slice(0, 1200)}`)
    .join("\n\n");
  const markdown = `# Report\n\n_Generated from notebook · ${new Date().toLocaleString()}_\n\n${convo || "No conversation yet."}\n`;
  return { id: `rp-${Date.now()}`, kind: "report", title: "Report", markdown, createdAt: Date.now() };
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
