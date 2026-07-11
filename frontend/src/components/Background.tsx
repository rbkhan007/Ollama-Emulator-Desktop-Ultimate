"use client";

import { useEffect, useRef, useState } from "react";

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  useEffect(() => {
    const check = () => {
      const t = document.documentElement.getAttribute("data-theme");
      setTheme(t === "light" ? "light" : "dark");
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

export function Particles({ count = 20 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animId: number | null = null;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; a: number; hue: number; sat: number; light: number }[] = [];

    const isDark = theme === "dark";

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < count; i++) {
      if (isDark) {
        // Dark: purple/pink particles (comic glow)
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -Math.random() * 0.4 - 0.1,
          r: Math.random() * 2 + 0.5,
          a: Math.random() * 0.4 + 0.1,
          hue: Math.random() * 60 + 240,
          sat: 70,
          light: 60,
        });
      } else {
        // Light: blue/teal water particles
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.15,
          r: Math.random() * 3 + 1,
          a: Math.random() * 0.15 + 0.05,
          hue: Math.random() * 40 + 180, // 180-220 = cyan/blue
          sat: 60,
          light: 65,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = canvas!.height + 10; p.x = Math.random() * canvas!.width; }
        if (p.y > canvas!.height + 10) { p.y = -10; p.x = Math.random() * canvas!.width; }
        if (p.x < -10) p.x = canvas!.width + 10;
        if (p.x > canvas!.width + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${p.light}%, ${p.a})`;
        ctx.fill();
      }
      if (!reduceMotion && !document.hidden) {
        animId = requestAnimationFrame(draw);
      } else {
        animId = null;
      }
    }

    function start() {
      if (animId === null && !reduceMotion && !document.hidden) {
        animId = requestAnimationFrame(draw);
      }
    }
    function stop() {
      if (animId !== null) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    }

    if (reduceMotion) {
      draw();
    } else {
      start();
    }

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [count, theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: theme === "dark" ? 0.5 : 0.35,
        contain: "strict",
      }}
    />
  );
}

export function GradientOrbs() {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, overflow: "hidden", contain: "strict" }}>
      <div className="orb-1" style={{
        position: "absolute", top: "-15%", right: "-10%", width: 500, height: 500,
        animation: "orbFloat1 20s ease-in-out infinite",
      }} />
      <div className="orb-2" style={{
        position: "absolute", bottom: "-10%", left: "-5%", width: 400, height: 400,
        animation: "orbFloat2 25s ease-in-out infinite",
      }} />
      <div className="orb-3" style={{
        position: "absolute", top: "40%", left: "50%", width: 350, height: 350,
        animation: "orbFloat3 18s ease-in-out infinite",
      }} />
    </div>
  );
}

export function WaterRipple() {
  return <div className="water-ripple" aria-hidden="true" />;
}

export function WaterCaustics() {
  return <div className="water-caustics" aria-hidden="true" />;
}

export function WaveOverlay() {
  return <div className="wave-overlay" aria-hidden="true" />;
}

export function ComicHalftone() {
  return <div className="comic-halftone" aria-hidden="true" />;
}

export function MeshGrid() {
  return (
    <svg
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, opacity: 0.04 }}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}
