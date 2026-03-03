"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronUp, Sparkles } from "lucide-react";
import Matter from "matter-js";

/* ─── ball definitions ─── */
const BALLS: { label: string; color: string; r: number }[] = [
  { label: "CUSTOM",    color: "#ff1a6c", r: 80 },
  { label: "ANIME",     color: "#a855f7", r: 95 },
  { label: "PREMIUM",   color: "#06b6d4", r: 70 },
  { label: "VINYL",     color: "#facc15", r: 65 },
  { label: "HOUSTON",   color: "#f97316", r: 85 },
  { label: "ITASHA",    color: "#ff1a6c", r: 100 },
  { label: "WRAPS",     color: "#ffffff", r: 85 },
  { label: "DESIGN",    color: "#ec4899", r: 75 },
  { label: "3M",        color: "#ef4444", r: 55 },
  { label: "AVERY",     color: "#a855f7", r: 65 },
  { label: "ART",       color: "#06b6d4", r: 60 },
  { label: "QUALITY",   color: "#facc15", r: 90 },
  { label: "PASSION",   color: "#f97316", r: 70 },
  { label: "CRAFT",     color: "#ec4899", r: 60 },
];

/**
 * Full-screen section placed at the BOTTOM of the page.
 * On first visit the page auto-scrolls here; user clicks "Enter Site" to scroll up.
 * Balls have real gravity, collide, and are draggable.
 */
export default function PhysicsBallsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const renderLoopRef = useRef<number>(0);
  const bodiesRef = useRef<Matter.Body[]>([]);
  const initRef = useRef(false);

  /* ─── scroll to top ─── */
  const enterSite = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /* ─── auto-scroll to this section on first visit ─── */
  useEffect(() => {
    if (sessionStorage.getItem("xpress-entered")) return;
    // Wait for layout then scroll to bottom
    const raf = requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({ behavior: "instant" as ScrollBehavior });
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ─── mark "entered" when user scrolls away from this section ─── */
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      // If the section is mostly off-screen below, mark as entered
      if (rect.top > window.innerHeight * 0.5) {
        sessionStorage.setItem("xpress-entered", "1");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ─── Matter.js physics ─── */
  useEffect(() => {
    if (initRef.current || !canvasRef.current || !sectionRef.current) return;
    initRef.current = true;

    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const W = section.clientWidth;
    const H = section.clientHeight;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;

    // Hi-DPI canvas
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.scale(dpr, dpr);

    // Engine
    const engine = Matter.Engine.create({ gravity: { x: 0, y: 1.4 } });
    engineRef.current = engine;

    // Walls
    const wallT = 60;
    const wallOpts = { isStatic: true, restitution: 0.4, friction: 0.1 } as const;
    Matter.Composite.add(engine.world, [
      Matter.Bodies.rectangle(W / 2, H + wallT / 2, W + 200, wallT, wallOpts),  // floor
      Matter.Bodies.rectangle(-wallT / 2, H / 2, wallT, H * 3, wallOpts),       // left
      Matter.Bodies.rectangle(W + wallT / 2, H / 2, wallT, H * 3, wallOpts),    // right
    ]);

    // Scale balls for viewport
    const scale = Math.min(W, H) / 850;

    // Create circles — spawn scattered above so they fall in naturally
    const bodies = BALLS.map((b, i) => {
      const r = Math.max(25, b.r * scale);
      const x = W * 0.08 + Math.random() * W * 0.84;
      const y = -r * 2 - i * 55 - Math.random() * 80;
      const body = Matter.Bodies.circle(x, y, r, {
        restitution: 0.55,
        friction: 0.08,
        frictionAir: 0.008,
        density: 0.0015,
        label: b.label,
      });
      (body as any)._color = b.color;
      (body as any)._radius = r;
      return body;
    });
    bodiesRef.current = bodies;
    Matter.Composite.add(engine.world, bodies);

    // Mouse constraint for drag
    const mouse = Matter.Mouse.create(canvas);
    // Correct mouse pixel ratio so coordinates match
    mouse.pixelRatio = dpr;
    const mc = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        damping: 0.1,
        render: { visible: false },
      },
    });
    Matter.Composite.add(engine.world, mc);

    // Keep mouse in sync with engine
    (engine.world as any).mouse = mouse;

    // Runner
    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    // Render loop
    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      for (const body of bodies) {
        const { x, y } = body.position;
        const angle = body.angle;
        const r = (body as any)._radius as number;
        const color = (body as any)._color as string;
        const label = body.label;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // Shadow
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.shadowBlur = 15;
        ctx.shadowOffsetY = 5;

        // Circle
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();

        // Reset shadow before text
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // Text label
        const fontSize = Math.max(11, r * 0.32);
        ctx.fillStyle =
          color === "#ffffff" || color === "#facc15" ? "#050508" : "#ffffff";
        ctx.font = `900 ${fontSize}px "Inter", "Helvetica Neue", Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, 0, 0);

        ctx.restore();
      }

      renderLoopRef.current = requestAnimationFrame(draw);
    };
    draw();

    // Resize handler
    const onResize = () => {
      const nW = section.clientWidth;
      const nH = section.clientHeight;
      canvas.width = nW * dpr;
      canvas.height = nH * dpr;
      canvas.style.width = nW + "px";
      canvas.style.height = nH + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(renderLoopRef.current);
      window.removeEventListener("resize", onResize);
      if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
      if (engineRef.current) Matter.Engine.clear(engineRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="very-bottom"
      className="relative h-screen w-full overflow-hidden bg-[#050508]"
    >
      {/* Big headline behind the balls */}
      <motion.div
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="text-center text-5xl font-black leading-[0.9] text-white/[0.07] sm:text-7xl md:text-[10rem] lg:text-[14rem]">
          XPRESS
          <br />
          SKINS
        </h2>
      </motion.div>

      {/* Physics canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{ touchAction: "none" }}
      />

      {/* "Enter Site" button — big, themed, scrolls to top */}
      <motion.button
        onClick={enterSite}
        className="absolute left-1/2 top-6 z-30 flex -translate-x-1/2 flex-col items-center gap-3 md:top-10"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="group relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-accent/60 bg-accent/10 shadow-[0_0_30px_rgba(255,26,108,0.3)] backdrop-blur-md transition-all hover:border-accent hover:bg-accent/20 hover:shadow-[0_0_50px_rgba(255,26,108,0.5)] md:h-24 md:w-24"
        >
          {/* Pulsing ring */}
          <span className="absolute inset-0 animate-ping rounded-full border border-accent/20" />
          <ChevronUp size={36} className="text-white transition-transform group-hover:-translate-y-1 md:h-10 md:w-10" />
        </motion.div>
        <span className="rounded-full border border-white/10 bg-white/5 px-5 py-1.5 text-[11px] font-bold uppercase tracking-[0.35em] text-white/90 backdrop-blur-sm transition-colors hover:bg-white/10">
          <Sparkles size={12} className="mb-0.5 mr-1.5 inline text-accent" />
          Enter Site
        </span>
      </motion.button>

      {/* Bottom tagline */}
      <div className="absolute bottom-6 left-0 right-0 z-20 text-center">
        <p className="text-[10px] uppercase tracking-[0.5em] text-white/25">
          Grab &amp; throw the balls &bull; Houston, TX
        </p>
      </div>
    </section>
  );
}
