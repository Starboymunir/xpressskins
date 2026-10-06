"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/lib/types";
import { Rise, PillLink } from "@/components/fx/Motion";

const STAGES: { id: string; label: string }[] = [
  { id: "design", label: "Artwork" }, { id: "revision", label: "Revision" }, { id: "approved", label: "Approved" },
  { id: "printing", label: "Printing" }, { id: "shipping", label: "Shipping" }, { id: "installing", label: "Installing" }, { id: "completed", label: "Done" },
];

const DEMO: Pick<Project, "title" | "vehicle_info" | "wrap_type" | "status" | "progress">[] = [
  { title: "Zero Two full itasha", vehicle_info: "2024 Honda Civic Si", wrap_type: "Full wrap", status: "design", progress: 15 },
  { title: "Miku racing edition", vehicle_info: "2023 Toyota GR86", wrap_type: "Full wrap", status: "printing", progress: 60 },
  { title: "Unit-01 half wrap", vehicle_info: "2025 Subaru WRX", wrap_type: "Half wrap", status: "revision", progress: 25 },
  { title: "Tanjiro side panels", vehicle_info: "2024 Ford Mustang", wrap_type: "Sides", status: "approved", progress: 40 },
  { title: "Gojo custom", vehicle_info: "2023 Nissan Z", wrap_type: "Full wrap", status: "shipping", progress: 75 },
  { title: "Anya partial", vehicle_info: "2023 Tesla Model 3", wrap_type: "Partial", status: "installing", progress: 90 },
];

export function LiveBuilds({ projects }: { projects: Project[] }) {
  const items = projects.length ? projects : (DEMO as Project[]);
  return (
    <section id="live" className="relative border-y hairline bg-[#050507] py-24 text-white lg:py-36">
      <div className="mx-auto max-w-[1600px] px-5 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="t-label flex items-center gap-3 text-white/40"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--mag)] opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--mag)]" /></span>06 — On the floor right now</p>
            <h2 className="t-display mt-3 text-[clamp(2.2rem,5vw,4.6rem)] leading-[0.95]">Every build, <span className="t-serif font-normal text-[var(--mag)]">tracked in public.</span></h2>
          </div>
          <Rise className="max-w-sm text-[15px] leading-relaxed text-white/60">We post every job and its stage. Customers watch theirs move in the portal; everyone else gets to watch the shop breathe.</Rise>
        </div>

        <div className="mt-14 overflow-x-auto scrollbar-hide">
          <div className="grid min-w-[1100px] grid-cols-7 gap-3">
            {STAGES.map((st, si) => {
              const inStage = items.filter((p) => p.status === st.id);
              return (
                <div key={st.id} className="min-h-[260px] rounded-2xl border hairline bg-[#0a0a0e] p-3">
                  <div className="mb-3 flex items-center justify-between px-1">
                    <span className="t-label text-white/60">{st.label}</span>
                    <span className="t-display text-sm text-white/40">{inStage.length}</span>
                  </div>
                  <div className="space-y-2">
                    {inStage.map((p, i) => (
                      <motion.div key={p.title + i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: si * 0.05 + i * 0.08, duration: 0.6 }} className="rounded-xl border border-white/[0.08] bg-[#111117] p-3">
                        <p className="t-display text-[15px] leading-tight">{p.title}</p>
                        <p className="mt-1 text-[12px] text-white/50">{p.vehicle_info} · {p.wrap_type}</p>
                        <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[var(--mag)]" style={{ width: `${p.progress || 10}%` }} /></div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <PillLink href="/projects" variant="ghost">Open the live board</PillLink>
          <Link href="/portal" className="t-label text-white/45 hover:text-white">Customer? Track yours in the portal →</Link>
        </div>
      </div>
    </section>
  );
}
