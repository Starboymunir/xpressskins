"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

export function Preloader() {
  const [show, setShow] = useState(false);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("xs-loaded")) return;
    setShow(true);
    document.documentElement.style.overflow = "hidden";
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1500);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => { setShow(false); sessionStorage.setItem("xs-loaded", "1"); document.documentElement.style.overflow = ""; }, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-end justify-between bg-[#050507] p-6 text-white lg:p-10"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <motion.div className="absolute inset-0 flex items-center justify-center" exit={{ y: -80, opacity: 0 }} transition={{ duration: 0.6 }}>
            <span className="t-jp text-[26vw] leading-none text-white/[0.06]">痛車</span>
            <span className="absolute t-label text-white/60">Xpress Skins · Houston</span>
          </motion.div>
          <div className="t-label text-white/40">Loading the studio</div>
          <div className="t-display text-[clamp(4rem,14vw,11rem)] leading-none tabular-nums">{n}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
