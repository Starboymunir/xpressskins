"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useScroll, useMotionValueEvent, useTransform } from "framer-motion";
import { driveImg, portfolioImages } from "@/data/assets";

const STEPS = [
  { n: "01", t: "Sketch", pay: "25% deposit", img: 41, body: "Tell us the character, the show, the mood. Your artist sketches the concept directly onto a render of your car. Every draft lands in your portal." },
  { n: "02", t: "Approve", pay: "25% on approval", img: 42, body: "Revisions until you say yes. We lay the final artwork over measured panel templates so nothing lands on a door handle." },
  { n: "03", t: "Print", pay: "", img: 43, body: "Printed on Avery Dennison or 3M cast vinyl in our own shop, then UV laminated. Five to seven years of Texas sun, rated." },
  { n: "04", t: "Install", pay: "50% to ship or fit", img: 11, body: "Fitted in the Houston studio in a day or two, or rolled into a reinforced tube and shipped to your installer anywhere in the US." },
];

export function Process() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(3, Math.floor(v * 4))));
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const s = STEPS[active];

  return (
    <section ref={ref} id="process" className="relative bg-[#0a0a0e] text-white" style={{ height: "420vh" }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden px-5 lg:px-10">
        <div className="mx-auto grid w-full max-w-[1600px] items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="relative">
            <p className="t-label text-white/40">04 — How it works</p>
            <div className="relative mt-6 h-[1.1em] text-[clamp(5rem,16vw,15rem)]">
              <AnimatePresence mode="popLayout">
                <motion.span key={s.n} className="t-display outline-text absolute left-0 top-0 leading-none" initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -60, opacity: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                  {s.n}
                </motion.span>
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={s.n} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                <h3 className="t-display text-[clamp(2.4rem,5vw,4.6rem)] leading-none">{s.t}<span className="text-[var(--mag)]">.</span></h3>
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/65 md:text-base">{s.body}</p>
                {s.pay && <p className="mt-5 inline-flex rounded-full border border-[var(--mag)]/50 px-4 py-2 t-label text-[var(--mag)]">{s.pay}</p>}
              </motion.div>
            </AnimatePresence>

            {/* payment track */}
            <div className="mt-12 max-w-md">
              <div className="flex justify-between t-label text-white/40"><span>Deposit</span><span>Approval</span><span>Delivery</span></div>
              <div className="relative mt-2 h-px bg-white/15">
                <motion.div className="absolute left-0 top-0 h-px bg-[var(--mag)]" style={{ width: bar }} />
                {[0, 25, 50, 100].map((p) => <span key={p} className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40" style={{ left: `${p}%` }} />)}
              </div>
              <div className="mt-2 flex justify-between t-label text-white/60"><span>25%</span><span>25%</span><span>50%</span></div>
            </div>
          </div>

          {/* image deck */}
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px]">
            {STEPS.map((st, i) => {
              const off = i - active;
              return (
                <motion.div
                  key={st.n}
                  className="absolute inset-0 overflow-hidden rounded-3xl bg-[#111117] shadow-2xl"
                  animate={{ y: off < 0 ? -40 : off * 22, scale: off < 0 ? 0.9 : 1 - off * 0.06, rotate: off < 0 ? -6 : off * 2.5, opacity: off < 0 ? 0 : 1 - off * 0.25, zIndex: 10 - Math.abs(off) }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image src={driveImg(portfolioImages[st.img].id)} alt={portfolioImages[st.img].alt} fill sizes="(max-width:1024px) 90vw, 40vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute left-5 top-5 rounded-full bg-black/50 px-3 py-1.5 t-label text-white/80 backdrop-blur">Step {st.n} · {st.t}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
