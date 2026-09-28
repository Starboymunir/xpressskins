"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/* ── Custom cursor: crosshair ring + dot, desktop only ── */
export function StudioCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40 });
  const sy = useSpring(y, { stiffness: 500, damping: 40 });
  const [on, setOn] = useState(false);
  const [hot, setHot] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setOn(true);
    const move = (e: MouseEvent) => {
      x.set(e.clientX); y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      setHot(!!t?.closest("a, button, select, path[role='button'], label"));
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (!on) return null;
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[var(--ink)] mix-blend-difference"
        style={{ x: sx, y: sy, borderColor: "#fff" }}
        animate={{ scale: hot ? 1.7 : 1, rotate: hot ? 45 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <span className="absolute left-1/2 top-0 h-2 w-[3px] -translate-x-1/2 bg-white" />
        <span className="absolute bottom-0 left-1/2 h-2 w-[3px] -translate-x-1/2 bg-white" />
        <span className="absolute left-0 top-1/2 h-[3px] w-2 -translate-y-1/2 bg-white" />
        <span className="absolute right-0 top-1/2 h-[3px] w-2 -translate-y-1/2 bg-white" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--mag)]"
        style={{ x, y }}
      />
    </>
  );
}

/* ── Crossing marquee bands ── */
export function MarqueeX({ items, className = "" }: { items: string[]; className?: string }) {
  const Track = ({ color, text }: { color: string; text: string }) => (
    <div className="mg-band" style={{ background: color, color: color === "var(--ink)" ? "#fff" : "var(--ink)" }}>
      {[0, 1].map((k) => (
        <div key={k} className="mg-band-track mg-title py-2 text-[2rem] md:text-[2.6rem]" aria-hidden={k === 1}>
          {items.map((t, i) => (
            <span key={i} className="flex items-center gap-10">
              {t}
              <span className="xs-kanji text-[1.6rem]">{text}</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
  return (
    <div className={`relative z-20 -my-6 overflow-hidden py-8 ${className}`}>
      <div className="-rotate-2 scale-x-110"><Track color="var(--mag)" text="痛車" /></div>
      <div className="mg-band-rev absolute inset-x-0 top-8 rotate-[2.5deg] scale-x-110"><Track color="var(--cyan)" text="文化" /></div>
    </div>
  );
}
