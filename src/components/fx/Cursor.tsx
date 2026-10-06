"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Custom cursor: a tiny dot that tracks exactly, and a lagging ring that grows
 * and shows a label over elements carrying data-cursor="view|drag|play".
 */
export function Cursor() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const rx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });
  const [label, setLabel] = useState<string | null>(null);
  const [hot, setHot] = useState(false);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setOn(true);
    document.documentElement.classList.add("has-cursor");
    const move = (e: MouseEvent) => {
      x.set(e.clientX); y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      const tagged = t?.closest("[data-cursor]") as HTMLElement | null;
      setLabel(tagged?.dataset.cursor ?? null);
      setHot(!!t?.closest("a, button, select, [role='button'], label, input"));
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => { window.removeEventListener("mousemove", move); document.documentElement.classList.remove("has-cursor"); };
  }, [x, y]);

  if (!on) return null;
  const big = !!label;
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998] flex items-center justify-center rounded-full border border-white/70 text-[10px] font-semibold uppercase tracking-[0.2em] text-black mix-blend-difference"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{ width: big ? 88 : hot ? 44 : 28, height: big ? 88 : hot ? 44 : 28, backgroundColor: big ? "rgba(255,255,255,1)" : "rgba(255,255,255,0)" }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        {label}
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-white mix-blend-difference"
        style={{ x, y, translateX: "-50%", translateY: "-50%", opacity: big ? 0 : 1 }}
      />
    </>
  );
}
