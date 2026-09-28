"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { ItashaCar, CAR_PANELS, WRAP_DESIGNS, type CarPanelId } from "./ItashaCar";

const STATIONS = [
  { n: "01", kanji: "描", title: "Art", pay: "25% deposit", desc: "Your artist sketches the concept on your exact car. You see every draft in your portal." },
  { n: "02", kanji: "承", title: "Approve", pay: "25% on approval", desc: "Revisions until you say yes. Nothing prints without your sign-off." },
  { n: "03", kanji: "刷", title: "Print", pay: "", desc: "Avery Dennison cast vinyl, UV laminated. Colour-matched to the proof you approved." },
  { n: "04", kanji: "貼", title: "Install", pay: "50% to ship or install", desc: "Fitted in our Houston studio, or shipped nationwide in a reinforced tube for your installer." },
];

const ALL = new Set<CarPanelId>(CAR_PANELS.map((p) => p.id));

export function ProcessStory() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const carX = useTransform(scrollYProgress, [0.05, 0.95], ["0%", "100%"]);
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(3, Math.max(0, Math.floor((v - 0.02) * 4.2))));
  });
  const [reduced, setReduced] = useState(false);
  useEffect(() => setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);

  return (
    <section id="process" ref={ref} className="relative bg-[var(--ink)] text-[var(--paper)]" style={{ height: reduced ? "auto" : "320vh" }}>
      <div className={`${reduced ? "py-20" : "sticky top-0 h-screen"} flex flex-col justify-center overflow-hidden`}>
        <div className="mx-auto w-full max-w-[1400px] px-5 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--mag-hot)]">
                <span className="h-px w-8 bg-[var(--mag-hot)]" /> How it works
              </p>
              <h2 className="xs-display text-[clamp(1.8rem,4.2vw,3.6rem)]">
                Four stations.<br />Three payments.<br /><span className="text-[var(--mag-hot)]">Zero surprises.</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-[var(--paper)]/60">
              Scroll and your car rolls through the shop. Each stop is a step you can watch live in your customer portal.
            </p>
          </div>

          <div className="relative mt-8 md:mt-12">
            <div className="absolute left-0 right-0 top-[62%] h-px bg-[var(--paper)]/15" />
            <motion.div className="absolute left-0 top-[62%] h-px bg-[var(--mag-hot)]" style={{ width: carX }} />
            <div className="relative h-[110px] md:h-[170px]">
              <motion.div className="absolute top-0 w-[220px] md:w-[340px]" style={{ left: carX, x: "-100%" }}>
                <ItashaCar selected={ALL} design={WRAP_DESIGNS[active % WRAP_DESIGNS.length]} interactive={false} tone="ink" className="w-full" />
              </motion.div>
            </div>
          </div>

          <ol className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {STATIONS.map((s, i) => {
              const on = i <= active;
              const now = i === active;
              return (
                <li
                  key={s.n}
                  className="border p-4 transition-colors duration-500 md:p-5"
                  style={{
                    borderColor: now ? "var(--mag-hot)" : on ? "rgba(244,241,234,.35)" : "rgba(244,241,234,.12)",
                    background: now ? "rgba(226,63,192,.08)" : "transparent",
                  }}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: on ? "var(--mag-hot)" : "rgba(244,241,234,.4)" }}>{s.n}</span>
                    <span className="xs-kanji text-2xl leading-none" style={{ opacity: on ? 1 : 0.3 }}>{s.kanji}</span>
                  </div>
                  <h3 className="xs-display mt-3 text-lg md:text-2xl" style={{ opacity: on ? 1 : 0.45 }}>{s.title}</h3>
                  <p className="mt-2 hidden text-[13px] leading-relaxed text-[var(--paper)]/60 md:block">{s.desc}</p>
                  {s.pay && (
                    <span className="mt-3 inline-block rounded-[3px] bg-[var(--paper)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--ink)]" style={{ opacity: on ? 1 : 0.35 }}>
                      {s.pay}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
