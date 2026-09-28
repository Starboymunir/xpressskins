import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Anton, Michroma, Noto_Sans_JP } from "next/font/google";
import { ArrowRight } from "lucide-react";
import { WrapStudio } from "@/components/studio/WrapStudio";
import { ProcessStory } from "@/components/studio/ProcessStory";
import { StudioNav } from "@/components/studio/StudioNav";
import { StudioCursor, MarqueeX } from "@/components/studio/StudioFx";
import { driveImg, portfolioImages } from "@/data/assets";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const display = Michroma({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const kanji = Noto_Sans_JP({ weight: ["700", "900"], subsets: ["latin"], variable: "--font-kanji", preload: false });

export const metadata: Metadata = {
  title: "Wrap Studio | Xpress Skins — Custom Itasha Wraps, Houston TX",
  description:
    "Wrap your car panel by panel and get a live price. Custom anime (itasha) wraps designed, printed and installed by Xpress Skins in Houston, shipped nationwide.",
};

const BAND = ["Itasha culture", "4.9★ on Google", "500+ wraps since 2020", "Houston TX", "Avery Dennison · 3M", "Ships to all 50 states", "Tap · wrap · price"];
const TILT = [-5, 4, -3, 6, -4, 3];
const STAMPS = ["納品済", "完成", "出荷済", "納品済", "完成", "出荷済"];

export default function StudioPage() {
  const gallery = [11, 2, 7, 28, 31, 14].map((i) => portfolioImages[i]).filter(Boolean);
  return (
    <div className={`studio ${anton.variable} ${display.variable} ${kanji.variable}`}>
      <StudioCursor />
      <StudioNav />

      <WrapStudio />

      <MarqueeX items={BAND} />

      <ProcessStory />

      <MarqueeX items={["Real cars", "Real owners", "No stock photos", "痛車文化", "Houston to anywhere"]} />

      {/* gallery: tilted polaroids */}
      <section id="gallery" className="mg-tone relative overflow-hidden">
        <div aria-hidden className="xs-kanji pointer-events-none absolute -right-8 top-10 select-none text-[24vw] leading-none opacity-[0.06]">実車</div>
        <div className="relative mx-auto max-w-[1500px] px-4 py-24 lg:px-8 lg:py-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="mg-title -skew-x-6 text-[clamp(3rem,8vw,7.5rem)]">
              <span className="mg-stroke block">Real cars.</span>
              <span className="block text-[var(--ink)]">Real <span className="mg-stroke-mag">owners.</span></span>
            </h2>
            <Link href="/portfolio" className="mg-btn mg-btn-cyan">All {portfolioImages.length}+ builds <ArrowRight size={18} /></Link>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-10">
            {gallery.map((img, i) => (
              <figure
                key={img.id}
                className="group relative border-[4px] border-[var(--ink)] bg-white p-3 pb-12 shadow-[10px_10px_0_var(--ink)] transition-transform duration-300 hover:z-10 hover:!rotate-0 hover:scale-[1.06] hover:shadow-[14px_14px_0_var(--mag)]"
                style={{ transform: `rotate(${TILT[i]}deg)` }}
              >
                <span aria-hidden className="mg-tape -top-3 left-1/2 -translate-x-1/2" />
                <div className="relative aspect-[4/5] overflow-hidden border-[3px] border-[var(--ink)] bg-[var(--ink)]">
                  <Image src={driveImg(img.id, 900)} alt={img.alt} fill sizes="(max-width:768px) 50vw, 33vw" className="object-cover" />
                </div>
                <figcaption className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="mg-title text-xl">{img.category}</span>
                  <span className="mg-hanko !h-12 !w-12 rotate-12 !text-[11px]">{STAMPS[i]}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* final CTA: yellow starburst */}
      <section className="relative overflow-hidden border-t-4 border-[var(--ink)] bg-[var(--yellow)]">
        <div aria-hidden className="mg-speed absolute -inset-[30%] opacity-[0.15]" />
        <div aria-hidden className="mg-burst absolute -right-[10%] top-1/2 h-[120vw] w-[120vw] -translate-y-1/2 bg-[var(--mag)] md:h-[70vw] md:w-[70vw]" />
        <div aria-hidden className="xs-kanji pointer-events-none absolute right-[6%] top-1/2 -translate-y-1/2 select-none text-[22vw] leading-none text-white opacity-90 md:right-[12%]">今</div>
        <div className="relative mx-auto flex max-w-[1500px] flex-col items-start gap-10 px-4 py-24 lg:px-8 lg:py-36">
          <h2 className="mg-title -skew-x-6 text-[clamp(3.6rem,12vw,12rem)]">
            <span className="block text-[var(--ink)]">Get</span>
            <span className="mg-stroke block">wrapped.</span>
          </h2>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="#studio" className="mg-btn !text-2xl">Build my wrap <ArrowRight size={22} /></Link>
            <Link href="/contact" className="mg-btn mg-btn-white !text-2xl">Talk to Ed</Link>
          </div>
        </div>
      </section>

      <footer className="border-t-4 border-[var(--ink)] bg-[var(--ink)] text-white">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 px-4 py-6 mg-label text-[10px] text-white/70 lg:px-8">
          <span>© {new Date().getFullYear()} Xpress Skins Inc. · Houston, TX · 痛車文化</span>
          <span className="flex gap-5">
            <a href="https://www.instagram.com/xpressskins/" className="hover:text-[var(--yellow)]">Instagram</a>
            <a href="https://www.youtube.com/@XpressSkins" className="hover:text-[var(--yellow)]">YouTube</a>
            <Link href="/portal" className="hover:text-[var(--yellow)]">Customer portal</Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
