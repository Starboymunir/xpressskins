"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Dices, Phone, RotateCcw } from "lucide-react";
import {
  vehicleDatabase, panelDefinitions, designTiers, finishOptions, installOptions,
  calculatePrice, getPanelSqft,
} from "@/data/vehicles";
import { ItashaCar, CAR_PANELS, WRAP_DESIGNS, type CarPanelId, type Finish } from "./ItashaCar";

const PRESETS: { id: string; label: string; panels: CarPanelId[] }[] = [
  { id: "full", label: "Full wrap", panels: CAR_PANELS.map((p) => p.id) },
  { id: "half", label: "Half wrap", panels: ["hood", "roof", "front-bumper", "rear-bumper", "trunk", "front-fenders", "front-door", "rear-door", "quarter-panels"] },
  { id: "sides", label: "Sides only", panels: ["front-door", "rear-door", "quarter-panels", "front-fenders"] },
  { id: "hood-roof", label: "Hood + roof", panels: ["hood", "roof"] },
];

const SFX_ON = ["ドン!", "バン!", "WRAP!", "ズバッ!", "キラッ✦", "GO!"];
const SFX_OFF = ["ペリッ", "OFF", "スッ", "NOPE"];
const SFX_COLORS = ["var(--mag)", "var(--cyan)", "var(--yellow)", "#fff"];

const DEFAULT_MAKE = "Honda";
const DEFAULT_MODEL = "Civic";

function latestVariant(make: string, model: string) {
  return vehicleDatabase.filter((v) => v.make === make && v.model === model).sort((a, b) => b.year - a.year)[0];
}

interface Burst { id: number; x: number; y: number; text: string; color: string; rot: number }

export function WrapStudio() {
  const [make, setMake] = useState(DEFAULT_MAKE);
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [selected, setSelected] = useState<Set<CarPanelId>>(() => new Set(PRESETS[1].panels));
  const [hovered, setHovered] = useState<CarPanelId | null>(null);
  const [designIdx, setDesignIdx] = useState(0);
  const [tierId, setTierId] = useState(designTiers[1].id);
  const [finishId, setFinishId] = useState<Finish>("gloss");
  const [installId, setInstallId] = useState(installOptions[0].id);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [kick, setKick] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);

  const makes = useMemo(() => Array.from(new Set(vehicleDatabase.map((v) => v.make))).sort(), []);
  const models = useMemo(() => Array.from(new Set(vehicleDatabase.filter((v) => v.make === make).map((v) => v.model))).sort(), [make]);
  const vehicle = useMemo(() => latestVariant(make, model), [make, model]);
  const totalSqft = vehicle?.totalSqft ?? 245;

  const tier = designTiers.find((t) => t.id === tierId) ?? designTiers[1];
  const finish = finishOptions.find((f) => f.id === finishId) ?? finishOptions[0];
  const install = installOptions.find((i) => i.id === installId) ?? installOptions[0];
  const design = WRAP_DESIGNS[designIdx];

  const priceIds = useMemo(() => CAR_PANELS.filter((p) => selected.has(p.id)).flatMap((p) => p.priceIds), [selected]);
  const quote = useMemo(() => calculatePrice(totalSqft, priceIds, tier.pricePerSqft, finish.priceAdd, install.price), [totalSqft, priceIds, tier, finish, install]);

  const mv = useMotionValue(quote.total);
  const spring = useSpring(mv, { stiffness: 140, damping: 18 });
  const priceText = useTransform(spring, (v) => `$${Math.round(v).toLocaleString()}`);
  useEffect(() => { mv.set(quote.total); }, [quote.total, mv]);

  /* mouse spotlight */
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const spot = useTransform([mx, my], ([a, b]) => `radial-gradient(360px circle at ${(a as number) * 100}% ${(b as number) * 100}%, rgba(255,230,0,.55), transparent 70%)`);

  const fire = (on: boolean, point?: { x: number; y: number }) => {
    const box = stageRef.current?.getBoundingClientRect();
    const x = point && box ? point.x - box.left : (box?.width ?? 400) / 2;
    const y = point && box ? point.y - box.top : (box?.height ?? 300) / 2;
    const id = Date.now() + Math.random();
    const pool = on ? SFX_ON : SFX_OFF;
    setBursts((b) => [...b, { id, x, y, text: pool[Math.floor(Math.random() * pool.length)], color: SFX_COLORS[Math.floor(Math.random() * SFX_COLORS.length)], rot: (Math.random() - 0.5) * 40 }]);
    setKick((k) => k + 1);
    setTimeout(() => setBursts((b) => b.filter((z) => z.id !== id)), 900);
  };

  const toggle = (id: CarPanelId, point?: { x: number; y: number }) => {
    setSelected((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
    fire(!selected.has(id), point);
  };
  const applyPreset = (panels: CarPanelId[]) => { setSelected(new Set(panels)); fire(true); };
  const activePreset = PRESETS.find((p) => p.panels.length === selected.size && p.panels.every((id) => selected.has(id)))?.id;

  const surprise = () => {
    setDesignIdx((i) => (i + 1 + Math.floor(Math.random() * (WRAP_DESIGNS.length - 1))) % WRAP_DESIGNS.length);
    setSelected(new Set(PRESETS[Math.floor(Math.random() * PRESETS.length)].panels));
    setTierId(designTiers[Math.floor(Math.random() * designTiers.length)].id);
    fire(true);
  };

  const hoveredPanel = CAR_PANELS.find((p) => p.id === hovered);
  const hoveredSqft = hoveredPanel ? getPanelSqft(totalSqft, hoveredPanel.priceIds) : 0;
  const hoveredCost = Math.round(hoveredSqft * (tier.pricePerSqft + finish.priceAdd));
  const coveragePct = Math.round(priceIds.reduce((s, id) => s + (panelDefinitions.find((p) => p.id === id)?.percentOfTotal ?? 0), 0) * 100);
  const quoteHref = `/pricing?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&panels=${priceIds.join(",")}&tier=${tier.id}&finish=${finish.id}&install=${install.id}`;

  return (
    <section
      id="studio"
      className="relative overflow-hidden pt-16"
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width); my.set((e.clientY - r.top) / r.height); }}
    >
      {/* screentone + speed lines + spotlight */}
      <div aria-hidden className="mg-tone mg-tone-fade absolute inset-0" />
      <div aria-hidden className="mg-speed mg-speed-mask absolute -inset-[20%]" />
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-multiply" style={{ background: spot }} />
      <div aria-hidden className="xs-kanji pointer-events-none absolute -right-10 -top-6 select-none text-[34vw] leading-none text-[var(--ink)] opacity-[0.06]">痛</div>

      {/* floating stickers */}
      <motion.div aria-hidden className="mg-burst mg-wobble absolute left-[44%] top-[7.5rem] z-10 hidden h-36 w-36 place-items-center bg-[var(--yellow)] text-center lg:grid" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.6 }}>
        <div className="mg-title -rotate-12 text-[var(--ink)]"><span className="block text-3xl leading-none">Live</span><span className="block text-xs">price!</span></div>
      </motion.div>

      <div className="relative mx-auto grid max-w-[1500px] grid-cols-1 gap-8 px-4 pb-20 pt-14 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:px-8 lg:pt-16">
        {/* ── Left ── */}
        <div className="flex min-w-0 flex-col">
          <motion.div initial={{ opacity: 0, x: -60, skewX: -12 }} animate={{ opacity: 1, x: 0, skewX: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="mg-sticker -rotate-2 bg-[var(--cyan)]">Houston TX</span>
              <span className="mg-sticker rotate-1">Itasha only</span>
              <span className="mg-sticker -rotate-1 bg-[var(--yellow)]">Ships nationwide</span>
            </div>
            <h1 className="mg-title -skew-x-6 text-[clamp(3.4rem,9vw,8.4rem)]">
              <span className="mg-stroke block">Wrap it</span>
              <span className="mg-stroke-mag mg-glitch block" data-text="Before">Before</span>
              <span className="block text-[var(--ink)]">you buy it.</span>
            </h1>
          </motion.div>

          {/* stage */}
          <motion.div
            ref={stageRef}
            className="relative mt-4 md:-mx-6 md:-mt-2"
            initial={{ opacity: 0, x: -200 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mg-bubble absolute left-2 top-2 z-20 w-max mg-label text-[10px] md:left-6 md:top-0">Tap a panel ↓ watch it wrap</div>
            <div aria-hidden className="absolute right-2 top-0 z-20 hidden md:block"><span className="mg-hanko rotate-12">認定<br />2020</span></div>
            <motion.div key={kick} animate={{ y: [0, -10, 0], rotate: [0, -1, 0] }} transition={{ duration: 0.35 }}>
              <ItashaCar
                selected={selected} hovered={hovered} onHover={setHovered} onToggle={toggle}
                design={design} finish={finishId} bold
                className="w-full drop-shadow-[10px_14px_0_rgba(8,8,10,1)]"
              />
            </motion.div>
            <AnimatePresence>
              {bursts.map((b) => (
                <motion.div
                  key={b.id}
                  className="mg-title pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2 text-5xl md:text-7xl"
                  style={{ left: b.x, top: b.y, color: b.color, WebkitTextStroke: "3px #08080a", paintOrder: "stroke fill", textShadow: "5px 5px 0 #08080a" }}
                  initial={{ scale: 0, rotate: b.rot - 20, opacity: 1 }}
                  animate={{ scale: [0, 1.4, 1.1], rotate: b.rot, y: -40, opacity: [1, 1, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                >
                  {b.text}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* readout + chips */}
          <div className="mt-2 flex min-h-[2.4rem] flex-wrap items-center gap-2">
            {hoveredPanel ? (
              <>
                <span className="mg-sticker bg-[var(--ink)] text-white">{hoveredPanel.label}</span>
                <span className="mg-label text-[11px] font-bold">{hoveredSqft} sq ft</span>
                <span className="mg-sticker" style={{ background: selected.has(hoveredPanel.id) ? "var(--yellow)" : "var(--cyan)" }}>
                  {selected.has(hoveredPanel.id) ? `− $${hoveredCost.toLocaleString()}` : `+ $${hoveredCost.toLocaleString()}`}
                </span>
              </>
            ) : (
              <span className="mg-label text-[11px] text-[var(--ink)]/60">{selected.size} of {CAR_PANELS.length} panels · {coveragePct}% covered</span>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {PRESETS.map((p) => (
              <button key={p.id} className="mg-chip" data-on={activePreset === p.id} onClick={() => applyPreset(p.panels)}>{p.label}</button>
            ))}
            <button className="mg-chip" onClick={() => { setSelected(new Set()); fire(false); }}><RotateCcw size={12} /> Clear</button>
            <button className="mg-chip mg-chip-mag ml-auto" onClick={surprise}><Dices size={13} /> Surprise me</button>
          </div>
        </div>

        {/* ── Right: manga panel control sheet ── */}
        <motion.aside
          className="mg-frame relative flex min-w-0 flex-col gap-5 p-5 md:p-6 lg:rotate-1"
          initial={{ opacity: 0, y: 60, rotate: 6 }} animate={{ opacity: 1, y: 0, rotate: 1 }} transition={{ duration: 0.8, delay: 0.35, type: "spring", bounce: 0.4 }}
        >
          <div className="-mx-5 -mt-5 flex items-center justify-between border-b-4 border-[var(--ink)] bg-[var(--ink)] px-5 py-2 text-white md:-mx-6 md:-mt-6 md:px-6">
            <span className="mg-label text-[10px]">第1話 · Build sheet</span>
            <span className="xs-kanji text-lg text-[var(--yellow)]">見積</span>
          </div>

          <Field n="01" label="Your car">
            <div className="grid min-w-0 grid-cols-2 gap-3">
              <select className="mg-select min-w-0" value={make} onChange={(e) => { const m = e.target.value; setMake(m); setModel(vehicleDatabase.find((v) => v.make === m)?.model ?? ""); }}>
                {makes.map((m) => <option key={m}>{m}</option>)}
              </select>
              <select className="mg-select min-w-0" value={model} onChange={(e) => setModel(e.target.value)}>
                {models.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <p className="mg-label mt-2 text-[10px] text-[var(--ink)]/60">{vehicle ? `${vehicle.year} ${vehicle.trim} · ${totalSqft} sq ft of skin` : "—"}</p>
          </Field>

          <Field n="02" label="Art vibe">
            <div className="flex gap-2">
              {WRAP_DESIGNS.map((d, i) => (
                <button
                  key={d.id} onClick={() => { setDesignIdx(i); fire(true); }}
                  className={`relative h-14 flex-1 border-[3px] border-[var(--ink)] p-[3px] transition-transform hover:-rotate-3 hover:scale-105 ${i === designIdx ? "mg-holo" : "bg-white"}`}
                  aria-label={d.name} title={d.name}
                >
                  <span className="absolute inset-[3px] grid place-items-center" style={{ background: `linear-gradient(135deg, ${d.c1}, ${d.c2})` }}>
                    <span className="xs-kanji text-2xl text-white drop-shadow-[2px_2px_0_#000]">{d.kanji}</span>
                  </span>
                </button>
              ))}
            </div>
            <p className="mg-label mt-2 text-[10px] text-[var(--ink)]/60">{design.name} · placeholder. Yours is drawn from zero.</p>
          </Field>

          <Field n="03" label="Design tier">
            <div className="grid grid-cols-3 gap-3">
              {designTiers.map((t) => (
                <button key={t.id} className="mg-tile" data-on={t.id === tierId} onClick={() => setTierId(t.id)}>
                  <span className="mg-label block text-[10px] font-bold">{t.label.replace(" Itasha", "").replace(" Design", "")}</span>
                  <span className="mg-title block text-xl">${t.pricePerSqft}<span className="text-xs">/sqft</span></span>
                </button>
              ))}
            </div>
          </Field>

          <div className="grid min-w-0 grid-cols-1 gap-4">
            <Field n="04" label="Finish">
              <div className="flex gap-2">
                {finishOptions.map((f) => (
                  <button key={f.id} className="mg-chip flex-1 justify-center" data-on={f.id === finishId} onClick={() => setFinishId(f.id as Finish)}>{f.label.replace("High ", "")}</button>
                ))}
              </div>
            </Field>
            <Field n="05" label="Install">
              <select className="mg-select min-w-0" value={installId} onChange={(e) => setInstallId(e.target.value)}>
                {installOptions.map((i) => <option key={i.id} value={i.id}>{i.label}</option>)}
              </select>
            </Field>
          </div>

          {/* price tag */}
          <div className="relative -mx-2 mt-2 -rotate-1 border-[4px] border-[var(--ink)] bg-[var(--yellow)] p-4 shadow-[8px_8px_0_var(--mag)]">
            <span aria-hidden className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-[4px] border-[var(--ink)] bg-[var(--paper)]" />
            <div className="flex items-end justify-between gap-3 pl-4">
              <div>
                <p className="mg-label text-[10px]">Estimated total · 見積</p>
                <motion.p className="mg-title mt-1 text-[3.4rem] leading-none tabular-nums" style={{ WebkitTextStroke: "2px #08080a", color: "#fff", paintOrder: "stroke fill", textShadow: "5px 5px 0 #08080a" }}>{priceText}</motion.p>
              </div>
              <div className="mg-label text-right text-[10px] leading-relaxed">
                <p>{quote.coveredSqft} sq ft</p><p>{coveragePct}% coverage</p><p>{selected.size}/{CAR_PANELS.length} panels</p>
              </div>
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-2 pl-4 mg-label text-[10px]">
              <Row k="Vinyl + art" v={`$${quote.subtotal.toLocaleString()}`} />
              <Row k="Install" v={install.price ? `$${install.price}` : "DIY"} />
              <Row k="Design fee" v={`$${quote.designFee}`} />
            </dl>
          </div>
          <p className="mg-label text-[10px] leading-relaxed text-[var(--ink)]/70">25% starts the art · 25% when you approve · 50% to print &amp; ship</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href={selected.size ? quoteHref : "/pricing"} className="mg-btn flex-1">Lock it in <ArrowRight size={18} /></Link>
            <Link href="/contact" className="mg-btn mg-btn-white"><Phone size={16} /> Human, please</Link>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}

function Field({ n, label, children }: { n: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-2">
        <span className="mg-title bg-[var(--ink)] px-1.5 text-sm leading-tight text-[var(--yellow)]">{n}</span>
        <span className="mg-label text-[10px] font-bold">{label}</span>
      </p>
      {children}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="border-[2.5px] border-[var(--ink)] bg-white px-2 py-1.5">
      <dt className="text-[var(--ink)]/60">{k}</dt>
      <dd className="mg-title mt-0.5 text-base">{v}</dd>
    </div>
  );
}
