"use client";

import { useRef, type MouseEvent } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { CountUp, Rise } from "@/components/fx/Motion";

const STATS = [
  { v: 500, s: "+", l: "vehicles wrapped" },
  { v: 65, s: "+", l: "builds photographed" },
  { v: 5, s: "", l: "years of itasha" },
  { v: 50, s: "", l: "states shipped to" },
];

const MATERIALS = [
  { logo: "", name: "Avery Dennison", line: "SW900 & MPI 1105 cast", spec: "Conformable cast film with Easy Apply RS. Our default for full wraps on complex curves." },
  { logo: "/brands/3m-logo.svg", name: "3M", line: "IJ180mC + 8518 laminate", spec: "Comply air-release adhesive, gloss UV laminate. Print-rated for 5 to 7 years outdoors." },
  { logo: "/brands/arlon-logo.svg", name: "Arlon", line: "SLX+ cast", spec: "Used for deep recesses and partials where we need the extra stretch without colour shift." },
];

function Tilt({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0); const ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 150, damping: 18 }); const sy = useSpring(ry, { stiffness: 150, damping: 18 });
  const glow = useTransform([sx, sy], ([a, b]) => `radial-gradient(400px circle at ${50 + (b as number) * 4}% ${50 - (a as number) * 4}%, rgba(255,47,160,.18), transparent 60%)`);
  const onMove = (e: MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    rx.set(((e.clientY - r.top) / r.height - 0.5) * -14); ry.set(((e.clientX - r.left) / r.width - 0.5) * 14);
  };
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={() => { rx.set(0); ry.set(0); }} style={{ rotateX: sx, rotateY: sy, transformStyle: "preserve-3d" }} className="relative rounded-2xl border hairline bg-[#0a0a0e] p-7 [perspective:1000px]">
      <motion.div className="pointer-events-none absolute inset-0 rounded-2xl" style={{ background: glow }} />
      <div className="relative" style={{ transform: "translateZ(30px)" }}>{children}</div>
    </motion.div>
  );
}

export function Proof() {
  return (
    <section className="relative bg-[#050507] px-5 py-24 text-white lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-px overflow-hidden rounded-2xl border hairline bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Rise key={s.l} delay={i * 0.08} className="bg-[#050507] p-8 lg:p-10">
              <p className="t-display text-[clamp(3rem,6vw,5.5rem)] leading-none"><CountUp to={s.v} suffix={s.s} /></p>
              <p className="t-label mt-4 text-white/45">{s.l}</p>
            </Rise>
          ))}
        </div>

        <div className="mt-28 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="t-label text-white/40">07 — Materials</p>
            <h2 className="t-display mt-3 text-[clamp(2.2rem,5vw,4.6rem)] leading-[0.95]">Cast vinyl only. <span className="t-serif font-normal text-[var(--mag)]">Nothing calendared.</span></h2>
          </div>
          <Rise className="max-w-sm text-[15px] leading-relaxed text-white/60">Cheap wraps shrink, crack and lift at the edges within a year. We print on the same films the OEM wrap shops use.</Rise>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {MATERIALS.map((m, i) => (
            <Rise key={m.name} delay={i * 0.1}>
              <Tilt>
                {m.logo ? (
                  <Image src={m.logo} alt={m.name} width={120} height={40} className="h-8 w-auto brightness-0 invert opacity-90" />
                ) : (
                  <span className="t-display inline-block border border-white/30 px-2 py-1 text-[11px] uppercase tracking-[0.2em] text-white/90">{m.name}</span>
                )}
                <p className="t-display mt-8 text-2xl">{m.name}</p>
                <p className="t-label mt-1 text-[var(--mag)]">{m.line}</p>
                <p className="mt-4 text-[14px] leading-relaxed text-white/60">{m.spec}</p>
              </Tilt>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}
