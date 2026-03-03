"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import IntroAnimation from "@/components/IntroAnimation";
import { driveImg, driveVideo, portfolioImages, videoAssets } from "@/data/assets";
import {
  ArrowRight,
  Zap,
  ShoppingBag,
  Truck,
  Shield,
  Palette,
  Sparkles,
  CheckCircle2,
  Play,
} from "lucide-react";

export default function Home() {
  return (
    <>
      {/* Cinematic intro overlay — plays once per session */}
      <IntroAnimation />

      {/* ══════════════════════════════════════════════
          VIDEO HERO
         ══════════════════════════════════════════════ */}
      <VideoHero />

      {/* ══════════════════════════════════════════════
          MARQUEE STRIP
         ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-y border-white/[0.03] bg-surface-0 py-4">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="flex items-center gap-10 px-5">
              {[
                "ITASHA WRAPS",
                "CUSTOM ARTWORK",
                "AVERY DENNISON",
                "UV LAMINATED",
                "HOUSTON TX",
                "NATIONWIDE SHIPPING",
                "PREMIUM VINYL",
                "ANIME ART",
                "FREE DESIGN CONSULTATION",
              ].map((text) => (
                <span
                  key={`${idx}-${text}`}
                  className="flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-muted/40"
                >
                  {text}
                  <span className="inline-block h-1 w-1 rounded-full bg-accent/30" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FULL-WIDTH IMAGE BANNER
         ══════════════════════════════════════════════ */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <Image
          src={driveImg(portfolioImages[9].id, 1920)}
          alt="Xpress Skins workshop"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="mb-4 max-w-lg text-3xl font-black text-white md:text-5xl">
                Your Vision.{" "}
                <span className="gradient-text-static">Our Craft.</span>
              </h2>
              <p className="mb-6 max-w-md text-base text-white/70">
                Every Itasha wrap starts with your idea and ends with a rolling
                masterpiece. Custom anime artwork on premium vinyl.
              </p>
              <Link href="/pricing" className="btn-primary !px-8 !py-3.5">
                <Zap size={16} />
                <span>Start Your Custom Build</span>
                <ArrowRight size={15} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          GALLERY — scrolling image row
         ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
          <AnimatedSection className="mb-10 text-center">
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.3em] text-accent3">
              Gallery
            </span>
            <h2 className="text-3xl font-black text-white md:text-4xl">
              Straight From the Studio
            </h2>
          </AnimatedSection>
        </div>

        {/* Full-bleed scrolling gallery */}
        <div className="flex gap-3 overflow-x-auto px-5 pb-4 scrollbar-hide lg:px-8">
          {portfolioImages.slice(8, 24).map((img) => (
            <div
              key={img.id}
              className="relative aspect-[3/2] w-72 flex-shrink-0 overflow-hidden rounded-2xl border border-white/[0.04] bg-surface-1 md:w-96"
            >
              <Image
                src={driveImg(img.id, 800)}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="400px"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-accent3 transition-all hover:gap-3"
          >
            See all {portfolioImages.length}+ builds
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          WHY XPRESS SKINS
         ══════════════════════════════════════════════ */}
      <section className="section-line relative overflow-hidden py-20 md:py-28">
        <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Left: stacked images */}
            <AnimatedSection className="relative">
              <div className="grid grid-cols-2 gap-3">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/[0.04]">
                  <Image src={driveImg(portfolioImages[14].id, 600)} alt="Wrap detail" fill className="object-cover" />
                </div>
                <div className="relative mt-8 aspect-[3/4] overflow-hidden rounded-2xl border border-white/[0.04]">
                  <Image src={driveImg(portfolioImages[16].id, 600)} alt="Wrap detail" fill className="object-cover" />
                </div>
              </div>
            </AnimatedSection>

            {/* Right: text */}
            <AnimatedSection className="flex flex-col justify-center" delay={0.15}>
              <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.3em] text-accent">
                Why Choose Us
              </span>
              <h2 className="mb-6 text-3xl font-black text-white md:text-4xl">
                Not Just a Wrap Shop.{" "}
                <span className="gradient-text-static">An Art Studio.</span>
              </h2>
              <div className="space-y-5">
                {[
                  { icon: Palette, title: "Hand-Crafted Artwork", desc: "Each design is original — created by professional anime artists who bring your vision to life." },
                  { icon: Shield, title: "Premium Materials", desc: "Avery Dennison & 3M vinyl with high-gloss UV lamination. Vibrant colors that last 5-7 years." },
                  { icon: Truck, title: "Ship Anywhere in the US", desc: "Nationwide shipping in reinforced tubes, or professional installation at our Houston studio." },
                  { icon: Sparkles, title: "100% Custom", desc: "No templates, no generic designs. Every wrap is made to order with your unique vision." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-surface-2">
                      <item.icon size={18} className="text-accent" />
                    </div>
                    <div>
                      <h3 className="mb-1 text-sm font-bold text-white">{item.title}</h3>
                      <p className="text-sm leading-relaxed text-muted">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PAYMENT + TRUST
         ══════════════════════════════════════════════ */}
      <section className="section-line relative overflow-hidden py-20 md:py-28">
        <div className="relative z-10 mx-auto max-w-5xl px-5 text-center lg:px-8">
          <AnimatedSection>
            <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.3em] text-accent">
              Flexible Payment
            </span>
            <h2 className="mb-5 text-3xl font-black text-white md:text-4xl">
              Pay As We <span className="gradient-text-static">Progress</span>
            </h2>
            <p className="mx-auto mb-12 max-w-xl text-base text-muted-light">
              No surprise invoices. Milestone-based payments tied to real progress.
            </p>
          </AnimatedSection>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { pct: "25%", label: "Start Custom Art", desc: "Kick off your project — artists begin your design." },
              { pct: "25%", label: "Design Approval", desc: "Pay once you love the final approved artwork." },
              { pct: "50%", label: "Print & Deliver", desc: "Final payment to print on premium vinyl & ship." },
            ].map((p, i) => (
              <AnimatedSection key={p.label} delay={i * 0.1}>
                <div className="card-glow group h-full p-7 text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/20 bg-accent/[0.05]">
                    <span className="text-xl font-black text-white">{p.pct}</span>
                  </div>
                  <h3 className="mb-2 text-base font-bold text-white">{p.label}</h3>
                  <p className="text-sm text-muted">{p.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="mt-8" delay={0.4}>
            <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-muted">
              {["No Hidden Fees", "Revisions Included", "Milestone-Based", "Money-Back Guarantee"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-accent3" /> {t}
                </span>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          VIDEO SHOWCASE — Behind the Scenes (second-to-last)
         ══════════════════════════════════════════════ */}
      <section className="section-line relative overflow-hidden py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(255,26,108,0.04),transparent_70%)]" />

        <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
          <AnimatedSection className="mb-10 flex items-end justify-between">
            <div>
              <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-accent">
                <Play size={12} className="fill-accent" /> Behind the Scenes
              </span>
              <h2 className="text-3xl font-black text-white md:text-4xl">
                Watch Our Builds Come to Life
              </h2>
              <p className="mt-3 max-w-lg text-sm text-muted">
                From concept to completion — real footage from our Houston studio.
              </p>
            </div>
            <Link
              href="/portfolio"
              className="hidden items-center gap-2 text-sm font-semibold text-accent transition-all hover:gap-3 md:flex"
            >
              See All <ArrowRight size={14} />
            </Link>
          </AnimatedSection>

          {/* Hero video — large */}
          <AnimatedSection className="mb-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/[0.06] bg-surface-1">
              <iframe
                src={driveVideo(videoAssets[0].id)}
                title={videoAssets[0].title}
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="h-full w-full border-0"
              />
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">{videoAssets[0].category}</span>
                <h3 className="mt-1 text-lg font-bold text-white">{videoAssets[0].title}</h3>
              </div>
            </div>
          </AnimatedSection>

          {/* Video grid — 2x3 on desktop */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
            {videoAssets.slice(1, 7).map((video, i) => (
              <AnimatedSection key={video.id} delay={i * 0.08}>
                <div className="group relative aspect-video overflow-hidden rounded-2xl border border-white/[0.06] bg-surface-1 transition-all hover:border-accent/20">
                  <iframe
                    src={driveVideo(video.id)}
                    title={video.title}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent/80">{video.category}</span>
                    <h3 className="mt-0.5 text-sm font-bold text-white">{video.title}</h3>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FINAL CTA
         ══════════════════════════════════════════════ */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <Image
          src={driveImg(portfolioImages[6].id, 1920)}
          alt="Xpress Skins Itasha"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <AnimatedSection>
            <h2 className="mb-5 text-4xl font-black text-white md:text-6xl">
              Ready to Turn Heads?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-base text-white/70 md:text-lg">
              Join 500+ customers who turned their vehicles into anime
              masterpieces. Get your instant quote in under 2 minutes.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/pricing" className="btn-primary !px-10 !py-4 !text-base">
                <ShoppingBag size={18} />
                <span>Shop Now</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/contact" className="btn-ghost !px-7 !py-4 !text-base">
                Contact Us
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}

/* ─── VIDEO HERO — single slide with video background ─── */
function VideoHero() {
  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden">
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        poster={driveImg(portfolioImages[0].id, 1920)}
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end pb-24 md:items-center md:pb-0">
        <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <h1 className="mb-4 text-4xl font-black leading-tight text-white md:text-6xl lg:text-7xl">
              Custom Itasha Wraps
            </h1>
            <p className="mb-8 max-w-lg text-base text-white/80 md:text-lg">
              Designed by artists. Printed on premium Avery vinyl. Shipped nationwide.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/pricing" className="btn-primary !px-8 !py-3.5 !text-sm">
                <ShoppingBag size={16} />
                <span>Shop Now</span>
                <ArrowRight size={15} />
              </Link>
              <Link href="/portfolio" className="btn-ghost !px-6 !py-3.5 !text-sm">
                View Portfolio
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom stats bar with brand logos */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-black/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
          <div className="flex items-center gap-6 md:gap-10">
            {[
              { val: "500+", lab: "Wraps Completed" },
              { val: "4.9★", lab: "Average Rating" },
              { val: "5+", lab: "Years Experience" },
            ].map((s) => (
              <div key={s.lab} className="text-center">
                <div className="text-sm font-black text-white md:text-base">{s.val}</div>
                <div className="text-[9px] uppercase tracking-wider text-white/50">{s.lab}</div>
              </div>
            ))}

            {/* Brand logos next to stats */}
            <div className="hidden items-center gap-6 border-l border-white/10 pl-6 md:flex">
              {[
                { src: "/brands/3m-logo.svg", alt: "3M", w: 80 },
                { src: "/brands/avery-dennison-logo.svg", alt: "Avery Dennison", w: 120 },
                { src: "/brands/arlon-logo.svg", alt: "Arlon", w: 100 },
              ].map((brand) => (
                <Image
                  key={brand.alt}
                  src={brand.src}
                  alt={brand.alt}
                  width={brand.w}
                  height={40}
                  className="h-8 w-auto brightness-0 invert opacity-70 transition-opacity hover:opacity-100"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}