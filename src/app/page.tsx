"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { driveImg, driveVideo, portfolioImages, allImages, videoAssets } from "@/data/assets";
import {
  ArrowRight,
  Star,
  Zap,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Truck,
  Shield,
  Palette,
  Sparkles,
  CheckCircle2,
  Play,
} from "lucide-react";

/* ─── HERO SLIDES — best images for full-width hero ─── */
const heroSlides = [
  { id: portfolioImages[0].id, heading: "Custom Itasha Wraps", sub: "Designed by artists. Printed on premium Avery vinyl. Shipped nationwide.", cta: "Shop Now", href: "/pricing" },
  { id: portfolioImages[2].id, heading: "Your Anime, Your Ride", sub: "Full body wraps, partial wraps, hoods — your vision, our craftsmanship.", cta: "Browse Designs", href: "/portfolio" },
  { id: portfolioImages[5].id, heading: "Professional Installation", sub: "Installed at our Houston studio or shipped to any installer in the US.", cta: "Get a Quote", href: "/pricing" },
  { id: portfolioImages[3].id, heading: "Premium Materials Only", sub: "Avery Dennison & 3M vinyl with high-gloss UV lamination. Built to last.", cta: "Learn More", href: "/how-it-works" },
];

/* ─── PRODUCT CATEGORIES (store-like) ─── */
const collections = [
  { name: "Itasha / Anime Wraps", image: portfolioImages[0].id, href: "/pricing", count: "20+ Designs" },
  { name: "Full Body Wraps", image: portfolioImages[4].id, href: "/pricing", count: "Custom" },
  { name: "Partial Wraps", image: portfolioImages[8].id, href: "/pricing", count: "Hoods, Trunks, Panels" },
  { name: "Color Change Wraps", image: portfolioImages[12].id, href: "/pricing", count: "Coming Soon" },
];

/* ─── FEATURED PRODUCTS (from portfolio) ─── */
const featuredProducts = portfolioImages.slice(0, 8).map((img, i) => ({
  ...img,
  title: [
    "Kia Soul Itasha",
    "Cyberpunk Lucy GR Corolla",
    "Angel Tacoma Persona 5",
    "Hellsing Tacoma Itasha",
    "Azur Lane Full Wrap",
    "Benny Corolla Itasha",
    "Ghost Data Itasha",
    "Bunsama Danmachi FRS",
  ][i],
  price: ["$2,800", "$3,200", "$3,500", "$3,100", "$2,900", "$2,600", "$3,400", "$2,750"][i],
}));

export default function Home() {
  return (
    <>
      {/* ══════════════════════════════════════════════
          FULL-WIDTH HERO CAROUSEL
         ══════════════════════════════════════════════ */}
      <FullWidthHero />

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
          SHOP BY COLLECTION
         ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
          <AnimatedSection className="mb-10 flex items-end justify-between">
            <div>
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.3em] text-accent">
                Collections
              </span>
              <h2 className="text-3xl font-black text-white md:text-4xl">
                Shop by Category
              </h2>
            </div>
            <Link
              href="/pricing"
              className="hidden items-center gap-2 text-sm font-semibold text-accent transition-all hover:gap-3 md:flex"
            >
              View All <ArrowRight size={14} />
            </Link>
          </AnimatedSection>

          <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {collections.map((col, i) => (
              <AnimatedSection key={col.name} delay={i * 0.08}>
                <Link href={col.href} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/[0.04] bg-surface-1">
                    <Image
                      src={driveImg(col.image, 600)}
                      alt={col.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
                        {col.count}
                      </p>
                      <h3 className="mt-1 text-base font-bold text-white md:text-lg">
                        {col.name}
                      </h3>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-white/70 transition-colors group-hover:text-accent">
                        Shop Now <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURED PRODUCTS
         ══════════════════════════════════════════════ */}
      <section className="section-line relative overflow-hidden py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(168,85,247,0.04),transparent_70%)]" />

        <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
          <AnimatedSection className="mb-10 flex items-end justify-between">
            <div>
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.3em] text-accent2">
                Featured
              </span>
              <h2 className="text-3xl font-black text-white md:text-4xl">
                Our Latest Builds
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="hidden items-center gap-2 text-sm font-semibold text-accent2 transition-all hover:gap-3 md:flex"
            >
              View All <ArrowRight size={14} />
            </Link>
          </AnimatedSection>

          <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {featuredProducts.map((product, i) => (
              <AnimatedSection key={product.id} delay={i * 0.06}>
                <Link href="/pricing" className="group block">
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/[0.04] bg-surface-1">
                    <Image
                      src={driveImg(product.id, 600)}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <div className="mt-3 px-0.5">
                    <h3 className="text-sm font-semibold text-white transition-colors group-hover:text-accent">
                      {product.title}
                    </h3>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-xs text-muted">{product.category}</span>
                      <span className="text-sm font-bold text-accent">
                        {product.price}
                      </span>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
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
          MORE GALLERY — scrolling image row
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
          VIDEO SHOWCASE — Behind the Scenes
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
          IMAGE MOSAIC — visual impact grid
         ══════════════════════════════════════════════ */}
      <section className="section-line relative overflow-hidden py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-background" />

        <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
          <AnimatedSection className="mb-10">
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.3em] text-accent2">
              More Work
            </span>
            <h2 className="text-3xl font-black text-white md:text-4xl">
              From Studio to Street
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            <AnimatedSection className="row-span-2">
              <div className="relative h-full min-h-[320px] overflow-hidden rounded-2xl border border-white/[0.04] bg-surface-1 md:min-h-[500px]">
                <Image src={driveImg(allImages[34].id)} alt={allImages[34].alt} fill className="object-cover" />
              </div>
            </AnimatedSection>
            {allImages.slice(35, 38).map((img, i) => (
              <AnimatedSection key={img.id} delay={i * 0.08}>
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/[0.04] bg-surface-1">
                  <Image src={driveImg(img.id)} alt={img.alt} fill className="object-cover" />
                </div>
              </AnimatedSection>
            ))}
            {allImages.slice(38, 41).map((img, i) => (
              <AnimatedSection key={img.id} delay={(i + 3) * 0.08}>
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/[0.04] bg-surface-1">
                  <Image src={driveImg(img.id)} alt={img.alt} fill className="object-cover" />
                </div>
              </AnimatedSection>
            ))}
          </div>
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

/* ─── FULL-WIDTH HERO CAROUSEL ─── */
function FullWidthHero() {
  const [idx, setIdx] = useState(0);
  const next = useCallback(() => setIdx((p) => (p + 1) % heroSlides.length), []);
  const prev = () => setIdx((p) => (p - 1 + heroSlides.length) % heroSlides.length);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = heroSlides[idx];

  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden">
      {/* Background images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={driveImg(slide.id, 1920)}
            alt={slide.heading}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end pb-24 md:items-center md:pb-0">
        <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.heading}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl"
            >
              {/* Logo watermark */}
              <Image
                src="/New Xpressskins Logo cut only2 Large.png"
                alt=""
                width={120}
                height={36}
                className="mb-6 h-8 w-auto brightness-0 invert opacity-80"
              />

              <h1 className="mb-4 text-4xl font-black leading-tight text-white md:text-6xl lg:text-7xl">
                {slide.heading}
              </h1>
              <p className="mb-8 max-w-lg text-base text-white/80 md:text-lg">
                {slide.sub}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href={slide.href} className="btn-primary !px-8 !py-3.5 !text-sm">
                  <ShoppingBag size={16} />
                  <span>{slide.cta}</span>
                  <ArrowRight size={15} />
                </Link>
                <Link href="/portfolio" className="btn-ghost !px-6 !py-3.5 !text-sm">
                  View Portfolio
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-accent/60 md:left-8"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-accent/60 md:right-8"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === idx ? "w-10 bg-accent" : "w-4 bg-white/30"
            }`}
          />
        ))}
      </div>

      {/* Bottom stats bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-black/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
          <div className="flex gap-6 md:gap-10">
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
          </div>
          <div className="hidden items-center gap-2 text-xs text-white/60 md:flex">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span>Houston&apos;s #1 Itasha Studio</span>
          </div>
        </div>
      </div>
    </section>
  );
}