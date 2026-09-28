"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Dices, Phone, RotateCcw } from "lucide-react";
import {
  vehicleDatabase, panelDefinitions, designTiers, finishOptions, installOptions,
  calculatePrice, getPanelSqft,
} from "@/data/vehicles";
import { ItashaCar, CAR_PANELS, WRAP_DESIGNS, type CarPanelId, type Finish } from "./ItashaCar";

/* presets expressed in visual panel ids */
const PRESETS: { id: string; label: string; panels: CarPanelId[] }[] = [
  { id: "full", label: "Full wrap", panels: CAR_PANELS.map((p) => p.id) },
  { id: "half", label: "Half wrap", panels: ["hood", "roof", "front-bumper", "rear-bumper", "trunk", "front-fenders", "front-door", "rear-door", "quarter-panels"] },
  { id: "sides", label: "Sides only", panels: ["front-door", "rear-door", "quarter-panels", "front-fenders"] },
  { id: "hood-roof", label: "Hood + roof", panels: ["hood", "roof"] },
];

const DEFAULT_MAKE = "Honda";
const DEFAULT_MODEL = "Civic";

function latestVariant(make: string, model: string) {
  return vehicleDatabase
    .filter((v) => v.make === make && v.model === model)
    .sort((a, b) => b.year - a.year)[0];
}

export function WrapStudio() {
  const [make, setMake] = useState(DEFAULT_MAKE);
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [selected, setSelected] = useState<Set<CarPanelId>>(() => new Set(PRESETS[1].panels));
  const [hovered, setHovered] = useState<CarPanelId | null>(null);
  const [designIdx, setDesignIdx] = useState(0);
  const [tierId, setTierId] = useState(designTiers[1].id);
  const [finishId, setFinishId] = useState<Finish>("gloss");
  const [installId, setInstallId] = useState(installOptions[0].id);

  const makes = useMemo(() => Array.from(new Set(vehicleDatabase.map((v) => v.make))).sort(), []);
  const models = useMemo(
    () => Array.from(new Set(vehicleDatabase.filter((v) => v.make === make).map((v) => v.model))).sort(),
    [make],
  );
  const vehicle = useMemo(() => latestVariant(make, model), [make, model]);
  const totalSqft = vehicle?.totalSqft ?? 245;

  const tier = designTiers.find((t) => t.id === tierId) ?? designTiers[1];
  const finish = finishOptions.find((f) => f.id === finishId) ?? finishOptions[0];
  const install = installOptions.find((i) => i.id === installId) ?? installOptions[0];
  const design = WRAP_DESIGNS[designIdx];

  const priceIds = useMemo(
    () => CAR_PANELS.filter((p) => selected.has(p.id)).flatMap((p) => p.priceIds),
    [selected],
  );
  const quote = useMemo(
    () => calculatePrice(totalSqft, priceIds, tier.pricePerSqft, finish.priceAdd, install.price),
    [totalSqft, priceIds, tier, finish, install],
  );

  /* animated price */
  const mv = useMotionValue(quote.total);
  const spring = useSpring(mv, { stiffness: 120, damping: 20 });
  const priceText = useTransform(spring, (v) => `$${Math.round(v).toLocaleString()}`);
  useEffect(() => { mv.set(quote.total); }, [quote.total, mv]);

  const toggle = (id: CarPanelId) =>
    setSelected((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  const applyPreset = (panels: CarPanelId[]) => setSelected(new Set(panels));
  const activePreset = PRESETS.find((p) => p.panels.length === selected.size && p.panels.every((id) => selected.has(id)))?.id;

  const surprise = () => {
    setDesignIdx((i) => (i + 1 + Math.floor(Math.random() * (WRAP_DESIGNS.length - 1))) % WRAP_DESIGNS.length);
    applyPreset(PRESETS[Math.floor(Math.random() * PRESETS.length)].panels);
    setTierId(designTiers[Math.floor(Math.random() * designTiers.length)].id);
  };

  const hoveredPanel = CAR_PANELS.find((p) => p.id === hovered);
  const hoveredSqft = hoveredPanel ? getPanelSqft(totalSqft, hoveredPanel.priceIds) : 0;
  const hoveredCost = Math.round(hoveredSqft * (tier.pricePerSqft + finish.priceAdd));
  const coveragePct = Math.round(
    priceIds.reduce((s, id) => s + (panelDefinitions.find((p) => p.id === id)?.percentOfTotal ?? 0), 0) * 100,
  );

  const quoteHref = `/pricing?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&panels=${priceIds.join(",")}&tier=${tier.id}&finish=${finish.id}&install=${install.id}`;

  return (
    <section id="studio" className="relative overflow-hidden xs-halftone">
      <div aria-hidden className="pointer-events-none absolute -right-6 top-6 select-none xs-kanji text-[26vw] leading-none text-[var(--ink)] opacity-[0.045]">
        痛車
      </div>

      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-5 pb-16 pt-24 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-8 lg:px-8 lg:pt-28">
        {/* ── Left: headline + car ── */}
        <div className="flex min-w-0 flex-col">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <p className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--mag)]">
              <span className="h-px w-8 bg-[var(--mag)]" /> Houston, TX · Itasha only · Ships nationwide
            </p>
            <h1 className="xs-display text-[clamp(1.65rem,5vw,4.6rem)]">
              Wrap it<br />
              <span className="text-[var(--mag)]">before</span> you buy it.
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--ink-2)] md:text-base">
              Tap the panels you want covered. Watch the art go on. The price updates live from real vehicle
              square footage, so what you see is what you pay.
            </p>
          </motion.div>

          <motion.div
            className="relative mt-8 md:mt-10"
            initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <ItashaCar
              selected={selected}
              hovered={hovered}
              onHover={setHovered}
              onToggle={toggle}
              design={design}
              finish={finishId}
              className="w-full drop-shadow-[0_30px_40px_rgba(12,12,16,0.12)]"
            />
            <div className="mt-3 flex h-8 items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.14em]">
              {hoveredPanel ? (
                <>
                  <span className="rounded-[4px] bg-[var(--ink)] px-2 py-1 text-[var(--paper)]">{hoveredPanel.label}</span>
                  <span className="text-[var(--ink-2)]">{hoveredSqft} sq ft</span>
                  <span className="text-[var(--mag)]">
                    {selected.has(hoveredPanel.id) ? `− $${hoveredCost.toLocaleString()}` : `+ $${hoveredCost.toLocaleString()}`}
                  </span>
                </>
              ) : (
                <span className="text-[var(--ink-2)]/70">Hover a panel · click to wrap it</span>
              )}
            </div>
          </motion.div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {PRESETS.map((p) => (
              <button key={p.id} className="xs-chip" data-on={activePreset === p.id} onClick={() => applyPreset(p.panels)}>
                {p.label}
              </button>
            ))}
            <button className="xs-chip" onClick={() => setSelected(new Set())} aria-label="Clear panels">
              <RotateCcw size={12} /> Clear
            </button>
            <button className="xs-chip xs-chip-mag ml-auto" onClick={surprise}>
              <Dices size={13} /> Surprise me
            </button>
          </div>
        </div>

        {/* ── Right: controls + price ── */}
        <motion.aside
          className="flex min-w-0 flex-col gap-5 border border-[var(--line)] bg-[var(--paper)] p-5 shadow-[0_24px_60px_-30px_rgba(12,12,16,0.35)] md:p-6"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Field label="01 · Vehicle">
            <div className="grid min-w-0 grid-cols-2 gap-2">
              <select
                className="xs-select min-w-0"
                value={make}
                onChange={(e) => {
                  const m = e.target.value;
                  setMake(m);
                  setModel(vehicleDatabase.find((v) => v.make === m)?.model ?? "");
                }}
              >
                {makes.map((m) => <option key={m}>{m}</option>)}
              </select>
              <select className="xs-select min-w-0" value={model} onChange={(e) => setModel(e.target.value)}>
                {models.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-[var(--ink-2)]/70">
              {vehicle ? `${vehicle.year} ${vehicle.trim} · ${totalSqft} sq ft total` : "—"}
            </p>
          </Field>

          <Field label="02 · Artwork">
            <div className="flex gap-2">
              {WRAP_DESIGNS.map((d, i) => (
                <button
                  key={d.id}
                  onClick={() => setDesignIdx(i)}
                  className="relative h-12 flex-1 overflow-hidden rounded-[4px] border-2 transition-all"
                  style={{ background: `linear-gradient(135deg, ${d.c1}, ${d.c2})`, borderColor: i === designIdx ? "var(--ink)" : "transparent" }}
                  aria-label={d.name}
                  title={d.name}
                >
                  <span className="xs-kanji absolute inset-0 flex items-center justify-center text-xl text-white/80">{d.kanji}</span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-[var(--ink-2)]/70">{design.name} · placeholder art, yours is drawn from scratch</p>
          </Field>

          <Field label="03 · Design tier">
            <div className="grid grid-cols-3 gap-2">
              {designTiers.map((t) => (
                <button key={t.id} className="xs-tile" data-on={t.id === tierId} onClick={() => setTierId(t.id)}>
                  <span className="block text-[11px] font-bold uppercase tracking-[0.1em]">{t.label.replace(" Itasha", "")}</span>
                  <span className="block text-[11px] opacity-70">${t.pricePerSqft}/sq ft</span>
                </button>
              ))}
            </div>
          </Field>

          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="04 · Finish">
              <div className="flex gap-1.5">
                {finishOptions.map((f) => (
                  <button key={f.id} className="xs-chip flex-1 justify-center" data-on={f.id === finishId} onClick={() => setFinishId(f.id as Finish)}>
                    {f.label.replace("High ", "")}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="05 · Install">
              <select className="xs-select w-full min-w-0" value={installId} onChange={(e) => setInstallId(e.target.value)}>
                {installOptions.map((i) => <option key={i.id} value={i.id}>{i.label}</option>)}
              </select>
            </Field>
          </div>

          <div className="border-t border-[var(--line)] pt-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--ink-2)]/70">Estimated total</p>
                <motion.p className="xs-display mt-1 text-[2.4rem] leading-none text-[var(--ink)] tabular-nums">{priceText}</motion.p>
              </div>
              <div className="text-right text-[11px] uppercase tracking-[0.12em] text-[var(--ink-2)]/70">
                <p>{quote.coveredSqft} sq ft · {coveragePct}% coverage</p>
                <p>{selected.size} of {CAR_PANELS.length} panels</p>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-2 text-[11px] uppercase tracking-[0.1em]">
              <Row k="Vinyl + art" v={`$${quote.subtotal.toLocaleString()}`} />
              <Row k="Install" v={install.price ? `$${install.price}` : "DIY"} />
              <Row k="Design fee" v={`$${quote.designFee}`} />
            </dl>
            <p className="mt-3 text-[11px] leading-relaxed text-[var(--ink-2)]/70">
              Pay 25% to start the art, 25% when you approve it, 50% to print and ship.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Link href={selected.size ? quoteHref : "/pricing"} className="xs-btn flex-1">
                Lock this in <ArrowRight size={15} />
              </Link>
              <Link href="/contact" className="xs-btn-ghost">
                <Phone size={14} /> Talk to a human
              </Link>
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--ink)]">{label}</p>
      {children}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="border border-[var(--line)] px-2.5 py-2">
      <dt className="text-[var(--ink-2)]/60">{k}</dt>
      <dd className="mt-0.5 font-bold text-[var(--ink)]">{v}</dd>
    </div>
  );
}
