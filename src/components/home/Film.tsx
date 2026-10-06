"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play } from "lucide-react";
import { videoAssets } from "@/data/assets";
import { PillLink } from "@/components/fx/Motion";

export function Film() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.45], [0.72, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.45], [48, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section ref={ref} id="film" className="relative bg-[#050507] py-24 text-white lg:py-36">
      <div className="mb-10 flex items-end justify-between px-5 lg:px-10">
        <div>
          <p className="t-label text-white/40">05 — Behind the scenes</p>
          <h2 className="t-display mt-3 text-[clamp(2.2rem,5vw,4.6rem)] leading-[0.95]">Shot in the <span className="t-serif font-normal text-[var(--mag)]">Houston studio.</span></h2>
        </div>
        <PillLink href="https://www.youtube.com/@XpressSkins" variant="ghost" className="hidden md:inline-block">Full reel on YouTube</PillLink>
      </div>

      <motion.div style={{ scale, borderRadius: radius }} className="relative mx-auto aspect-video w-full overflow-hidden bg-black" data-cursor="play">
        <motion.video style={{ y }} autoPlay muted loop playsInline className="h-[120%] w-full object-cover">
          <source src="/hero-video.mp4" type="video/mp4" />
        </motion.video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507]/80 via-transparent to-transparent" />
        <a href="https://www.youtube.com/@XpressSkins" target="_blank" rel="noreferrer" className="absolute inset-0 flex items-center justify-center" aria-label="Watch on YouTube">
          <span className="flex h-20 w-20 items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur transition-transform hover:scale-110"><Play className="ml-1 fill-white" /></span>
        </a>
        <div className="absolute inset-x-6 bottom-6 flex flex-wrap items-center gap-3 lg:inset-x-10 lg:bottom-10">
          {videoAssets.slice(0, 5).map((v) => (
            <span key={v.id} className="rounded-full border border-white/20 bg-black/40 px-3 py-1.5 t-label text-white/75 backdrop-blur">{v.title}</span>
          ))}
          <span className="t-label text-white/40">+ 80 more</span>
        </div>
      </motion.div>
    </section>
  );
}
