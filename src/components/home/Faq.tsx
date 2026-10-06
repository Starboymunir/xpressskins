"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Rise } from "@/components/fx/Motion";

const QA = [
  ["How much does an itasha wrap cost?", "A full custom wrap on a mid-size car usually lands between $4,000 and $6,500 depending on the design tier and finish. Partials start around $1,200. The builder above uses the measured surface area of your exact vehicle, so the number you see there is close to the real one."],
  ["Can I use my own artwork or a commissioned piece?", "Yes. Send the files and we check resolution and licensing, then lay it out over your car's panel templates. If you want us to draw it, the artwork fee covers original work and revisions until you approve."],
  ["How long does it take?", "Pre-made designs ship in about a week. Semi-custom runs two weeks. Fully custom artwork takes three to five weeks, most of which is the drawing and your revisions. Printing and installation take a few days."],
  ["Does it damage the paint?", "No. Cast vinyl on factory paint protects it. Removal within the rated life leaves the paint as it was. Repainted or peeling surfaces are the exception, and we tell you before we wrap."],
  ["I'm not in Houston. Can you ship it?", "We ship printed wraps in reinforced tubes to all fifty states with panel-by-panel labelling, and we can recommend an installer near you. Many customers install hood and roof panels themselves."],
  ["How do payments work?", "Twenty-five percent starts the artwork, twenty-five percent when you approve the final design, and fifty percent to print and ship or install. Every milestone is visible in your customer portal."],
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative bg-[#0a0a0e] px-5 py-24 text-white lg:px-10 lg:py-36">
      <div className="mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="t-label text-white/40">08 — Questions</p>
          <h2 className="t-display mt-3 text-[clamp(2.2rem,5vw,4.6rem)] leading-[0.95]">Asked <span className="t-serif font-normal text-[var(--mag)]">every week.</span></h2>
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/60">Anything else, message the studio. A person answers, usually the same day.</p>
        </div>
        <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {QA.map(([q, a], i) => {
            const on = open === i;
            return (
              <Rise key={q} delay={i * 0.04}>
                <button onClick={() => setOpen(on ? null : i)} className="flex w-full items-start gap-6 py-6 text-left" aria-expanded={on}>
                  <span className="t-serif mt-1 text-xl text-white/35">0{i + 1}</span>
                  <span className={`t-display flex-1 text-xl transition-colors md:text-2xl ${on ? "text-white" : "text-white/80"}`}>{q}</span>
                  <motion.span animate={{ rotate: on ? 45 : 0 }} className="mt-1 text-white/60"><Plus size={20} /></motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                      <p className="pb-7 pl-12 text-[15px] leading-relaxed text-white/60 md:pl-14 md:text-base">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Rise>
            );
          })}
        </div>
      </div>
    </section>
  );
}
