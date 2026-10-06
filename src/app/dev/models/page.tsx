import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Cand = { uid: string; name: string; author: string; url: string; license: string; faces: number };
type Q = { make: string; base: string; body: string; models: string[]; candidates: Cand[]; vetted?: boolean; pick?: string | null; thumb?: string | null; rejected?: string[] };

/** Local-only review of the vetted 3D model picks. Not available in production. */
export default function ModelsReview({ searchParams }: { searchParams: Promise<{ show?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const file = path.join(process.cwd(), "data/model-matches.json");
  const data = JSON.parse(fs.readFileSync(file, "utf8")) as { queries: Record<string, Q> };
  const all = Object.entries(data.queries);
  const vetted = all.filter(([, q]) => q.vetted);
  const picked = vetted.filter(([, q]) => q.pick);
  const none = all.filter(([, q]) => (q.vetted && !q.pick) || !q.candidates.length);

  return (
    <section className="mx-auto max-w-[1600px] px-5 pb-24 pt-28 text-white lg:px-10">
      <p className="t-label text-white/40">Dev · model review</p>
      <h1 className="t-display mt-2 text-4xl">Vetted 3D picks</h1>
      <p className="mt-3 text-sm text-white/60">
        {picked.length} picked · {none.length} fall back to nearest body type · {all.length - vetted.length} still being vetted. Click a card to open it on Sketchfab.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {picked.map(([key, q]) => {
          const c = q.candidates.find((x) => x.uid === q.pick)!;
          return (
            <a key={key} href={c.url} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0e] hover:border-[var(--mag)]">
              {q.thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={q.thumb} alt={c.name} className="aspect-video w-full object-cover" loading="lazy" />
              ) : <div className="aspect-video w-full bg-white/5" />}
              <div className="p-3">
                <p className="text-[13px] font-semibold">{q.make} {q.base}</p>
                <p className="mt-1 line-clamp-1 text-[11px] text-white/50">{c.name} · {Math.round(c.faces / 1000)}k · {q.body}</p>
              </div>
            </a>
          );
        })}
      </div>
      <h2 className="t-display mt-16 text-2xl">No suitable model</h2>
      <ul className="mt-4 columns-2 gap-8 text-[13px] text-white/60 md:columns-4">
        {none.map(([key, q]) => <li key={key} className="break-inside-avoid py-1">{q.make} {q.base} <span className="text-white/30">· {q.body}</span></li>)}
      </ul>
    </section>
  );
}
