import type { Metadata } from "next";
import { credits } from "@/lib/carIndex";

export const metadata: Metadata = { title: "3D model credits | Xpress Skins" };

export default function CreditsPage() {
  const list = credits();
  return (
    <section className="mx-auto max-w-[1100px] px-5 pb-24 pt-32 text-white lg:px-10">
      <p className="t-label text-white/40">Credits</p>
      <h1 className="t-display mt-3 text-[clamp(2.2rem,5vw,4rem)] leading-[0.95]">3D vehicle models</h1>
      <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/60">
        The wrap studio previews use these models under Creative Commons licences. Thank you to every artist below.
        Vehicle names are trademarks of their manufacturers; Xpress Skins is not affiliated with them.
      </p>
      <ul className="mt-12 divide-y divide-white/[0.08] border-y border-white/[0.08]">
        <li className="flex flex-wrap items-baseline justify-between gap-2 py-4 text-[14px]">
          <a href="https://sketchfab.com/models/57bf6cc56931426e87494f554df1dab6" className="text-white hover:text-[var(--mag)]">Ferrari 458 Italia</a>
          <span className="text-white/50">by vicent091036 · via the three.js examples</span>
        </li>
        {list.map((m) => (
          <li key={m.url} className="flex flex-wrap items-baseline justify-between gap-2 py-4 text-[14px]">
            <a href={m.url} target="_blank" rel="noreferrer" className="text-white hover:text-[var(--mag)]">{m.name}</a>
            <span className="text-white/50">
              by {m.authorUrl ? <a href={m.authorUrl} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">{m.author}</a> : m.author} · {m.license}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
