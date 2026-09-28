"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { ItashaCar, CAR_PANELS, WRAP_DESIGNS, type CarPanelId } from "./ItashaCar";

const STATIONS = [
  { n: "01", kanji: "描", title: "Art", pay: "25% deposit", sfx: "カリカリ", desc: "Your artist sketches the concept on your exact car. Every draft lands in your portal." },
  { n: "02", kanji: "承", title: "Approve", pay: "25% on approval", sfx: "OK!!", desc: "Revisions until you say yes. Nothing prints without your sign-off." },
  { n: "03", kanji: "刷", title: "Print", pay: "", sfx: "ウィーン", desc: "Avery Dennison cast vinyl, UV laminated, colour-matched to the proof." },
  { n: "04", kanji: "貼", title: "Install", pay: "50% to ship or fit", sfx: "ドドン!", desc: "Fitted in Houston, or shipped nationwide in a reinforced tube." },
];

const ALL = new Set<CarPanelId>(CAR_PANELS.map((p) => p.id));
const TILTS = [-2, 1.5, -1, 2];

export function ProcessStory() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const carX = useTransform(scrollYProgress, [0.05, 0.95], ["0%", "100%"]);
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(3, Math.max(0, Math.floor((v - 0.02) * 4.2)))));
  const [reduced, setReduced] = useState(false);
  useEffect(() => setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);

  return (
    <section id="process" ref={ref} className="relative bg-[var(--ink)] text-white" style={{ height: reduced ? "auto" : "340vh" }}>
      <div className={`${reduced ? "py-24" : "sticky top-0 h-screen"} flex flex-col justify-center overflow-hidden`}>
        <div aria-hidden className="mg-speed absolute -inset-[30%] opacity-[0.18]" style={{ background: "repeating-conic-gradient(from 0deg at 50% 50%, #fff 0deg 0.5deg, transparent 0.5deg 6deg)" }} />
        <div aria-hidden className="xs-kanji pointer-events-none absolute -left-8 bottom-0 select-none text-[28vw] leading-none text-white opacity-[0.05]">{STATIONS[active].kanji}</div>

        <div className="relative mx-auto w-full max-w-[1500px] px-4 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="mg-title -skew-x-6 text-[clamp(2.6rem,7vw,6.5rem)]">
              <span className="block text-white">Four stations.</span>
              <span className="block text-[var(--cyan)]">Three payments.</span>
              <span className="mg-stroke-mag block">Zero surprises.</span>
            </h2>
            <div className="mg-bubble mg-label relative max-w-xs text-[11px] text-[var(--ink)]">Scroll → your car rolls through the shop. Every stop shows up live in your portal.</div>
          </div>

          {/* road */}
          <div className="relative mt-8 md:mt-12">
            <div className="absolute inset-x-0 top-[70%] h-4 border-y-4 border-white/70 bg-[repeating-linear-gradient(90deg,#fff_0_40px,transparent_40px_80px)] opacity-60" />
            <motion.div className="absolute left-0 top-[70%] h-4 bg-[var(--mag)]" style={{ width: carX }} />
            <div className="relative h-[110px] md:h-[170px]">
              <motion.div className="absolute top-0 w-[220px] md:w-[360px]" style={{ left: carX, x: "-100%" }}>
                {/* motion trails */}
                <div aria-hidden className="absolute -left-24 top-[45%] h-[3px] w-24 bg-white/70" />
                <div aria-hidden className="absolute -left-16 top-[60%] h-[3px] w-16 bg-[var(--cyan)]" />
                <div aria-hidden className="absolute -left-20 top-[30%] h-[3px] w-20 bg-[var(--mag)]" />
                <ItashaCar selected={ALL} design={WRAP_DESIGNS[active % WRAP_DESIGNS.length]} interactive={false} tone="ink" bold className="w-full drop-shadow-[6px_8px_0_#ff2fb3]" />
              </motion.div>
            </div>
          </div>

          {/* manga panels */}
          <ol className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
            {STATIONS.map((s, i) => {
              const on = i <= active;
              const now = i === active;
              return (
                <motion.li
                  key={s.n}
                  className={`relative border-[4px] border-white p-4 md:p-5 ${now ? "mg-shake" : ""}`}
                  animate={{ rotate: now ? 0 : TILTS[i], background: now ? "#ffe600" : on ? "#fffdf5" : "#08080a", color: on || now ? "#08080a" : "#ffffff", boxShadow: now ? "10px 10px 0 #ff2fb3" : "6px 6px 0 #ffffff" }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="flex items-start justify-between">
                    <span className="mg-title bg-[var(--ink)] px-1.5 text-sm text-[var(--yellow)]">{s.n}</span>
                    <span className="xs-kanji text-3xl leading-none">{s.kanji}</span>
                  </div>
                  <h3 className="mg-title mt-3 text-3xl md:text-5xl">{s.title}</h3>
                  <p className="mt-2 hidden text-[12px] leading-snug md:block" style={{ opacity: on ? 0.8 : 0.5 }}>{s.desc}</p>
                  {s.pay && (
                    <span className="mg-sticker mt-3 -rotate-2 bg-[var(--cyan)] text-[var(--ink)]">{s.pay}</span>
                  )}
                  {now && (
                    <motion.span
                      className="mg-title absolute -right-3 -top-6 text-3xl text-[var(--mag)] md:text-5xl"
                      style={{ WebkitTextStroke: "2px #08080a", paintOrder: "stroke fill", textShadow: "4px 4px 0 #08080a" }}
                      initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 8 }} transition={{ type: "spring", bounce: 0.6 }}
                    >
                      {s.sfx}
                    </motion.span>
                  )}
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
