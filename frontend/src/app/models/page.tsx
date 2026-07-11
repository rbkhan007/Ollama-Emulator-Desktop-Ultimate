"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { apiJson, toast } from "@/lib/api";
import { PageIcon } from "@/components/Icons";

type Model = {
  name: string;
  free: boolean;
  provider: string;
  type: string;
};

type Provider = {
  name: string;
  type: string;
  default_model: string;
  api_key_set: boolean;
  api_key_masked: string;
};

export default function ModelsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [models, setModels] = useState<Model[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [activeProvider, setActiveProvider] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "free" | "paid">("all");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const [allModels, provs, status] = await Promise.all([
        apiJson<{ models: Model[]; active_provider: string }>("/api/models/all"),
        apiJson<Provider[]>("/api/providers/list"),
        apiJson<{ active_provider: string }>("/api/status"),
      ]);
      setModels(allModels.models || []);
      setProviders(provs || []);
      setActiveProvider(status.active_provider || allModels.active_provider || "");
    } catch (e) {
      toast("Failed to load models", true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    load();
  }, [isAuthenticated, router]);

  const filtered = models.filter((m) => {
    if (filter === "free" && !m.free) return false;
    if (filter === "paid" && m.free) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.provider.toLowerCase().includes(q) ||
        m.type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const freeCount = models.filter((m) => m.free).length;
  const paidCount = models.filter((m) => !m.free).length;
  const providerCount = new Set(models.map((m) => m.provider)).size;

  const providerColors: Record<string, string> = {
    openrouter: "#7c3aed",
    ollama: "#10b981",
    openai: "#3b82f6",
    anthropic: "#f59e0b",
    groq: "#ef4444",
    together: "#6366f1",
    deepseek: "#06b6d4",
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div
          className="page-header-icon"
          style={{ background: "rgba(99, 102, 241, 0.15)" }}
        >
          <PageIcon type="models" color="#6366f1" />
        </div>
        <div>
          <h1>Models Browser</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            Browse and search all available models across providers
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid stagger-1">
        {[
          { label: "Total Models", value: models.length, color: "#6366f1" },
          { label: "Free Models", value: freeCount, color: "#10b981" },
          { label: "Paid Models", value: paidCount, color: "#f59e0b" },
          { label: "Providers", value: providerCount, color: "#3b82f6" },
        ].map((s, i) => (
          <div
            key={s.label}
            className={`card stagger-${i + 1}`}
            style={{ textAlign: "center", padding: 16 }}
          >
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>
              {s.value}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div
        className="card stagger-2"
        style={{ padding: 16, marginBottom: 16 }}
      >
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 200 }}>
            <input
              type="text"
              placeholder="Search models by name, provider, or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                color: "var(--text)",
                fontSize: 14,
                outline: "none",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {(["all", "free", "paid"] as const).map((f) => (
              <button
                key={f}
                className={`btn ${filter === f ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setFilter(f)}
                style={{ padding: "8px 16px", fontSize: 13 }}
              >
                {f === "all" && `All (${models.length})`}
                {f === "free" && `Free (${freeCount})`}
                {f === "paid" && `Paid (${paidCount})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Provider List */}
      <div className="card stagger-3" style={{ padding: 16, marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 12px 0", fontSize: 15, fontWeight: 600 }}>
          Configured Providers
        </h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {providers.map((p) => (
            <div
              key={p.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 12px",
                background:
                  p.name === activeProvider
                    ? "rgba(99, 102, 241, 0.15)"
                    : "var(--surface)",
                border: `1px solid ${p.name === activeProvider ? "#6366f1" : "var(--border)"}`,
                borderRadius: 8,
                fontSize: 13,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: p.api_key_set ? "#10b981" : "#6b7280",
                }}
              />
              <span style={{ fontWeight: 500 }}>{p.name}</span>
              <span
                style={{
                  fontSize: 11,
                  padding: "2px 6px",
                  borderRadius: 4,
                  background: "var(--surface)",
                  color: "var(--text-muted)",
                }}
              >
                {p.type}
              </span>
              {p.name === activeProvider && (
                <span
                  style={{
                    fontSize: 10,
                    padding: "2px 6px",
                    borderRadius: 4,
                    background: "#6366f1",
                    color: "white",
                    fontWeight: 600,
                  }}
                >
                  ACTIVE
                </span>
              )}
              {p.api_key_masked && (
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    fontFamily: "monospace",
                  }}
                >
                  {p.api_key_masked}
                </span>
              )}
            </div>
          ))}
          {providers.length === 0 && (
            <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
              No providers configured. Add one in{" "}
              <a href="/settings" style={{ color: "#6366f1" }}>
                Settings
              </a>
              .
            </p>
          )}
        </div>
      </div>

      {/* Models List */}
      {loading ? (
        <div className="card" style={{ padding: 32, textAlign: "center" }}>
          <div
            style={{
              width: 32,
              height: 32,
              border: "3px solid var(--border)",
              borderTopColor: "#6366f1",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 12px",
            }}
          />
          <p style={{ color: "var(--text-muted)" }}>Loading models...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.3 }}>
            🔍
          </div>
          <p style={{ color: "var(--text-muted)" }}>
            {models.length === 0
              ? "No models available. Configure a provider with an API key in Settings."
              : "No models match your search."}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((m, i) => (
            <div
              key={`${m.provider}-${m.name}`}
              className="card"
              style={{
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
                animation: `fadeIn 0.2s ease ${Math.min(i * 0.03, 0.5)}s both`,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: m.free ? "#10b981" : "#f59e0b",
                  flexShrink: 0,
                }}
                title={m.free ? "Free" : "Paid"}
              />
              <div style={{ flex: 1, minWidth: 200 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    fontFamily: "var(--font-mono)",
                    wordBreak: "break-all",
                  }}
                >
                  {m.name}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span
                  style={{
                    fontSize: 12,
                    padding: "3px 8px",
                    borderRadius: 4,
                    background:
                      providerColors[m.provider] || "var(--surface)",
                    color: "white",
                    fontWeight: 500,
                    opacity: 0.9,
                  }}
                >
                  {m.provider}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    padding: "2px 8px",
                    borderRadius: 4,
                    background: "var(--surface)",
                    color: "var(--text-muted)",
                  }}
                >
                  {m.type}
                </span>
                {m.free ? (
                  <span
                    className="badge badge-green"
                    style={{ fontSize: 11 }}
                  >
                    Free
                  </span>
                ) : (
                  <span
                    className="badge badge-amber"
                    style={{ fontSize: 11 }}
                  >
                    Paid
                  </span>
                )}
                {m.provider === activeProvider && (
                  <span
                    className="badge"
                    style={{
                      fontSize: 11,
                      background: "rgba(99, 102, 241, 0.15)",
                      color: "#6366f1",
                    }}
                  >
                    Active Provider
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
