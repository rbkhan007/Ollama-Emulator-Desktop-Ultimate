import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_URL = "ollama-emu-base";
const KEY_TOKEN = "ollama-emu-token";

export async function getBase(): Promise<string> {
  const s = await AsyncStorage.getItem(KEY_URL);
  return s ? s.replace(/\/+$/, "") : "";
}

export async function setBase(u: string): Promise<void> {
  await AsyncStorage.setItem(KEY_URL, u.replace(/\/+$/, ""));
}

export async function getToken(): Promise<string> {
  return (await AsyncStorage.getItem(KEY_TOKEN)) || "";
}

export async function setToken(t: string): Promise<void> {
  if (t) await AsyncStorage.setItem(KEY_TOKEN, t);
  else await AsyncStorage.removeItem(KEY_TOKEN);
}

async function req(
  path: string,
  opts: RequestInit = {}
): Promise<Response> {
  const base = await getBase();
  const token = await getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${base}${path}`, { ...opts, headers });
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const j = await res.json();
      msg = j.detail || j.error || j.message || msg;
    } catch {
      /* ignore */
    }
    throw new Error(`${res.status}: ${msg}`);
  }
  return res;
}

export async function apiJson<T = any>(path: string, opts?: RequestInit): Promise<T> {
  const r = await req(path, opts);
  return r.json();
}

export const getStatus = () => apiJson("/api/status");
export const getProviders = () => apiJson("/api/providers/list");
export const getModels = () => apiJson("/api/models");

// ---------- Provider management (mirrors desktop Settings) ----------
export async function setActiveProvider(name: string) {
  return apiJson("/api/providers/activate", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function addProvider(cfg: {
  name: string;
  url: string;
  type: string;
  models_url?: string;
  auth_type?: string;
  default_model?: string;
  free_heuristic?: boolean;
  api_key?: string;
}) {
  return apiJson("/api/providers/add", {
    method: "POST",
    body: JSON.stringify(cfg),
  });
}

export async function deleteProvider(name: string) {
  return apiJson(`/api/providers/${encodeURIComponent(name)}`, {
    method: "DELETE",
  });
}

export async function saveProviderKey(provider: string, apiKey: string) {
  return apiJson("/api/config", {
    method: "POST",
    body: JSON.stringify({ provider, api_key: apiKey }),
  });
}
export const getUsage = () => apiJson("/api/usage/stats");
export const getDevice = () => apiJson("/api/device");

// ---------- RAG (Knowledge Base) ----------
export const getRagStats = () => apiJson("/api/rag/stats");
export const getRagDocuments = () => apiJson("/api/rag/documents");
export const getRagCollections = () => apiJson("/api/rag/collections");

export async function ragAddText(text: string, collection?: string) {
  return apiJson("/api/rag/add-text", {
    method: "POST",
    body: JSON.stringify({ text, collection: collection || "default" }),
  });
}

export async function ragSearch(query: string, collection?: string, top_k = 5) {
  return apiJson("/api/rag/search", {
    method: "POST",
    body: JSON.stringify({ query, collection: collection || "default", top_k }),
  });
}

export async function ragDeleteDoc(id: string) {
  return apiJson(`/api/rag/documents/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function ragUpload(uri: string, name: string, collection?: string) {
  const base = await getBase();
  const token = await getToken();
  const form: any = new FormData();
  form.append("file", { uri, name, type: "application/octet-stream" });
  if (collection) form.append("collection", collection);
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${base}/api/rag/upload`, { method: "POST", headers, body: form });
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const j = await res.json();
      msg = j.detail || j.error || msg;
    } catch {
      /* ignore */
    }
    throw new Error(`${res.status}: ${msg}`);
  }
  return res.json();
}

// ---------- Memory ----------
export const getMemoryStats = () => apiJson("/api/memory/stats");
export const getMemoryMessages = () => apiJson("/api/memory/messages");
export const getMemoryFacts = () => apiJson("/api/memory/facts");
export const getMemorySessions = () => apiJson("/api/memory/sessions");

export async function memorySearch(query: string) {
  return apiJson("/api/memory/search", {
    method: "POST",
    body: JSON.stringify({ query }),
  });
}

export async function memoryClear() {
  return apiJson("/api/memory/clear", { method: "POST" });
}

export async function memoryDeleteFact(id: string) {
  return apiJson(`/api/memory/facts/${encodeURIComponent(id)}`, { method: "DELETE" });
}

// ---------- Auto-Detect API Key ----------
export async function autoDetectApiKey(apiKey: string) {
  return apiJson<{ detected: boolean; provider?: string; message: string }>("/api/auth/auto-detect", {
    method: "POST",
    body: JSON.stringify({ api_key: apiKey }),
  });
}

export async function login(email: string, password: string) {
  const r = await req("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const d = await r.json();
  if (d.token) await setToken(d.token);
  return d;
}

export async function register(email: string, password: string) {
  const r = await req("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const d = await r.json();
  if (d.token) await setToken(d.token);
  return d;
}

export async function logout() {
  const t = await getToken();
  if (t) {
    try {
      await req("/api/auth/logout", {
        method: "POST",
        body: JSON.stringify({ token: t }),
      });
    } catch {
      /* ignore */
    }
  }
  await setToken("");
}

export async function verifyToken(t: string): Promise<{ valid: boolean; email?: string } | null> {
  const base = await getBase();
  try {
    const res = await fetch(`${base}/api/auth/verify?token=${encodeURIComponent(t)}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export function extractContent(ev: any): string {
  return (
    ev?.message?.content ||
    ev?.choices?.[0]?.delta?.content ||
    ev?.choices?.[0]?.message?.content ||
    ""
  );
}

// ---------- Database & Schema ----------
export const getDbSchema = () => apiJson<{ version: string; schema: { synced: boolean; db_version: number; expected_version: number }; database: { connected: boolean } }>("/api/db/schema");

// ---------- RAG Advanced ----------
export async function ragClear(collection?: string) {
  return apiJson("/api/rag/clear", {
    method: "POST",
    body: JSON.stringify({ collection: collection || undefined }),
  });
}

export const getRagVectorStats = () => apiJson("/api/rag/vector-stats");

export async function ragRebuildIndex() {
  return apiJson("/api/rag/rebuild-index", { method: "POST" });
}

export async function ragReindex(docId: string) {
  return apiJson(`/api/rag/reindex/${encodeURIComponent(docId)}`, { method: "POST" });
}

// ---------- Memory Advanced ----------
export async function memoryAddFact(fact: string, source?: string) {
  return apiJson("/api/memory/facts", {
    method: "POST",
    body: JSON.stringify({ fact, source: source || "manual" }),
  });
}

export const getMemoryContext = (query?: string) =>
  apiJson(`/api/memory/context${query ? `?query=${encodeURIComponent(query)}` : ""}`);

// ---------- Auth Advanced ----------
export async function changePassword(oldPassword: string, newPassword: string) {
  return apiJson("/api/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
  });
}

// ---------- ACL ----------
export const getAclStats = () => apiJson("/api/acl/stats");
export const getAuditLog = (limit = 100) => apiJson(`/api/acl/audit-log?limit=${limit}`);
export const getAclRoles = () => apiJson("/api/acl/roles");

/** Stream a chat completion from the emulator. Yields Ollama-style ndjson events. */
export async function* streamChat(
  messages: { role: string; content: string }[],
  model: string,
  signal?: AbortSignal
): AsyncGenerator<any> {
  const base = await getBase();
  const token = await getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${base}/api/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify({ model, messages, stream: true }),
    signal,
  });
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const j = await res.json();
      msg = j.error || msg;
    } catch {
      /* ignore */
    }
    throw new Error(`${res.status}: ${msg}`);
  }

  const parseLines = function* (text: string) {
    for (const raw of text.split("\n")) {
      const line = raw.trim();
      if (!line) continue;
      try {
        yield JSON.parse(line);
      } catch {
        /* ignore malformed */
      }
    }
  };

  // Modern RN exposes a streaming body reader; fall back to full text otherwise.
  const body: any = res.body;
  if (body && typeof body.getReader === "function") {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      let nl: number;
      while ((nl = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, nl);
        buf = buf.slice(nl + 1);
        if (line.trim()) {
          try {
            yield JSON.parse(line.trim());
          } catch {
            /* ignore */
          }
        }
      }
    }
    if (buf.trim()) {
      for (const ev of parseLines(buf)) yield ev;
    }
  } else {
    const text = await res.text();
    for (const ev of parseLines(text)) yield ev;
  }
}
