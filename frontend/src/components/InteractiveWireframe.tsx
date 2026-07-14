"use client";

import React, { useState, useEffect, useRef } from "react";

const BRAND_ICONS = {
  claudeCode: (
    <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
      <path clipRule="evenodd" d="M20.998 10.949H24v3.102h-3v3.028h-1.487V20H18v-2.921h-1.487V20H15v-2.921H9V20H7.488v-2.921H6V20H4.487v-2.921H3V14.05H0V10.95h3V5h17.998v5.949zM6 10.949h1.488V8.102H6v2.847zm10.51 0H18V8.102h-1.49v2.847z" fill="#D97757" fillRule="evenodd" />
    </svg>
  ),
  opencode: (
    <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
      <title>opencode</title>
      <path d="M16 6H8v12h8V6zm4 16H4V2h16v20z" fill="#6c5ce7" />
    </svg>
  ),
  kilocode: (
    <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
      <title>Kilo Code</title>
      <path d="M0 0v24h24V0H0zm22.222 22.222H1.778V1.778h20.444v20.444zm-7.555-4.964h2.222v1.778h-2.794L12.89 17.83v-2.794h1.778v2.222zm4 0h-1.778v-2.222h-2.222v-1.778h2.793l1.207 1.207v2.793zm-7.556-2.591H9.333v-1.778h1.778v1.778zm-5.778-1.778h1.778v4h4v1.778H6.54L5.333 17.46V12.89zm13.334-3.556v1.778h-5.778V9.333h1.987V7.111h-1.987V5.333h2.558l1.206 1.207v2.793h2.014zm-11.556-2h2.222l1.778 1.778v2H9.333v-2H7.111v2H5.333V5.333h1.778v2zm4 0H9.333v-2h1.778v2z" fill="#00b894" />
    </svg>
  ),
  codex: (
    <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient gradientUnits="userSpaceOnUse" id="codexGradient" x1="12" x2="12" y1="3" y2="21">
          <stop stopColor="#B1A7FF" />
          <stop offset=".5" stopColor="#7A9DFF" />
          <stop offset="1" stopColor="#3941FF" />
        </linearGradient>
      </defs>
      <title>Codex</title>
      <path d="M19.503 0H4.496A4.496 4.496 0 000 4.496v15.007A4.496 4.496 0 004.496 24h15.007A4.496 4.496 0 0024 19.503V4.496A4.496 4.496 0 0019.503 0z" fill="#10a37f" />
      <path d="M9.064 3.344a4.578 4.578 0 012.285-.312c1 .115 1.891.54 2.673 1.275.01.01.024.017.037.021a.09.09 0 00.043 0 4.55 4.55 0 013.046.275l.047.022.116.057a4.581 4.581 0 012.188 2.399c.209.51.313 1.041.315 1.595a4.24 4.24 0 01-.134 1.223.123.123 0 00.03.115c.594.607.988 1.33 1.183 2.17.289 1.425-.007 2.71-.887 3.854l-.136.166a4.548 4.548 0 01-2.201 1.388.123.123 0 00-.081.076c-.191.551-.383 1.023-.74 1.494-.9 1.187-2.222 1.846-3.711 1.838-1.187-.006-2.239-.44-3.157-1.302a.107.107 0 00-.105-.024c-.388.125-.78.143-1.204.138a4.441 4.441 0 01-1.945-.466 4.544 4.544 0 01-1.61-1.335c-.152-.202-.303-.392-.414-.617a5.81 5.81 0 01-.37-.961 4.582 4.582 0 01-.014-2.298.124.124 0 00.006-.056.085.085 0 00-.027-.048 4.467 4.467 0 01-1.034-1.651 3.896 3.896 0 01-.251-1.192 5.189 5.189 0 01.141-1.6c.337-1.112.982-1.985 1.933-2.618.212-.141.413-.251.601-.33.215-.089.43-.164.646-.227a.098.098 0 00.065-.066 4.51 4.51 0 01.829-1.615 4.535 4.535 0 011.837-1.388zm3.482 10.565a.637.637 0 000 1.272h3.636a.637.637 0 100-1.272h-3.636zM8.462 9.23a.637.637 0 00-1.106.631l1.272 2.224-1.266 2.136a.636.636 0 101.095.649l1.454-2.455a.636.636 0 00.005-.64L8.462 9.23z" fill="url(#codexGradient)" />
    </svg>
  ),
  ollama: (
    <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
      <title>Ollama</title>
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm-2-6l4-2-4-2v4z" fill="#00cec9" />
    </svg>
  ),
};

const INITIAL_AGENTS = [
  { id: "ollamomui", name: "OllamoMUI", color: "#f59e0b", icon: "ollama", desc: "Secure Neural Proxy bridge & routing broker gateway.", defaultProvider: "openrouter", setupCmd: "ollamomui serve --secure" },
  { id: "claude-code", name: "ClaudeCode", color: "#fd79a8", icon: "claudeCode", desc: "Anthropic agentic terminal interface.", defaultProvider: "anthropic", setupCmd: "npm install -g @anthropic-ai/claude-code && claude" },
  { id: "opencode", name: "OpenCode", color: "#6c5ce7", icon: "opencode", desc: "Local opensource programming companion.", defaultProvider: "openrouter", setupCmd: "pip install opencode-cli && opencode start" },
  { id: "kilocode", name: "KiloCode", color: "#00b894", icon: "kilocode", desc: "Sleek background compiler & diagnostic runner.", defaultProvider: "deepseek", setupCmd: "npm i -g kilocode && kilocode audit" },
  { id: "codex", name: "CodexCLI", color: "#10a37f", icon: "codex", desc: "Integrated workspace multi-agent runner.", defaultProvider: "openai", setupCmd: "npx codex-cli auth" },
  { id: "ollama-cli", name: "Ollama CLI", color: "#00cec9", icon: "ollama", desc: "Offline local orchestration runner.", defaultProvider: "gemini", setupCmd: "ollama run codegemma" },
];

const INITIAL_PROVIDERS = [
  { id: "openai", name: "OpenAI", color: "#10a37f", envKey: "OPENAI_API_KEY", latency: 45, cost: 2.5, models: ["gpt-4o", "o1-pro", "gpt-4-turbo"] },
  { id: "anthropic", name: "Anthropic", color: "#fd79a8", envKey: "ANTHROPIC_API_KEY", latency: 68, cost: 3.0, models: ["claude-3-7-sonnet", "claude-3-5-haiku"] },
  { id: "groq", name: "Groq", color: "#fdcb6e", envKey: "GROQ_API_KEY", latency: 15, cost: 0.59, models: ["llama-3.3-70b-specdec", "mixtral-8x7b"] },
  { id: "deepseek", name: "DeepSeek", color: "#4D6BFE", envKey: "DEEPSEEK_API_KEY", latency: 240, cost: 0.14, models: ["deepseek-v3", "deepseek-reasoner"] },
  { id: "gemini", name: "Gemini", color: "#3186FF", envKey: "GEMINI_API_KEY", latency: 110, cost: 1.25, models: ["gemini-2.5-pro", "gemini-2.5-flash"] },
  { id: "openrouter", name: "OpenRouter", color: "#6c5ce7", envKey: "OPENROUTER_API_KEY", latency: 165, cost: 1.8, models: ["anthropic/claude-3.7-sonnet", "meta-llama/llama-3.1-405b"] },
  { id: "mistral", name: "Mistral", color: "#ff7000", envKey: "MISTRAL_API_KEY", latency: 85, cost: 1.5, models: ["mistral-large-latest", "codestral-latest"] },
];

export default function InteractiveWireframe() {
  const [agents] = useState(INITIAL_AGENTS);
  const [providers] = useState(INITIAL_PROVIDERS);
  const [selectedAgent, setSelectedAgent] = useState("ollamomui");
  const [selectedProvider, setSelectedProvider] = useState("openrouter");
  const [isSimulating, setIsSimulating] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<Array<{ text: string; color: string }>>([]);
  const [activeModel, setActiveModel] = useState("anthropic/claude-3.7-sonnet");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prov = providers.find((p) => p.id === selectedProvider);
    if (prov && prov.models.length > 0) {
      setActiveModel(prov.models[0]);
    }
  }, [selectedProvider, providers]);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs]);

  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setTerminalLogs([]);

    const agentObj = agents.find((a) => a.id === selectedAgent) || agents[0];
    const providerObj = providers.find((p) => p.id === selectedProvider) || providers[0];

    let logLines: Array<{ text: string; color: string }> = [];

    if (agentObj.id === "ollamomui") {
      logLines = [
        { text: `~ % ${agentObj.setupCmd}`, color: "text-amber-400 font-bold" },
        { text: `[OLLAMOMUI] Initiating Neural Proxy gateway (CLI ↔ OLLAMOMUI ↔ ANY CLOUD MODEL)...`, color: "text-amber-300 font-semibold" },
        { text: `[OLLAMOMUI] Local Broker mapping secure tunnel listener on http://localhost:8080`, color: "text-slate-400" },
        { text: `[SYSTEM] Loaded API auth target security: process.env.${providerObj.envKey}`, color: "text-purple-400" },
        { text: `[NEURAL PROXY] Intercepting Client Prompt vector mappings...`, color: "text-cyan-400" },
        { text: `[ROUTER] Mapping optimal wire to: ${providerObj.name} using [SMART PROXY] strategy`, color: "text-emerald-400" },
        { text: `[OLLAMOMUI] Tunneling context (3,105 tokens) to downstream endpoint model: "${activeModel}"`, color: "text-amber-200" },
        { text: `⚡ Handshake completed: Central Hub latency is ${providerObj.latency}ms`, color: "text-green-400" },
        { text: `📡 Dispatched proxy tokens. Stream buffer established.`, color: "text-slate-300" },
        { text: `⏱️ Decrypted responses received in center proxy, forwarded securely to terminal console.`, color: "text-cyan-300" },
        { text: `💎 Run metrics: Estimated proxy token cost: $${((providerObj.cost / 1e6) * 3105).toFixed(5)}`, color: "text-amber-300 font-mono" },
        { text: `✨ Connection closed safely. OLLAMOMUI Neutral Proxy listening for subsequent requests.`, color: "text-green-400 font-bold" },
      ];
    } else {
      logLines = [
        { text: `~ % ${agentObj.setupCmd}`, color: "text-slate-400 font-bold" },
        { text: `[SYSTEM] Bootstrapping client runtime dependencies...`, color: "text-cyan-400" },
        { text: `[ENV] Loaded api key security: process.env.${providerObj.envKey}`, color: "text-indigo-400" },
        { text: `[ROUTER] Mapping optimal routing pipeline using: [SMART PROXY] strategy`, color: "text-pink-400" },
        { text: `[HANDSHAKE] Initializing TLS socket tunnel to provider: ${providerObj.name}`, color: "text-slate-300" },
        { text: `[API] Selected target engine model: "${activeModel}"`, color: "text-purple-400" },
        { text: `⚡ Connection verified: TLS v1.3 handshake established. Target latency: ${providerObj.latency}ms`, color: "text-green-400" },
        { text: `🔍 Running workspace search diagnostics...`, color: "text-yellow-500" },
        { text: `💾 Analyzed files in repository. Context size: 3,105 input tokens.`, color: "text-slate-300" },
        { text: `📡 Dispatched tokens to ${providerObj.name} inference endpoint...`, color: "text-cyan-400" },
        { text: `⏱️ Response received in ${providerObj.latency + 22}ms. Processed output tokens: 844`, color: "text-green-400" },
        { text: `💎 Run metrics: Estimated token cost: $${((providerObj.cost / 1e6) * 3949).toFixed(5)}`, color: "text-amber-400 font-semibold" },
        { text: `✨ Compilation verified. Success: Session closed with code 0.`, color: "text-green-500 font-bold" },
      ];
    }

    logLines.forEach((line, index) => {
      setTimeout(() => {
        setTerminalLogs((prev) => [...prev, line]);
        if (index === logLines.length - 1) {
          setIsSimulating(false);
        }
      }, index * 300);
    });
  };

  const activeAgentObj = agents.find((a) => a.id === selectedAgent) || agents[0];
  const activeProviderObj = providers.find((p) => p.id === selectedProvider) || providers[0];

  return (
    <section style={{ padding: "0 24px 56px", maxWidth: 1100, margin: "0 auto" }}>
      <div className="wireframe-container">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes flow {
            0% { stroke-dashoffset: 120; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes passive-flow {
            0% { stroke-dashoffset: 60; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.25; }
            50% { opacity: 0.85; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes rotateHub {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .data-line {
            stroke-dasharray: 8 7;
            animation: flow 2.2s linear infinite;
            stroke-width: 2.2;
            fill: none;
          }
          .passive-data-line {
            stroke-dasharray: 4 6;
            animation: passive-flow 6s linear infinite;
            stroke-width: 0.8;
            fill: none;
          }
          .node-pulse {
            animation: pulse 2.4s ease-in-out infinite;
          }
          .orb {
            animation: float 6s ease-in-out infinite;
          }
          .rotating-ring {
            transform-origin: center;
            animation: rotateHub 25s linear infinite;
          }
        `}} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: "var(--text-h2)", fontWeight: 700, color: "var(--text)", margin: 0 }}>Interactive Wireframe Engine</h2>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-sm-color)", lineHeight: "var(--leading-small)", margin: "4px 0 0" }}>Click agents and providers to see routing paths. Simulate to watch data flow.</p>
          </div>
          <button
            onClick={runSimulation}
            disabled={isSimulating}
            style={{
              padding: "12px 24px",
              borderRadius: 12,
              minHeight: "var(--click-target)",
              fontSize: 14,
              fontWeight: 700,
              background: isSimulating ? "var(--surface)" : "var(--gradient-1)",
              color: isSimulating ? "var(--text-muted)" : "white",
              border: isSimulating ? "1px solid var(--glass-border)" : "none",
              cursor: isSimulating ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {isSimulating ? (
              <>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b", animation: "pulse 1s infinite" }} />
                Executing...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                Simulate Agent Run
              </>
            )}
          </button>
        </div>

        <div style={{ background: "var(--surface)", borderRadius: 16, border: "1px solid var(--glass-border)", padding: 8, marginBottom: 24 }}>
          <svg viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto", maxHeight: 500, display: "block" }}>
            <defs>
              <linearGradient id="gradientActiveAgent" x1="184" y1="250" x2="400" y2="250" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
              <linearGradient id="gradientActiveProvider" x1="400" y1="250" x2="616" y2="250" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <radialGradient id="hubBlurGrad">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.18" />
                <stop offset="60%" stopColor="#ec4899" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#090914" stopOpacity="0" />
              </radialGradient>
              <filter id="softGlow">
                <feGaussianBlur stdDeviation="16" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <circle cx="400" cy="250" r="160" fill="url(#hubBlurGrad)" filter="url(#softGlow)" />
            <circle cx="100" cy="100" r="80" fill="#f59e0b" opacity="0.03" filter="url(#softGlow)" className="orb" />
            <circle cx="700" cy="400" r="120" fill="#8b5cf6" opacity="0.03" filter="url(#softGlow)" className="orb" style={{ animationDelay: "-3s" }} />

            <g id="constellation-network-mesh">
              {agents.map((ag, aIndex) => {
                const startY = 72 + aIndex * 46;
                const startX = 184;
                const hubX = 400;
                const hubY = 250;
                const isActive = ag.id === selectedAgent;
                const path = `M ${startX} ${startY} C ${(startX + hubX) / 2} ${startY}, ${(startX + hubX) / 2} ${hubY}, ${hubX} ${hubY}`;
                return (
                  <g key={`mesh-agent-to-hub-${ag.id}`}>
                    <path d={path} stroke={ag.color} strokeWidth={isActive ? "1.5" : "0.8"} opacity={isActive ? "0.2" : "0.08"} fill="none" />
                    {!isActive && <path d={path} stroke={ag.color} className="passive-data-line" opacity="0.15" />}
                  </g>
                );
              })}
              {providers.map((prov, pIndex) => {
                const endY = 56 + pIndex * 44;
                const endX = 616;
                const hubX = 400;
                const hubY = 250;
                const isActive = prov.id === selectedProvider;
                const path = `M ${hubX} ${hubY} C ${(hubX + endX) / 2} ${hubY}, ${(hubX + endX) / 2} ${endY}, ${endX} ${endY}`;
                return (
                  <g key={`mesh-hub-to-provider-${prov.id}`}>
                    <path d={path} stroke={prov.color} strokeWidth={isActive ? "1.5" : "0.8"} opacity={isActive ? "0.2" : "0.08"} fill="none" />
                    {!isActive && <path d={path} stroke={prov.color} className="passive-data-line" opacity="0.15" />}
                  </g>
                );
              })}
            </g>

            {(() => {
              const agIndex = agents.findIndex((a) => a.id === selectedAgent);
              const prIndex = providers.findIndex((p) => p.id === selectedProvider);
              if (agIndex !== -1 && prIndex !== -1) {
                const startY = 72 + agIndex * 46;
                const endY = 56 + prIndex * 44;
                const startX = 184;
                const endX = 616;
                const hubX = 400;
                const hubY = 250;
                const path1 = `M ${startX} ${startY} C ${(startX + hubX) / 2} ${startY}, ${(startX + hubX) / 2} ${hubY}, ${hubX} ${hubY}`;
                const path2 = `M ${hubX} ${hubY} C ${(hubX + endX) / 2} ${hubY}, ${(hubX + endX) / 2} ${endY}, ${endX} ${endY}`;
                return (
                  <g key="active-wireframe-set">
                    <path d={path1} stroke="url(#gradientActiveAgent)" strokeWidth="6" opacity="0.3" fill="none" filter="url(#glow)" />
                    <path d={path1} stroke="url(#gradientActiveAgent)" strokeWidth="2.5" opacity="0.95" fill="none" />
                    <path d={path1} stroke="#F59E0B" className="data-line" filter="url(#glow)" />
                    <path d={path2} stroke="url(#gradientActiveProvider)" strokeWidth="6" opacity="0.3" fill="none" filter="url(#glow)" />
                    <path d={path2} stroke="url(#gradientActiveProvider)" strokeWidth="2.5" opacity="0.95" fill="none" />
                    <path d={path2} stroke={activeProviderObj.color} className="data-line" filter="url(#glow)" />
                  </g>
                );
              }
              return null;
            })()}

            <g transform="translate(400, 250)">
              <circle cx="0" cy="0" r="30" fill="#090914" />
              <circle cx="0" cy="0" r="28" fill="none" stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="5 3" className="rotating-ring" opacity="0.8" />
              <circle cx="0" cy="0" r="20" fill="none" stroke="#10B981" strokeWidth="1.5" opacity="0.6" className="node-pulse" />
              <circle cx="0" cy="0" r="14" fill="#090914" stroke="#F59E0B" strokeWidth="2.5" filter="url(#glow)" />
              <circle cx="0" cy="0" r="6" fill="#10B981" />
              <text x="0" y="-38" fill="#F59E0B" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="1">OLLAMOMUI</text>
              <text x="0" y="44" fill="#94a3b8" fontSize="9" fontWeight="500" textAnchor="middle" letterSpacing="0.5">NEURAL PROXY HUB</text>
            </g>

            <text x="110" y="34" fill="#94a3b8" fontSize="11" fontWeight="600" textAnchor="middle" letterSpacing="2">CLI AGENTS</text>
            <text x="690" y="34" fill="#94a3b8" fontSize="11" fontWeight="600" textAnchor="middle" letterSpacing="2">CLOUD PROVIDERS</text>

            {agents.map((agent, index) => {
              const yPos = 72 + index * 46;
              const isSelected = selectedAgent === agent.id;
              const x = 32, w = 152, h = 32, o = 6;
              return (
                <g key={`agent-node-${agent.id}`} className="cursor-pointer" onClick={() => setSelectedAgent(agent.id)} style={{ cursor: "pointer" }}>
                  {isSelected && (
                    <circle cx="110" cy={yPos} r="6" fill="none" stroke={agent.color} strokeWidth="1" opacity="0.5">
                      <animate attributeName="r" values="6;22" dur="2.4s" begin="0s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.5;0" dur="2.4s" begin="0s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <path
                    d={`M ${x} ${yPos - h / 2} H ${x + w} V ${yPos + h / 2} H ${x} Z M ${x + o} ${yPos - h / 2 - o} H ${x + w + o} V ${yPos + h / 2 - o} H ${x + o} Z M ${x} ${yPos - h / 2} L ${x + o} ${yPos - h / 2 - o} M ${x + w} ${yPos - h / 2} L ${x + w + o} ${yPos - h / 2 - o} M ${x + w} ${yPos + h / 2} L ${x + w + o} ${yPos + h / 2 - o} M ${x} ${yPos + h / 2} L ${x + o} ${yPos + h / 2 - o}`}
                    fill={isSelected ? "rgba(245, 158, 11, 0.08)" : "rgba(13, 13, 26, 0.4)"}
                    stroke={isSelected ? agent.color : "rgba(255, 255, 255, 0.1)"}
                    strokeOpacity={isSelected ? "0.9" : "0.5"}
                    strokeWidth={isSelected ? "1.5" : "0.5"}
                  />
                  <foreignObject x="40" y={yPos - 11} width="22" height="22">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: agent.color }}>
                      {BRAND_ICONS[agent.icon as keyof typeof BRAND_ICONS]}
                    </div>
                  </foreignObject>
                  <text x="68" y={yPos + 4} fill={isSelected ? agent.color : "#94a3b8"} fontSize="11" fontWeight={isSelected ? "600" : "400"} textAnchor="start">
                    {agent.name}
                  </text>
                </g>
              );
            })}

            {providers.map((provider, index) => {
              const yPos = 56 + index * 44;
              const isSelected = selectedProvider === provider.id;
              const x = 616, w = 152, h = 32, o = 6;
              return (
                <g key={`provider-node-${provider.id}`} className="cursor-pointer" onClick={() => setSelectedProvider(provider.id)} style={{ cursor: "pointer" }}>
                  {isSelected && (
                    <circle cx="690" cy={yPos} r="6" fill="none" stroke={provider.color} strokeWidth="1" opacity="0.5">
                      <animate attributeName="r" values="6;22" dur="2.4s" begin="0s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.5;0" dur="2.4s" begin="0s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <path
                    d={`M ${x} ${yPos - h / 2} H ${x + w} V ${yPos + h / 2} H ${x} Z M ${x + o} ${yPos - h / 2 - o} H ${x + w + o} V ${yPos + h / 2 - o} H ${x + o} Z M ${x} ${yPos - h / 2} L ${x + o} ${yPos - h / 2 - o} M ${x + w} ${yPos - h / 2} L ${x + w + o} ${yPos - h / 2 - o} M ${x + w} ${yPos + h / 2} L ${x + w + o} ${yPos + h / 2 - o} M ${x} ${yPos + h / 2} L ${x + o} ${yPos + h / 2 - o}`}
                    fill={isSelected ? "rgba(139, 92, 246, 0.08)" : "rgba(13, 13, 26, 0.4)"}
                    stroke={isSelected ? provider.color : "rgba(255, 255, 255, 0.1)"}
                    strokeOpacity={isSelected ? "0.9" : "0.5"}
                    strokeWidth={isSelected ? "1.5" : "0.5"}
                  />
                  <foreignObject x="624" y={yPos - 11} width="22" height="22">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: provider.color }}>
                      {BRAND_ICONS[provider.id as keyof typeof BRAND_ICONS]}
                    </div>
                  </foreignObject>
                  <text x="652" y={yPos + 4} fill={isSelected ? provider.color : "#94a3b8"} fontSize="11" fontWeight={isSelected ? "600" : "400"} textAnchor="start">
                    {provider.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div style={{ background: "var(--surface)", borderRadius: 16, border: "1px solid var(--glass-border)", overflow: "hidden" }}>
          <div style={{ padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--glass-border)", fontSize: 12, fontFamily: "var(--font-mono)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", opacity: 0.7 }} />
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#eab308", opacity: 0.7 }} />
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", opacity: 0.7 }} />
              <span style={{ color: "var(--text-muted)", marginLeft: 8 }}>Execution Console</span>
            </div>
            <span style={{ color: "var(--text-muted)" }}>API Client Pipeline Status</span>
          </div>
          <div style={{ padding: 16, height: 208, overflowY: "auto", fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: "var(--leading-small)", background: "var(--surface)" }}>
            {terminalLogs.length === 0 ? (
              <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4, marginBottom: 8 }}><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>
                <p style={{ margin: 0, fontSize: 12 }}>Click &quot;Simulate Agent Run&quot; to observe real-time proxy dispatch sequences.</p>
              </div>
            ) : (
              terminalLogs.map((log, i) => (
                <div key={i} className={log.color}>
                  {log.text}
                </div>
              ))
            )}
            <div ref={terminalEndRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
