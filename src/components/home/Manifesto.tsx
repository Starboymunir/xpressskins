"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Rise } from "@/components/fx/Motion";

const TEXT =
  "Itasha is not a sticker on a door. It is a love letter to a character, drawn across every curve of a car you already love. We do not sell templates. Every wrap starts as a blank canvas, gets sketched by an artist who watches the same shows you do, and gets printed on vinyl built to survive five Texas summers.";

function Word({ children, range, progress }: { children: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const y = useTransform(progress, range, [6, 0]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block will-change-[opacity,transform]">
      {children}&nbsp;
    </motion.span>
  );
}

const PILLARS = [
  { n: "01", t: "Original art", d: "Drawn from scratch for your vehicle. You see the sketches, you approve every revision." },
  { n: "02", t: "Printed in-house", d: "Avery Dennison and 3M cast vinyl, UV laminated, colour-matched to the proof you signed off." },
  { n: "03", t: "Installed or shipped", d: "Fitted in our Houston studio, or rolled into a reinforced tube and shipped to your installer." },
];

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.5"] });
  const words = TEXT.split(" ");

  return (
    <section className="relative bg-[#050507] px-5 py-28 text-white lg:px-10 lg:py-40">
      <div className="mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-[220px_1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="t-label text-white/40">01 — Why itasha</p>
          <p className="t-jp mt-4 text-5xl text-white/[0.08]">痛車とは</p>
        </div>
        <div>
          <p ref={ref} className="t-display max-w-5xl text-[clamp(1.7rem,3.8vw,3.6rem)] font-bold leading-[1.15] tracking-[-0.02em]">
            {words.map((w, i) => (
              <Word key={i} progress={scrollYProgress} range={[i / words.length, Math.min(1, (i + 1.5) / words.length)]}>{w}</Word>
            ))}
          </p>
          <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border hairline bg-white/[0.06] md:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Rise key={p.n} delay={i * 0.12} className="bg-[#0a0a0e] p-7 md:p-9">
                <p className="t-label text-[var(--mag)]">{p.n}</p>
                <h3 className="t-display mt-5 text-2xl">{p.t}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-white/60">{p.d}</p>
              </Rise>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
