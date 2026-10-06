"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SplitLines, PillLink, Rise } from "@/components/fx/Motion";
import { driveImg, portfolioImages } from "@/data/assets";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const radius = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const fade = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const dim = useTransform(scrollYProgress, [0, 1], [0, 0.6]);

  return (
    <section ref={ref} id="top" className="relative h-[125vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div className="absolute inset-0 overflow-hidden bg-black" style={{ scale, borderRadius: radius }}>
          <video autoPlay muted loop playsInline poster={driveImg(portfolioImages[11].id)} className="h-full w-full object-cover">
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/20 to-[#050507]/40" />
          <div className="vignette absolute inset-0" />
          <motion.div className="absolute inset-0 bg-[#050507]" style={{ opacity: dim }} />
        </motion.div>

        <motion.div style={{ y, opacity: fade }} className="relative z-10 flex h-full flex-col justify-between px-5 pb-8 pt-28 text-white lg:px-10 lg:pb-10">
          <Rise delay={0.6} className="flex items-center gap-4 t-label text-white/70">
            <span className="h-px w-10 shrink-0 bg-[var(--mag)]" /> <span className="hidden sm:inline">Custom itasha wraps · Houston, TX</span><span className="sm:hidden">Itasha wraps · Houston</span>
          </Rise>

          <div>
            <SplitLines
              as="h1"
              delay={0.7}
              className="t-display text-[clamp(3.4rem,10vw,10.5rem)] leading-[0.88] tracking-[-0.045em]"
              lines={[
                "Your car.",
                <>Your <span className="t-serif font-normal tracking-normal text-[var(--mag)]">anime.</span></>,
                <>Your story<span className="text-[var(--mag)]">.</span></>,
              ]}
            />
            <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <Rise delay={1.1} className="max-w-md text-[15px] leading-relaxed text-white/70 md:text-base">
                Original artwork drawn for one car only, printed on Avery Dennison cast vinyl, installed in our Houston studio or shipped anywhere in the United States.
              </Rise>
              <Rise delay={1.2} className="flex flex-wrap items-center gap-3">
                <PillLink href="#build" variant="light">Price my wrap</PillLink>
                <PillLink href="#film" variant="ghost">Watch the reel</PillLink>
              </Rise>
            </div>
          </div>

          <Rise delay={1.4} className="flex items-end justify-between t-label text-white/45">
            <div className="hidden gap-10 md:flex">
              <span>Est. 2020</span><span>29.76° N · 95.37° W</span><span>Design · print · install</span>
            </div>
            <span className="flex items-center gap-3">Scroll <span className="relative h-10 w-px overflow-hidden bg-white/20"><motion.span className="absolute left-0 top-0 h-4 w-px bg-white" animate={{ y: [-16, 40] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} /></span></span>
          </Rise>
        </motion.div>
      </div>
    </section>
  );
}
