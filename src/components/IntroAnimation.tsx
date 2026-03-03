"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Matter from "matter-js";

/* ─── ball data ─── */
const BALLS: { label: string; color: string; r: number }[] = [
  { label: "CUSTOM",    color: "#ff1a6c", r: 80 },
  { label: "ANIME",     color: "#a855f7", r: 90 },
  { label: "PREMIUM",   color: "#06b6d4", r: 75 },
  { label: "VINYL",     color: "#facc15", r: 70 },
  { label: "HOUSTON",   color: "#f97316", r: 85 },
  { label: "ITASHA",    color: "#ff1a6c", r: 95 },
  { label: "WRAPS",     color: "#ffffff", r: 80 },
  { label: "DESIGN",    color: "#ec4899", r: 70 },
  { label: "3M",        color: "#ef4444", r: 55 },
  { label: "AVERY",     color: "#a855f7", r: 65 },
  { label: "ART",       color: "#06b6d4", r: 60 },
  { label: "QUALITY",   color: "#facc15", r: 85 },
  { label: "PASSION",   color: "#f97316", r: 70 },
  { label: "CRAFT",     color: "#ec4899", r: 65 },
];

/**
 * Cinematic intro:  Phase 1 → text reveal  |  Phase 2 → physics balls  |  Phase 3 → exit
 * Plays once per browser session.
 */
export default function IntroAnimation() {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<"text" | "balls" | "exit">("text");
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const renderLoopRef = useRef<number>(0);
  const mouseConstraintRef = useRef<Matter.MouseConstraint | null>(null);

  /* ─── cleanup helper ─── */
  const cleanup = useCallback(() => {
    cancelAnimationFrame(renderLoopRef.current);
    if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
    if (engineRef.current) Matter.Engine.clear(engineRef.current);
    engineRef.current = null;
    runnerRef.current = null;
  }, []);

  /* ─── lifecycle: show once per session ─── */
  useEffect(() => {
    if (sessionStorage.getItem("xpress-intro-seen")) return;
    sessionStorage.setItem("xpress-intro-seen", "1");
    document.body.style.overflow = "hidden";
    setShow(true);
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* ─── phase timers ─── */
  useEffect(() => {
    if (!show) return;
    // text → balls after 2.6s
    const t1 = setTimeout(() => setPhase("balls"), 2600);
    // balls → exit after 7.5s total
    const t2 = setTimeout(() => setPhase("exit"), 7500);
    // unmount after exit anim
    const t3 = setTimeout(() => {
      setShow(false);
      cleanup();
      document.body.style.overflow = "";
    }, 8400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [show, cleanup]);

  /* ─── Matter.js physics scene ─── */
  useEffect(() => {
    if (phase !== "balls" || !sceneRef.current || !canvasRef.current) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    const canvas = canvasRef.current;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    // Engine
    const engine = Matter.Engine.create({ gravity: { x: 0, y: 1.2 } });
    engineRef.current = engine;

    // Walls (invisible)
    const wallOpts = { isStatic: true, restitution: 0.5, friction: 0.1 } as const;
    const walls = [
      Matter.Bodies.rectangle(W / 2, H + 30, W + 100, 60, wallOpts),   // floor
      Matter.Bodies.rectangle(W / 2, -30, W + 100, 60, wallOpts),      // ceiling
      Matter.Bodies.rectangle(-30, H / 2, 60, H + 100, wallOpts),      // left
      Matter.Bodies.rectangle(W + 30, H / 2, 60, H + 100, wallOpts),   // right
    ];
    Matter.Composite.add(engine.world, walls);

    // Scale ball radii for viewport
    const scale = Math.min(W, H) / 900;

    // Create circles — spawn above viewport so they fall in
    const bodies = BALLS.map((b, i) => {
      const r = b.r * scale;
      const x = (W * 0.1) + Math.random() * (W * 0.8);
      const y = -100 - i * 60 - Math.random() * 100;
      const body = Matter.Bodies.circle(x, y, r, {
        restitution: 0.6,
        friction: 0.05,
        frictionAir: 0.01,
        density: 0.002,
        label: b.label,
        render: { fillStyle: b.color },
      });
      (body as any)._color = b.color;
      (body as any)._radius = r;
      return body;
    });
    Matter.Composite.add(engine.world, bodies);

    // Mouse interaction for dragging
    const mouse = Matter.Mouse.create(canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    Matter.Composite.add(engine.world, mouseConstraint);
    mouseConstraintRef.current = mouseConstraint;

    // Fix for hi-dpi / CSS scaling
    mouse.pixelRatio = window.devicePixelRatio || 1;

    // Runner
    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    // Custom canvas render loop
    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      for (const body of bodies) {
        const { x, y } = body.position;
        const r = (body as any)._radius as number;
        const color = (body as any)._color as string;
        const label = body.label;

        // Circle
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();

        // Text
        const fontSize = Math.max(10, r * 0.35);
        ctx.fillStyle = color === "#ffffff" || color === "#facc15" ? "#050508" : "#ffffff";
        ctx.font = `900 ${fontSize}px "Inter", "Helvetica Neue", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, x, y);
        ctx.restore();
      }

      renderLoopRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(renderLoopRef.current);
    };
  }, [phase]);

  if (!show) return null;

  const topLine = "XPRESS SKINS";
  const bottomLine = "CUSTOM ITASHA WRAPS";
  const topChars = topLine.split("");
  const bottomChars = bottomLine.split("");

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[#050508]"
      animate={phase === "exit" ? { opacity: 0 } : { opacity: 1 }}
      transition={phase === "exit" ? { duration: 0.8, ease: [0.76, 0, 0.24, 1] } : undefined}
    >
      {/* ── Phase 1: Text reveal ── */}
      {phase === "text" && (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,26,108,0.06)_0%,transparent_70%)]" />

          <div className="relative mb-3 flex items-center justify-center overflow-hidden">
            {topChars.map((char, i) => (
              <motion.span
                key={`top-${i}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block text-3xl font-black tracking-[0.35em] text-white sm:text-5xl md:text-7xl"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </div>

          <div className="relative flex items-center justify-center overflow-hidden">
            {bottomChars.map((char, i) => (
              <motion.span
                key={`bot-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.03, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block text-xs tracking-[0.4em] text-white/50 sm:text-sm md:text-base"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </div>

          <motion.div
            className="mt-6 h-[2px] rounded-full bg-gradient-to-r from-accent via-accent2 to-accent3"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 120, opacity: 1 }}
            transition={{ delay: 2.0, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.p
            className="mt-4 text-[10px] uppercase tracking-[0.5em] text-white/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.3 }}
          >
            Houston, TX
          </motion.p>
        </div>
      )}

      {/* ── Phase 2: Physics balls ── */}
      {(phase === "balls" || phase === "exit") && (
        <div ref={sceneRef} className="relative h-full w-full">
          {/* Big headline behind the balls */}
          <motion.h2
            className="pointer-events-none absolute inset-0 flex items-center justify-center text-center text-5xl font-black leading-none text-white sm:text-7xl md:text-[9rem]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            XPRESS
            <br />
            SKINS
          </motion.h2>

          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing"
          />
        </div>
      )}
    </motion.div>
  );
}
