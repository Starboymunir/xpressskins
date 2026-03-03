"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Cinematic full-screen intro overlay.
 * Plays once per browser session (sessionStorage flag).
 * Text fades/staggers in, then the whole overlay lifts away.
 */
export default function IntroAnimation() {
  const [show, setShow] = useState(false); // true = overlay visible
  const [phase, setPhase] = useState<"text" | "exit">("text");

  useEffect(() => {
    // Only play once per session
    if (sessionStorage.getItem("xpress-intro-seen")) return;
    sessionStorage.setItem("xpress-intro-seen", "1");

    // Lock scrolling while overlay is visible
    document.body.style.overflow = "hidden";
    setShow(true);

    // After text animation completes, trigger exit
    const exitTimer = setTimeout(() => setPhase("exit"), 2800);

    // After exit animation, unmount and restore scroll
    const hideTimer = setTimeout(() => {
      setShow(false);
      document.body.style.overflow = "";
    }, 3800);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (!show) return null;

  const topLine = "XPRESS SKINS";
  const bottomLine = "CUSTOM ITASHA WRAPS";

  // Split into individual characters for stagger
  const topChars = topLine.split("");
  const bottomChars = bottomLine.split("");

  return (
    <AnimatePresence>
      {phase !== "exit" ? null : null}
      <motion.div
        key="intro-overlay"
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050508]"
        initial={false}
        animate={phase === "exit" ? { y: "-100%" } : { y: 0 }}
        transition={
          phase === "exit"
            ? { duration: 0.9, ease: [0.76, 0, 0.24, 1] }
            : undefined
        }
      >
        {/* Subtle radial glow behind text */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,26,108,0.06)_0%,transparent_70%)]" />

        {/* Top line — large spaced letters */}
        <div className="relative mb-3 flex items-center justify-center overflow-hidden">
          {topChars.map((char, i) => (
            <motion.span
              key={`top-${i}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3 + i * 0.06,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block text-3xl font-black tracking-[0.35em] text-white sm:text-5xl md:text-7xl"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </div>

        {/* Bottom line — smaller subtitle */}
        <div className="relative flex items-center justify-center overflow-hidden">
          {bottomChars.map((char, i) => (
            <motion.span
              key={`bot-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.2 + i * 0.03,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block text-xs tracking-[0.4em] text-white/50 sm:text-sm md:text-base"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </div>

        {/* Accent line that grows under the text */}
        <motion.div
          className="mt-6 h-[2px] rounded-full bg-gradient-to-r from-accent via-accent2 to-accent3"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 120, opacity: 1 }}
          transition={{ delay: 2.0, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* "Houston, TX" tag */}
        <motion.p
          className="mt-4 text-[10px] uppercase tracking-[0.5em] text-white/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.4 }}
        >
          Houston, TX
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}
