"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { SplitLines, PillLink, Rise } from "@/components/fx/Motion";
import { driveImg, portfolioImages } from "@/data/assets";

export function FinalCta() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const kanji = useTransform(scrollYProgress, [0, 1], ["10%", "-30%"]);

  return (
    <section ref={ref} className="relative flex min-h-[110vh] items-center overflow-hidden bg-[#050507] text-white">
      <motion.div style={{ y }} className="absolute -inset-y-[12%] inset-x-0">
        <Image src={driveImg(portfolioImages[13].id)} alt="" fill sizes="100vw" className="object-cover opacity-60" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#050507] via-[#050507]/40 to-[#050507]" />
      <motion.span aria-hidden style={{ x: kanji }} className="t-jp pointer-events-none absolute bottom-0 left-0 whitespace-nowrap text-[30vw] leading-none text-white/[0.05]">痛車文化</motion.span>

      <div className="relative mx-auto w-full max-w-[1600px] px-5 py-32 lg:px-10">
        <p className="t-label text-white/50">09 — Start</p>
        <SplitLines as="h2" className="t-display mt-4 text-[clamp(3rem,9vw,9rem)] leading-[0.9] tracking-[-0.04em]" lines={["Ready to", <>turn <span className="t-serif font-normal text-[var(--mag)]">heads?</span></>]} />
        <Rise delay={0.3} className="mt-10 flex flex-wrap items-center gap-4">
          <PillLink href="#build" variant="light">Price my wrap</PillLink>
          <PillLink href="/contact" variant="ghost">Talk to the studio</PillLink>
        </Rise>
        <Rise delay={0.45} className="mt-16 flex flex-wrap gap-x-10 gap-y-2 t-label text-white/45">
          <span>Houston, TX</span><span>Ships to all 50 states</span><span>25 / 25 / 50 payments</span>
        </Rise>
      </div>
    </section>
  );
}
