import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Michroma, Noto_Sans_JP } from "next/font/google";
import { ArrowRight, Star } from "lucide-react";
import { WrapStudio } from "@/components/studio/WrapStudio";
import { ProcessStory } from "@/components/studio/ProcessStory";
import { StudioNav } from "@/components/studio/StudioNav";
import { driveImg, portfolioImages } from "@/data/assets";

const display = Michroma({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const kanji = Noto_Sans_JP({ weight: ["700", "900"], subsets: ["latin"], variable: "--font-kanji", preload: false });

export const metadata: Metadata = {
  title: "Wrap Studio | Xpress Skins — Custom Itasha Wraps, Houston TX",
  description:
    "Wrap your car panel by panel and get a live price. Custom anime (itasha) wraps designed, printed and installed by Xpress Skins in Houston, shipped nationwide.",
};

const TRUST = ["4.9★ on Google", "500+ wraps since 2020", "Avery Dennison & 3M cast vinyl", "Designed, printed & installed in Houston", "Ships to all 50 states"];

export default function StudioPage() {
  const gallery = [11, 2, 7, 28, 31, 14].map((i) => portfolioImages[i]).filter(Boolean);
  return (
    <div className={`studio ${display.variable} ${kanji.variable}`}>
      <StudioNav />

      <WrapStudio />

      {/* trust strip */}
      <div className="border-y border-[var(--line)] bg-[var(--ink)] text-[var(--paper)]">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-8 gap-y-2 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] lg:justify-between lg:px-8">
          {TRUST.map((t) => (
            <span key={t} className="flex items-center gap-2">
              <Star size={11} className="fill-[var(--mag-hot)] text-[var(--mag-hot)]" />
              {t}
            </span>
          ))}
        </div>
      </div>

      <ProcessStory />

      {/* gallery */}
      <section id="gallery" className="xs-lines">
        <div className="mx-auto max-w-[1400px] px-5 py-20 lg:px-8 lg:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-3 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--mag)]">
                <span className="h-px w-8 bg-[var(--mag)]" /> Straight from the studio
              </p>
              <h2 className="xs-display text-[clamp(1.8rem,4.2vw,3.6rem)]">Real cars.<br />Real owners.</h2>
            </div>
            <Link href="/portfolio" className="xs-btn-ghost">
              See all {portfolioImages.length}+ builds <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {gallery.map((img, i) => (
              <figure
                key={img.id}
                className={`group relative overflow-hidden border border-[var(--line)] bg-[var(--paper-2)] ${i === 0 ? "col-span-2 row-span-2 aspect-[4/3] md:aspect-auto" : "aspect-[4/5]"}`}
              >
                <Image src={driveImg(img.id, 900)} alt={img.alt} fill sizes="(max-width:768px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-10 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
                  <span>{img.category}</span>
                  <span className="xs-kanji text-base">痛車</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* final CTA */}
      <section className="relative overflow-hidden bg-[var(--mag)] text-white">
        <div aria-hidden className="pointer-events-none absolute -left-4 -top-10 select-none xs-kanji text-[30vw] leading-none opacity-10">文化</div>
        <div className="relative mx-auto flex max-w-[1400px] flex-col items-start gap-8 px-5 py-20 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-28">
          <h2 className="xs-display text-[clamp(2rem,5vw,4.6rem)]">Your car.<br />Your anime.<br />Your story.</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="#studio" className="xs-btn !bg-[var(--ink)] !text-[var(--paper)]">
              Build my wrap <ArrowRight size={15} />
            </Link>
            <Link href="/contact" className="xs-btn-ghost !border-white/40 !text-white hover:!bg-white/10">
              Ask us anything
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--line)] bg-[var(--paper)]">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-5 py-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-2)]/70 lg:px-8">
          <span>© {new Date().getFullYear()} Xpress Skins Inc. · Houston, TX</span>
          <span className="flex gap-5">
            <a href="https://www.instagram.com/xpressskins/" className="hover:text-[var(--mag)]">Instagram</a>
            <a href="https://www.youtube.com/@XpressSkins" className="hover:text-[var(--mag)]">YouTube</a>
            <Link href="/portal" className="hover:text-[var(--mag)]">Customer portal</Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
