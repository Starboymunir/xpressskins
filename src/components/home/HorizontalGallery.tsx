"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { driveImg, portfolioImages } from "@/data/assets";
import { PillLink } from "@/components/fx/Motion";

const ITEMS = [
  { i: 11, title: "After dark", sub: "Full wrap · night reveal" },
  { i: 2, title: "Butterfly breath", sub: "Lexus RC · side & rear" },
  { i: 59, title: "Green hornet", sub: "Toyota GR86 · full wrap" },
  { i: 44, title: "Fleet, but make it anime", sub: "Transit van · commercial itasha" },
  { i: 31, title: "Hood story", sub: "Honda Accord · hood + sides" },
  { i: 7, title: "Golden hour", sub: "Lexus RC · rear quarter" },
  { i: 14, title: "Studio lights", sub: "Full wrap · detail" },
];

export function HorizontalGallery() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const [idx, setIdx] = useState(0);
  const [pinned, setPinned] = useState(true);

  useEffect(() => {
    const measure = () => {
      const wide = window.innerWidth >= 1024;
      setPinned(wide);
      if (trackRef.current) setDist(Math.max(0, trackRef.current.scrollWidth - window.innerWidth + 80));
    };
    measure(); window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  useMotionValueEvent(scrollYProgress, "change", (v) => setIdx(Math.min(ITEMS.length - 1, Math.floor(v * ITEMS.length))));

  return (
    <section ref={ref} id="work" className="relative bg-[#050507] text-white" style={{ height: pinned ? `${ITEMS.length * 60 + 100}vh` : "auto" }}>
      <div className={`${pinned ? "sticky top-0 h-screen" : ""} flex flex-col justify-center overflow-hidden py-16`}>
        <div className="mb-8 flex items-end justify-between px-5 lg:px-10">
          <div>
            <p className="t-label text-white/40">02 — Selected builds</p>
            <h2 className="t-display mt-3 text-[clamp(2.2rem,5vw,4.6rem)] leading-[0.95]">Real cars. <span className="t-serif font-normal text-[var(--mag)]">Real owners.</span></h2>
          </div>
          <div className="hidden items-center gap-6 lg:flex">
            <span className="t-display text-5xl tabular-nums">0{idx + 1}<span className="text-white/30"> / 0{ITEMS.length}</span></span>
            <PillLink href="/portfolio" variant="ghost">All {portfolioImages.length}+ builds</PillLink>
          </div>
        </div>

        <motion.div ref={trackRef} style={pinned ? { x } : undefined} className={`flex gap-5 px-5 lg:gap-8 lg:px-10 ${pinned ? "" : "snap-x snap-mandatory overflow-x-auto scrollbar-hide"}`}>
          {ITEMS.map((it, i) => {
            const img = portfolioImages[it.i];
            return (
              <Link
                key={it.i}
                href="/portfolio"
                data-cursor="view"
                className="group relative w-[78vw] shrink-0 snap-start sm:w-[52vw] lg:w-[30vw]"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#0c0c10]">
                  <Image src={driveImg(img.id)} alt={img.alt} fill sizes="(max-width:1024px) 80vw, 30vw" className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                  <span className="t-display absolute left-5 top-5 text-5xl text-white/80">0{i + 1}</span>
                  <span className="t-jp absolute right-5 top-5 text-lg text-[var(--mag)]">痛車</span>
                  <div className="absolute inset-x-5 bottom-5">
                    <p className="t-display text-2xl leading-tight">{it.title}</p>
                    <p className="t-label mt-2 text-white/55">{it.sub}</p>
                  </div>
                </div>
              </Link>
            );
          })}
          <div className="w-[10vw] shrink-0" />
        </motion.div>

        {pinned && (
          <div className="mx-10 mt-10 h-px bg-white/10">
            <motion.div className="h-px bg-[var(--mag)]" style={{ scaleX: scrollYProgress, transformOrigin: "0 50%" }} />
          </div>
        )}
        {!pinned && <div className="mt-8 px-5"><PillLink href="/portfolio" variant="ghost">All {portfolioImages.length}+ builds</PillLink></div>}
      </div>
    </section>
  );
}
