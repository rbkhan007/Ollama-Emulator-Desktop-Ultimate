"use client";

import { ReactNode } from "react";

export const PLAYGROUND_ACCENT = "var(--accent-2)";

/* Glass surface card that matches the app's design system */
export function GlassCard({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{
        background: "color-mix(in srgb, var(--surface) 88%, transparent)",
        border: "1px solid var(--glass-border)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.04) inset",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* Icon chip with accent glow */
export function IconChip({
  children,
  color = "var(--text-muted)",
  size = 18,
}: {
  children: ReactNode;
  color?: string;
  size?: number;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size + 14,
        height: size + 14,
        borderRadius: 12,
        color,
        background: `color-mix(in srgb, ${color} 12%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
        boxShadow: `0 0 0 0 transparent`,
      }}
    >
      {children}
    </span>
  );
}

/* Round action button */
export function IconButton({
  children,
  onClick,
  title,
  variant = "ghost",
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  title?: string;
  variant?: "ghost" | "accent" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const accent =
    variant === "accent"
      ? "var(--accent-2)"
      : variant === "danger"
      ? "var(--accent-3)"
      : "transparent";
  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      disabled={disabled}
      className="pg-icon-btn"
      style={{
        color: variant === "ghost" ? "var(--text-muted)" : "#fff",
        background: variant === "ghost" ? "transparent" : accent,
        border: `1px solid ${
          variant === "ghost" ? "var(--glass-border)" : "transparent"
        }`,
        opacity: disabled ? 0.45 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}

/* Status pill */
export function Pill({ children, color = "var(--text-muted)" }: { children: ReactNode; color?: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 11,
        fontWeight: 600,
        padding: "3px 10px",
        borderRadius: 999,
        color,
        background: `color-mix(in srgb, ${color} 12%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
      }}
    >
      {children}
    </span>
  );
}
