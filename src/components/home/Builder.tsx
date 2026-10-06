"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Check, RotateCw, Pause } from "lucide-react";
import { vehicleDatabase, panelDefinitions, designTiers, finishOptions, installOptions, calculatePrice } from "@/data/vehicles";
import { Rise, SplitLines } from "@/components/fx/Motion";
import { LIVERIES, PAINTS, type Coverage, type FinishId, type ViewId } from "./studioData";
import { resolveCar } from "@/lib/carIndex";

const BODY_LABEL: Record<string, string> = { sedan: "Sedan", coupe: "Coupe", sports: "Sports car", hatchback: "Hatchback", wagon: "Wagon", suv: "SUV", truck: "Pickup truck", van: "Van" };
const FINISH_NOTE: Record<string, string> = {
  gloss: "Mirror clearcoat. Sharp reflections slide across every panel.",
  satin: "Soft sheen. Highlights bloom wide instead of reflecting sharply.",
  matte: "Flat and velvety. Almost no reflection, colour reads deeper.",
};

const CarViewer = dynamic(() => import("./CarViewer"), { ssr: false, loading: () => <div className="absolute inset-0 grid place-items-center t-label text-white/50">Loading 3D studio</div> });

const ALL = panelDefinitions.map((p) => p.id);
const COVERAGE: { id: Coverage; label: string; jp: string; desc: string; panels: string[] }[] = [
  { id: "full", label: "Full wrap", jp: "全面", desc: "Every panel, art flows over the roof", panels: ALL },
  { id: "half", label: "Half wrap", jp: "片側", desc: "Driver side plus hood and roof", panels: ["hood", "roof", "front-bumper", "rear-bumper", "trunk", "front-fenders", "driver-front-door", "driver-rear-door", "quarter-panels"] },
  { id: "sides", label: "Sides only", jp: "側面", desc: "Doors, fenders and quarters", panels: ["driver-front-door", "passenger-front-door", "driver-rear-door", "passenger-rear-door", "quarter-panels", "front-fenders"] },
  { id: "hood", label: "Hood + roof", jp: "上面", desc: "Top surfaces, paint stays on the sides", panels: ["hood", "roof"] },
];
const VIEWS: { id: ViewId; label: string }[] = [
  { id: "front", label: "Front ¾" }, { id: "side", label: "Side" }, { id: "rear", label: "Rear ¾" }, { id: "top", label: "Top" },
];

function latest(make: string, model: string) {
  return vehicleDatabase.filter((v) => v.make === make && v.model === model).sort((a, b) => b.year - a.year)[0];
}

export function Builder() {
  const [make, setMake] = useState("Honda");
  const [model, setModel] = useState("Civic");
  const [cov, setCov] = useState(COVERAGE[0]);
  const [paint, setPaint] = useState(PAINTS[0].hex);
  const [livery, setLivery] = useState(LIVERIES[0].id);
  const [tier, setTier] = useState(designTiers[1]);
  const [finish, setFinish] = useState(finishOptions[0]);
  const [install, setInstall] = useState(installOptions[0]);
  const [view, setView] = useState<ViewId>("front");
  const [spin, setSpin] = useState(true);

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

  const car = useMemo(() => resolveCar(make, model, vehicle?.trim), [make, model, vehicle]);
  const art = LIVERIES.find((l) => l.id === livery) ?? LIVERIES[0];
  const href = `/pricing?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&panels=${cov.panels.join(",")}&tier=${tier.id}&finish=${finish.id}&install=${install.id}&paint=${encodeURIComponent(paint)}&art=${art.id}`;

  return (
    <section id="build" className="relative bg-[#050507] px-5 py-28 text-white lg:px-10 lg:py-40">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="t-label text-white/40">03 — Build it</p>
            <SplitLines className="t-display mt-3 text-[clamp(2.2rem,5.5vw,5.2rem)] leading-[0.95]" lines={["Spin it. Paint it.", <>Wrap it. <span className="t-serif font-normal text-[var(--mag)]">Price it.</span></>]} />
          </div>
          <Rise className="max-w-sm text-[15px] leading-relaxed text-white/60">A real-time 3D studio. Drag to turn the car, pick a paint, drop an artwork on it and watch the price move. Pricing uses the measured surface area of the vehicle you choose.</Rise>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
          {/* ── 3D stage ── */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-[#07070a] sm:aspect-[4/3]" data-cursor="drag" onPointerDown={() => { setView("free"); setSpin(false); }}>
              <CarViewer modelUrl={car.url} body={car.body} color={paint} livery={livery} coverage={cov.id} finish={finish.id as FinishId} view={view} autoRotate={spin} />

              {/* top chrome */}
              <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap gap-2 sm:left-6 sm:top-6">
                <span className="rounded-full bg-black/50 px-3 py-1.5 t-label text-white/80 backdrop-blur">{cov.label}</span>
                <span className="rounded-full bg-black/50 px-3 py-1.5 t-label text-white/80 backdrop-blur">{finish.label}</span>
                <span className="rounded-full bg-black/50 px-3 py-1.5 t-label text-white/80 backdrop-blur">{art.name}</span>
              </div>
              <div className="absolute right-4 top-4 flex gap-1 sm:right-6 sm:top-6">
                <button onClick={() => setSpin((s) => !s)} className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white/80 backdrop-blur transition-colors hover:bg-white hover:text-black" aria-label={spin ? "Pause rotation" : "Auto rotate"}>
                  {spin ? <Pause size={14} /> : <RotateCw size={14} />}
                </button>
              </div>

              {/* bottom: views + price */}
              <div className="pointer-events-none absolute inset-x-4 bottom-4 flex flex-col gap-4 sm:inset-x-6 sm:bottom-6">
                <div className="pointer-events-auto flex flex-wrap gap-1.5">
                  {VIEWS.map((v) => (
                    <button key={v.id} onClick={() => { setView(v.id); setSpin(false); }} className={`rounded-full px-3 py-1.5 t-label backdrop-blur transition-colors ${view === v.id ? "bg-white text-black" : "bg-black/50 text-white/70 hover:text-white"}`}>{v.label}</button>
                  ))}
                </div>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="t-label text-white/60">Estimated total</p>
                    <motion.p className="t-display text-[clamp(2.6rem,6vw,5.5rem)] leading-none tabular-nums drop-shadow-[0_4px_24px_rgba(0,0,0,.6)]">{price}</motion.p>
                  </div>
                  <div className="t-label text-right text-white/60">
                    <p>{quote.coveredSqft} sq ft · {pct}%</p>
                    <p className="mt-1">{vehicle ? `${vehicle.year} ${make} ${model}` : ""}</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-3 t-label text-white/35">
              {car.exact
                ? <>Showing a 3D {make} {model}{car.model ? <> · model by {car.model.author}, {car.model.license}</> : null}.</>
                : <>{BODY_LABEL[car.body]} · showing the closest body we have{car.model ? <> ({car.model.name} by {car.model.author})</> : <> (sports coupe by vicent091036)</>}. Your quote and artwork are laid out on your exact {make} {model}.</>}
            </p>
            <div className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-xl border hairline bg-white/[0.06] t-label">
              {[["25%", "to start the art"], ["25%", "when you approve"], ["50%", "to print & ship"]].map(([a, b]) => (
                <div key={b} className="bg-[#0a0a0e] p-4"><p className="t-display text-2xl text-white">{a}</p><p className="mt-1 text-white/45">{b}</p></div>
              ))}
            </div>
          </div>

          {/* ── controls ── */}
          <div className="space-y-10">
            <Step n="01" title="Your vehicle" hint={vehicle ? `${vehicle.year} ${vehicle.trim} · ${sqft} sq ft` : ""}>
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
                    <button key={c.id} onClick={() => setCov(c)} className={`flex items-start justify-between gap-3 rounded-xl border p-4 text-left transition-colors ${on ? "border-[var(--mag)] bg-[var(--mag)]/10" : "border-white/10 hover:border-white/30"}`}>
                      <div>
                        <p className="t-display text-base">{c.label}</p>
                        <p className="mt-1 text-[12px] leading-snug text-white/50">{c.desc}</p>
                      </div>
                      <span className="t-jp text-lg text-white/40">{c.jp}</span>
                    </button>
                  );
                })}
              </div>
            </Step>

            <Step n="03" title="Paint under the wrap" hint={paint.toUpperCase()}>
              <div className="flex flex-wrap items-center gap-2.5">
                {PAINTS.map((p) => (
                  <button key={p.id} onClick={() => setPaint(p.hex)} title={p.name} aria-label={p.name} className={`h-9 w-9 rounded-full border-2 transition-transform hover:scale-110 ${paint === p.hex ? "border-white" : "border-white/15"}`} style={{ background: p.hex }} />
                ))}
                <label className="relative ml-1 flex h-9 cursor-pointer items-center gap-2 rounded-full border border-white/15 px-3 t-label text-white/70 hover:border-white/40">
                  Custom
                  <input type="color" value={paint} onChange={(e) => setPaint(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0" aria-label="Custom paint colour" />
                </label>
              </div>
            </Step>

            <Step n="04" title="Artwork">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {LIVERIES.map((l) => {
                  const on = l.id === livery;
                  return (
                    <button key={l.id} onClick={() => setLivery(l.id)} className={`group relative aspect-[4/3] overflow-hidden rounded-xl border transition-colors ${on ? "border-[var(--mag)]" : "border-white/10 hover:border-white/30"}`}>
                      <Image src={l.src} alt={l.name} fill sizes="200px" className={`object-cover transition-transform duration-700 group-hover:scale-105 ${on ? "" : "opacity-70"}`} />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2.5 pb-2 pt-6">
                        <p className="t-label text-[10px] text-white">{l.name}</p>
                      </div>
                      {on && <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--mag)]"><Check size={11} /></span>}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-white/40">Sample artwork to show scale and placement. Your real design is drawn from scratch for your character and your car, or send us your own art.</p>
            </Step>

            <Step n="05" title="Design tier">
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
              <Step n="06" title="Finish">
                <div className="flex gap-2">
                  {finishOptions.map((f) => (
                    <button key={f.id} onClick={() => setFinish(f)} className={`flex-1 rounded-full border px-3 py-3 t-label transition-colors ${f.id === finish.id ? "border-white bg-white text-[#050507]" : "border-white/15 text-white/70 hover:border-white/40"}`}>{f.label.replace("High ", "")}</button>
                  ))}
                </div>
                <p className="mt-3 text-[12px] leading-relaxed text-white/45">{FINISH_NOTE[finish.id]}</p>
              </Step>
              <Step n="07" title="Install">
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
