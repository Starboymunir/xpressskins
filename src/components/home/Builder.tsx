"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { vehicleDatabase, panelDefinitions, designTiers, finishOptions, installOptions, calculatePrice } from "@/data/vehicles";
import { driveImg, portfolioImages } from "@/data/assets";
import { Rise, SplitLines } from "@/components/fx/Motion";

const ALL = panelDefinitions.map((p) => p.id);
const COVERAGE = [
  { id: "full", label: "Full wrap", img: 12, panels: ALL },
  { id: "half", label: "Half wrap", img: 59, panels: ["hood", "roof", "front-bumper", "rear-bumper", "trunk", "front-fenders", "driver-front-door", "driver-rear-door", "quarter-panels"] },
  { id: "sides", label: "Sides only", img: 28, panels: ["driver-front-door", "passenger-front-door", "driver-rear-door", "passenger-rear-door", "quarter-panels", "front-fenders"] },
  { id: "hood", label: "Hood + roof", img: 37, panels: ["hood", "roof"] },
];

function latest(make: string, model: string) {
  return vehicleDatabase.filter((v) => v.make === make && v.model === model).sort((a, b) => b.year - a.year)[0];
}

export function Builder() {
  const [make, setMake] = useState("Honda");
  const [model, setModel] = useState("Civic");
  const [cov, setCov] = useState(COVERAGE[0]);
  const [tier, setTier] = useState(designTiers[1]);
  const [finish, setFinish] = useState(finishOptions[0]);
  const [install, setInstall] = useState(installOptions[0]);

  const makes = useMemo(() => Array.from(new Set(vehicleDatabase.map((v) => v.make))).sort(), []);
  const models = useMemo(() => Array.from(new Set(vehicleDatabase.filter((v) => v.make === make).map((v) => v.model))).sort(), [make]);
  const vehicle = useMemo(() => latest(make, model), [make, model]);
  const sqft = vehicle?.totalSqft ?? 245;
  const quote = useMemo(() => calculatePrice(sqft, cov.panels, tier.pricePerSqft, finish.priceAdd, install.price), [sqft, cov, tier, finish, install]);
  const pct = Math.round(cov.panels.reduce((s, id) => s + (panelDefinitions.find((p) => p.id === id)?.percentOfTotal ?? 0), 0) * 100);

  const mv = useMotionValue(quote.total);
  const spring = useSpring(mv, { stiffness: 90, damping: 20 });
  const price = useTransform(spring, (v) => `$${Math.round(v).toLocaleString()}`);
  useEffect(() => { mv.set(quote.total); }, [quote.total, mv]);

  const href = `/pricing?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&panels=${cov.panels.join(",")}&tier=${tier.id}&finish=${finish.id}&install=${install.id}`;
  const img = portfolioImages[cov.img];

  return (
    <section id="build" className="relative bg-[#050507] px-5 py-28 text-white lg:px-10 lg:py-40">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="t-label text-white/40">03 — Price it</p>
            <SplitLines className="t-display mt-3 text-[clamp(2.2rem,5.5vw,5.2rem)] leading-[0.95]" lines={["Sixty seconds", <>to a <span className="t-serif font-normal text-[var(--mag)]">real number.</span></>]} />
          </div>
          <Rise className="max-w-sm text-[15px] leading-relaxed text-white/60">Pricing runs on the measured surface area of your exact vehicle, not a guess. Change anything and watch it move.</Rise>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          {/* stage */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-[#0c0c10] sm:aspect-[4/3]">
              <AnimatePresence mode="popLayout">
                <motion.div key={cov.id} className="absolute inset-0" initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
                  <Image src={driveImg(img.id)} alt={img.alt} fill sizes="(max-width:1024px) 100vw, 55vw" className="object-cover" style={{ filter: finish.id === "matte" ? "saturate(.85) contrast(.95)" : finish.id === "satin" ? "saturate(.95)" : "none" }} />
                </motion.div>
              </AnimatePresence>
              {finish.id !== "matte" && (
                <motion.div aria-hidden className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent mix-blend-overlay" animate={{ x: ["-120%", "420%"] }} transition={{ duration: finish.id === "gloss" ? 4 : 7, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent" />
              <div className="absolute left-5 top-5 flex gap-2">
                <span className="rounded-full bg-black/50 px-3 py-1.5 t-label text-white/80 backdrop-blur">{cov.label}</span>
                <span className="rounded-full bg-black/50 px-3 py-1.5 t-label text-white/80 backdrop-blur">{finish.label}</span>
              </div>
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 sm:inset-x-8 sm:bottom-8">
                <div>
                  <p className="t-label text-white/60">Estimated total</p>
                  <motion.p className="t-display text-[clamp(3rem,7vw,6rem)] leading-none tabular-nums">{price}</motion.p>
                </div>
                <div className="t-label text-right text-white/60">
                  <p>{quote.coveredSqft} sq ft · {pct}%</p>
                  <p className="mt-1">{vehicle ? `${vehicle.year} ${make} ${model}` : ""}</p>
                </div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-xl border hairline bg-white/[0.06] t-label">
              {[["25%", "to start the art"], ["25%", "when you approve"], ["50%", "to print & ship"]].map(([a, b]) => (
                <div key={b} className="bg-[#0a0a0e] p-4"><p className="t-display text-2xl text-white">{a}</p><p className="mt-1 text-white/45">{b}</p></div>
              ))}
            </div>
          </div>

          {/* steps */}
          <div className="space-y-10">
            <Step n="01" title="Your vehicle" hint={vehicle ? `${vehicle.year} ${vehicle.trim} · ${sqft} sq ft of bodywork` : ""}>
              <div className="grid grid-cols-2 gap-3">
                <select className="sel" value={make} onChange={(e) => { const m = e.target.value; setMake(m); setModel(vehicleDatabase.find((v) => v.make === m)?.model ?? ""); }}>
                  {makes.map((m) => <option key={m}>{m}</option>)}
                </select>
                <select className="sel" value={model} onChange={(e) => setModel(e.target.value)}>
                  {models.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
            </Step>

            <Step n="02" title="Coverage">
              <div className="grid grid-cols-2 gap-3">
                {COVERAGE.map((c) => {
                  const on = c.id === cov.id;
                  return (
                    <button key={c.id} onClick={() => setCov(c)} className={`group relative overflow-hidden rounded-xl border text-left transition-colors ${on ? "border-[var(--mag)]" : "border-white/10 hover:border-white/30"}`}>
                      <div className="relative aspect-[16/10]">
                        <Image src={driveImg(portfolioImages[c.img].id)} alt="" fill sizes="25vw" className={`object-cover transition-all duration-700 ${on ? "" : "opacity-60 grayscale group-hover:opacity-80 group-hover:grayscale-0"}`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between">
                          <span className="t-display text-base">{c.label}</span>
                          <span className={`flex h-6 w-6 items-center justify-center rounded-full ${on ? "bg-[var(--mag)]" : "border border-white/30"}`}>{on && <Check size={12} />}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Step>

            <Step n="03" title="Design tier">
              <div className="divide-y divide-white/[0.08] overflow-hidden rounded-xl border hairline">
                {designTiers.map((t) => {
                  const on = t.id === tier.id;
                  return (
                    <button key={t.id} onClick={() => setTier(t)} className={`flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors ${on ? "bg-white text-[#050507]" : "hover:bg-white/[0.04]"}`}>
                      <div>
                        <p className="t-display text-lg">{t.label}</p>
                        <p className={`mt-0.5 text-[13px] ${on ? "text-black/60" : "text-white/50"}`}>{t.description} · {t.turnaround}</p>
                      </div>
                      <span className="t-display shrink-0 text-xl">${t.pricePerSqft}<span className="text-xs opacity-60">/sqft</span></span>
                    </button>
                  );
                })}
              </div>
            </Step>

            <div className="grid gap-10 sm:grid-cols-2">
              <Step n="04" title="Finish">
                <div className="flex gap-2">
                  {finishOptions.map((f) => (
                    <button key={f.id} onClick={() => setFinish(f)} className={`flex-1 rounded-full border px-3 py-3 t-label transition-colors ${f.id === finish.id ? "border-white bg-white text-[#050507]" : "border-white/15 text-white/70 hover:border-white/40"}`}>{f.label.replace("High ", "")}</button>
                  ))}
                </div>
              </Step>
              <Step n="05" title="Install">
                <select className="sel" value={install.id} onChange={(e) => setInstall(installOptions.find((i) => i.id === e.target.value) ?? installOptions[0])}>
                  {installOptions.map((i) => <option key={i.id} value={i.id}>{i.label}{i.price ? ` · $${i.price}` : ""}</option>)}
                </select>
              </Step>
            </div>

            <div className="rounded-2xl border hairline bg-[#0a0a0e] p-6">
              <dl className="grid grid-cols-3 gap-4 t-label">
                <div><dt className="text-white/40">Vinyl + art</dt><dd className="t-display mt-1 text-xl text-white">${quote.subtotal.toLocaleString()}</dd></div>
                <div><dt className="text-white/40">Install</dt><dd className="t-display mt-1 text-xl text-white">{install.price ? `$${install.price}` : "DIY"}</dd></div>
                <div><dt className="text-white/40">Design fee</dt><dd className="t-display mt-1 text-xl text-white">${quote.designFee}</dd></div>
              </dl>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href={href} className="btn-pill btn-pill-accent flex-1"><span className="btn-pill-txt">Continue to full quote <ArrowRight size={14} /></span></Link>
                <Link href="/contact" className="btn-pill btn-pill-ghost"><span className="btn-pill-txt">Ask a human</span></Link>
              </div>
              <p className="mt-4 text-[12px] leading-relaxed text-white/40">Estimate only. The full quote confirms year and trim, and you can pay the 25% deposit online to start the artwork.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({ n, title, hint, children }: { n: string; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <Rise>
      <div className="mb-4 flex items-baseline gap-4">
        <span className="t-label text-[var(--mag)]">{n}</span>
        <h3 className="t-display text-xl">{title}</h3>
        {hint && <span className="t-label ml-auto hidden text-white/35 sm:inline">{hint}</span>}
      </div>
      {children}
    </Rise>
  );
}
