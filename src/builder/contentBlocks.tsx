/**
 * Specialised content blocks that mirror the original hard-coded designs
 * across the home, contact, how-it-works and portfolio pages.
 *
 * Every text/image/icon/button is exposed as an editable Puck field so a
 * non-technical user can change anything in /admin/pages/[id]/edit.
 * Framer-motion animations are baked in to keep the original look.
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
} from "framer-motion";
import { useRef } from "react";
import { DropZone, type ComponentConfig } from "@puckeditor/core";
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
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  MessageSquare,
  Printer,
  CreditCard,
  Send,
  Eye,
  Filter as FilterIcon,
  X as XIcon,
  ChevronLeft,
  ChevronRight,
  Car,
  Layers,
  Paintbrush,
  Wrench,
  Check,
  Image as ImageIcon,
  Star,
  Heart,
  Award,
  type LucideIcon,
} from "lucide-react";
import { driveImg, driveVideo, allImages, videoAssets } from "@/data/assets";

/* ─── Icon registry (admin can pick any of these by name) ─── */
const ICONS: Record<string, LucideIcon> = {
  ArrowRight, Zap, ShoppingBag, Truck, Shield, Palette, Sparkles,
  CheckCircle2, Play, Phone, Mail, MapPin, MessageCircle, Clock,
  MessageSquare, Printer, CreditCard, Send, Eye, FilterIcon, XIcon,
  ChevronLeft, ChevronRight, Car, Layers, Paintbrush, Wrench, Check,
  ImageIcon, Star, Heart, Award,
};
const ICON_OPTIONS = Object.keys(ICONS).map((k) => ({ label: k, value: k }));
function Icon({ name, size = 18, className }: { name?: string; size?: number; className?: string }) {
  const C = (name && ICONS[name]) || Sparkles;
  return <C size={size} className={className} />;
}

/* ─── tiny inline AnimatedReveal (so blocks don't depend on outer wrapper) ─── */
function Reveal({
  children, delay = 0, direction = "up", className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const off = 50;
  const d = {
    up: { y: off, x: 0 }, down: { y: -off, x: 0 },
    left: { y: 0, x: off }, right: { y: 0, x: -off },
  }[direction];
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: d.y, x: d.x, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, x: 0, filter: "blur(0px)" } : undefined}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   1. PageHero — simple gradient title hero
   ───────────────────────────────────────────────────────── */
export const PageHero: ComponentConfig<{
  eyebrow?: string;
  title: string;
  gradientWord?: string;
  subtitle?: string;
  halo?: "accent" | "accent2" | "accent3" | "none";
}> = {
  label: "Hero — Page Title",
  fields: {
    eyebrow: { type: "text", label: "Eyebrow text (optional)" },
    title: { type: "text", label: "Title (use {{x}} to mark a gradient word)" },
    gradientWord: { type: "text", label: "Gradient word (highlighted accent)" },
    subtitle: { type: "textarea", label: "Subtitle / lead paragraph" },
    halo: {
      type: "select", label: "Background halo color",
      options: [
        { label: "Accent (pink)", value: "accent" },
        { label: "Accent2 (purple)", value: "accent2" },
        { label: "Accent3 (cyan)", value: "accent3" },
        { label: "None", value: "none" },
      ],
    },
  },
  defaultProps: {
    title: "Page Title",
    gradientWord: "Title",
    subtitle: "Lead paragraph describing this page in one or two sentences.",
    halo: "accent",
  },
  render: ({ eyebrow, title, gradientWord, subtitle, halo }) => {
    const haloCls =
      halo === "accent2" ? "bg-accent2/5" :
      halo === "accent3" ? "bg-accent3/[0.05]" :
      halo === "none" ? "" : "bg-accent/[0.05]";
    // Split title by gradientWord (first occurrence), bold the rest, gradient the word.
    let pre = title, mid = "", post = "";
    if (gradientWord && title.includes(gradientWord)) {
      const i = title.indexOf(gradientWord);
      pre = title.slice(0, i);
      mid = gradientWord;
      post = title.slice(i + gradientWord.length);
    }
    return (
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 bg-background" />
        {haloCls && (
          <div className={`absolute right-1/4 top-0 h-[400px] w-[600px] rounded-full ${haloCls} blur-[120px]`} />
        )}
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-8">
          <Reveal>
            {eyebrow && (
              <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.3em] text-accent">
                {eyebrow}
              </span>
            )}
            <h1 className="mb-4 text-4xl font-black text-white md:text-6xl">
              {pre}
              {mid && (
                <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
                  {mid}
                </span>
              )}
              {post}
            </h1>
            {subtitle && (
              <p className="mx-auto max-w-xl text-lg text-muted-light">{subtitle}</p>
            )}
          </Reveal>
        </div>
      </section>
    );
  },
};

/* ─────────────────────────────────────────────────────────
   2. HeroVideo — full-screen video background hero
   ───────────────────────────────────────────────────────── */
type HeroVideoProps = {
  videoSrc: string;
  posterImageId?: string;
  title: string;
  subtitle?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  primaryCtaIcon?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  stats?: { val: string; lab: string }[];
};
export const HeroVideo: ComponentConfig<HeroVideoProps> = {
  label: "Hero — Video Background",
  fields: {
    videoSrc: { type: "text", label: "Video file URL (e.g. /hero-video.mp4)" },
    posterImageId: { type: "text", label: "Poster image ID (Drive ID or path)" },
    title: { type: "text", label: "Headline" },
    subtitle: { type: "textarea", label: "Subline" },
    primaryCtaLabel: { type: "text", label: "Primary CTA label" },
    primaryCtaHref: { type: "text", label: "Primary CTA link" },
    primaryCtaIcon: { type: "select", label: "Primary CTA icon", options: ICON_OPTIONS },
    secondaryCtaLabel: { type: "text", label: "Secondary CTA label" },
    secondaryCtaHref: { type: "text", label: "Secondary CTA link" },
    stats: {
      type: "array", label: "Bottom stats bar",
      arrayFields: {
        val: { type: "text", label: "Value" },
        lab: { type: "text", label: "Label" },
      },
      getItemSummary: (i) => i.val || "Stat",
    },
  },
  defaultProps: {
    videoSrc: "/hero-video.mp4",
    title: "Custom Itasha Wraps",
    subtitle: "Designed by artists. Printed on premium Avery vinyl. Shipped nationwide.",
    primaryCtaLabel: "Shop Now",
    primaryCtaHref: "/pricing",
    primaryCtaIcon: "ShoppingBag",
    secondaryCtaLabel: "View Portfolio",
    secondaryCtaHref: "/portfolio",
    stats: [
      { val: "500+", lab: "Wraps Completed" },
      { val: "4.9★", lab: "Average Rating" },
      { val: "5+", lab: "Years Experience" },
    ],
  },
  render: ({ videoSrc, posterImageId, title, subtitle, primaryCtaLabel, primaryCtaHref, primaryCtaIcon, secondaryCtaLabel, secondaryCtaHref, stats }) => (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden">
      <video
        autoPlay muted loop playsInline
        className="absolute inset-0 h-full w-full object-cover"
        poster={posterImageId ? driveImg(posterImageId, 1920) : undefined}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
      <div className="absolute inset-0 flex items-end pb-24 md:items-center md:pb-0">
        <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <h1 className="mb-4 text-4xl font-black leading-tight text-white md:text-6xl lg:text-7xl">{title}</h1>
            {subtitle && <p className="mb-8 max-w-lg text-base text-white/80 md:text-lg">{subtitle}</p>}
            <div className="flex flex-wrap gap-3">
              {primaryCtaLabel && (
                <Link href={primaryCtaHref || "#"} className="btn-primary !px-8 !py-3.5 !text-sm">
                  <Icon name={primaryCtaIcon} size={16} />
                  <span>{primaryCtaLabel}</span>
                  <ArrowRight size={15} />
                </Link>
              )}
              {secondaryCtaLabel && (
                <Link href={secondaryCtaHref || "#"} className="btn-ghost !px-6 !py-3.5 !text-sm">
                  {secondaryCtaLabel}
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      {stats && stats.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-black/40 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
            <div className="flex items-center gap-6 md:gap-10">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-sm font-black text-white md:text-base">{s.val}</div>
                  <div className="text-[9px] uppercase tracking-wider text-white/50">{s.lab}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  ),
};

/* ─────────────────────────────────────────────────────────
   3. Marquee — horizontal scrolling text strip
   ───────────────────────────────────────────────────────── */
export const Marquee: ComponentConfig<{ items: { text: string }[] }> = {
  label: "Marquee Strip",
  fields: {
    items: {
      type: "array", label: "Words",
      arrayFields: { text: { type: "text", label: "Text" } },
      getItemSummary: (i) => i.text || "Item",
    },
  },
  defaultProps: {
    items: [
      { text: "ITASHA WRAPS" }, { text: "CUSTOM ARTWORK" }, { text: "AVERY DENNISON" },
      { text: "UV LAMINATED" }, { text: "HOUSTON TX" }, { text: "NATIONWIDE SHIPPING" },
      { text: "PREMIUM VINYL" }, { text: "ANIME ART" }, { text: "FREE DESIGN CONSULTATION" },
    ],
  },
  render: ({ items }) => (
    <section className="relative overflow-hidden border-y border-white/[0.03] bg-surface-0 py-4">
      <div className="flex animate-marquee whitespace-nowrap">
        {[0, 1].map((idx) => (
          <div key={idx} className="flex items-center gap-10 px-5">
            {items?.map((it, j) => (
              <span key={`${idx}-${j}`} className="flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-muted/40">
                {it.text}
                <span className="inline-block h-1 w-1 rounded-full bg-accent/30" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  ),
};

/* ─────────────────────────────────────────────────────────
   4. ImageBanner — full-bleed image with overlay content
   ───────────────────────────────────────────────────────── */
export const ImageBanner: ComponentConfig<{
  imageId: string;
  imageAlt?: string;
  heading: string;
  gradientWord?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
  ctaIcon?: string;
  height?: "small" | "medium" | "large";
  align?: "left" | "center";
  overlay?: "dark" | "left-fade" | "center-dark";
}> = {
  label: "Image Banner",
  fields: {
    imageId: { type: "text", label: "Image ID or path" },
    imageAlt: { type: "text", label: "Alt text" },
    heading: { type: "text", label: "Heading" },
    gradientWord: { type: "text", label: "Gradient word (subset of heading)" },
    body: { type: "textarea", label: "Body" },
    ctaLabel: { type: "text", label: "CTA label" },
    ctaHref: { type: "text", label: "CTA link" },
    ctaIcon: { type: "select", label: "CTA icon", options: ICON_OPTIONS },
    height: {
      type: "select", label: "Height",
      options: [
        { label: "Small (40vh)", value: "small" },
        { label: "Medium (50vh)", value: "medium" },
        { label: "Large (60vh)", value: "large" },
      ],
    },
    align: {
      type: "select", label: "Content alignment",
      options: [{ label: "Left", value: "left" }, { label: "Center", value: "center" }],
    },
    overlay: {
      type: "select", label: "Overlay style",
      options: [
        { label: "Dark gradient (left fade)", value: "left-fade" },
        { label: "Solid dark", value: "dark" },
        { label: "Center dark", value: "center-dark" },
      ],
    },
  },
  defaultProps: {
    imageId: "",
    heading: "Your Vision. Our Craft.",
    gradientWord: "Our Craft.",
    body: "Every Itasha wrap starts with your idea and ends with a rolling masterpiece.",
    ctaLabel: "Start Your Custom Build",
    ctaHref: "/pricing",
    ctaIcon: "Zap",
    height: "medium",
    align: "left",
    overlay: "left-fade",
  },
  render: ({ imageId, imageAlt, heading, gradientWord, body, ctaLabel, ctaHref, ctaIcon, height, align, overlay }) => {
    const h = height === "large" ? "h-[60vh]" : height === "small" ? "h-[40vh]" : "h-[50vh]";
    const overlayCls =
      overlay === "dark" ? "bg-black/60" :
      overlay === "center-dark" ? "bg-black/60" :
      "bg-gradient-to-r from-black/80 via-black/50 to-transparent";
    let pre = heading, mid = "", post = "";
    if (gradientWord && heading.includes(gradientWord)) {
      const i = heading.indexOf(gradientWord);
      pre = heading.slice(0, i); mid = gradientWord; post = heading.slice(i + gradientWord.length);
    }
    return (
      <section className={`relative ${h} min-h-[400px] overflow-hidden`}>
        {imageId && (
          <Image src={driveImg(imageId, 1920)} alt={imageAlt || ""} fill className="object-cover" />
        )}
        <div className={`absolute inset-0 ${overlayCls}`} />
        <div className={`absolute inset-0 flex items-center ${align === "center" ? "justify-center text-center" : ""}`}>
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <motion.div
              initial={{ opacity: 0, x: align === "center" ? 0 : -30, y: align === "center" ? 20 : 0 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className={`mb-4 ${align === "left" ? "max-w-lg" : ""} text-3xl font-black text-white md:text-5xl`}>
                {pre}
                {mid && <span className="gradient-text-static">{mid}</span>}
                {post}
              </h2>
              {body && (
                <p className={`mb-6 ${align === "left" ? "max-w-md" : "mx-auto max-w-xl"} text-base text-white/70`}>
                  {body}
                </p>
              )}
              {ctaLabel && (
                <Link href={ctaHref || "#"} className="btn-primary !px-8 !py-3.5">
                  <Icon name={ctaIcon} size={16} />
                  <span>{ctaLabel}</span>
                  <ArrowRight size={15} />
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    );
  },
};

/* ─────────────────────────────────────────────────────────
   5. ImageScroller — horizontal scrolling image row
   ───────────────────────────────────────────────────────── */
export const ImageScroller: ComponentConfig<{
  eyebrow?: string;
  heading?: string;
  source: "portfolio" | "custom";
  start?: number;
  count?: number;
  customImages?: { id: string; alt?: string }[];
  ctaLabel?: string;
  ctaHref?: string;
}> = {
  label: "Image Scroller",
  fields: {
    eyebrow: { type: "text", label: "Eyebrow" },
    heading: { type: "text", label: "Heading" },
    source: {
      type: "select", label: "Image source",
      options: [
        { label: "Portfolio (auto)", value: "portfolio" },
        { label: "Custom list", value: "custom" },
      ],
    },
    start: { type: "number", label: "Start index (portfolio)" },
    count: { type: "number", label: "Count (portfolio)" },
    customImages: {
      type: "array", label: "Custom images",
      arrayFields: {
        id: { type: "text", label: "Drive ID / path" },
        alt: { type: "text", label: "Alt" },
      },
      getItemSummary: (i) => i.id || "Image",
    },
    ctaLabel: { type: "text", label: "Footer link label" },
    ctaHref: { type: "text", label: "Footer link href" },
  },
  defaultProps: {
    eyebrow: "Gallery",
    heading: "Straight From the Studio",
    source: "portfolio",
    start: 8,
    count: 16,
    ctaLabel: "See all builds",
    ctaHref: "/portfolio",
  },
  render: ({ eyebrow, heading, source, start = 0, count = 16, customImages, ctaLabel, ctaHref }) => {
    const imgs = source === "portfolio"
      ? allImages.slice(start, start + count).map((i) => ({ id: i.id, alt: i.alt }))
      : (customImages || []);
    return (
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="mb-10 text-center">
            {eyebrow && (
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.3em] text-accent3">
                {eyebrow}
              </span>
            )}
            {heading && <h2 className="text-3xl font-black text-white md:text-4xl">{heading}</h2>}
          </Reveal>
        </div>
        <div className="flex gap-3 overflow-x-auto px-5 pb-4 scrollbar-hide lg:px-8">
          {imgs.map((img, i) => (
            <div key={i} className="relative aspect-[3/2] w-72 flex-shrink-0 overflow-hidden rounded-2xl border border-white/[0.04] bg-surface-1 md:w-96">
              {img.id && (
                <Image src={driveImg(img.id, 800)} alt={img.alt || ""} fill className="object-cover" sizes="400px" />
              )}
            </div>
          ))}
        </div>
        {ctaLabel && (
          <div className="mt-6 text-center">
            <Link href={ctaHref || "#"} className="group inline-flex items-center gap-2 text-sm font-semibold text-accent3 transition-all hover:gap-3">
              {ctaLabel}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </section>
    );
  },
};

/* ─────────────────────────────────────────────────────────
   6. FeatureSplit — image pair + features list
   ───────────────────────────────────────────────────────── */
export const FeatureSplit: ComponentConfig<{
  eyebrow?: string;
  heading: string;
  gradientWord?: string;
  image1Id?: string;
  image2Id?: string;
  features: { icon?: string; title: string; desc: string }[];
}> = {
  label: "Feature Split (image + list)",
  fields: {
    eyebrow: { type: "text", label: "Eyebrow" },
    heading: { type: "text", label: "Heading" },
    gradientWord: { type: "text", label: "Gradient word" },
    image1Id: { type: "text", label: "Image 1 ID / path" },
    image2Id: { type: "text", label: "Image 2 ID / path" },
    features: {
      type: "array", label: "Features",
      arrayFields: {
        icon: { type: "select", label: "Icon", options: ICON_OPTIONS },
        title: { type: "text", label: "Title" },
        desc: { type: "textarea", label: "Description" },
      },
      getItemSummary: (i) => i.title || "Feature",
    },
  },
  defaultProps: {
    eyebrow: "Why Choose Us",
    heading: "Not Just a Wrap Shop. An Art Studio.",
    gradientWord: "An Art Studio.",
    features: [
      { icon: "Palette", title: "Hand-Crafted Artwork", desc: "Each design is original — created by professional anime artists who bring your vision to life." },
      { icon: "Shield", title: "Premium Materials", desc: "Avery Dennison & 3M vinyl with high-gloss UV lamination. Vibrant colors that last 5-7 years." },
      { icon: "Truck", title: "Ship Anywhere in the US", desc: "Nationwide shipping in reinforced tubes, or professional installation at our Houston studio." },
      { icon: "Sparkles", title: "100% Custom", desc: "No templates, no generic designs. Every wrap is made to order with your unique vision." },
    ],
  },
  render: ({ eyebrow, heading, gradientWord, image1Id, image2Id, features }) => {
    let pre = heading, mid = "", post = "";
    if (gradientWord && heading.includes(gradientWord)) {
      const i = heading.indexOf(gradientWord);
      pre = heading.slice(0, i); mid = gradientWord; post = heading.slice(i + gradientWord.length);
    }
    return (
      <section className="section-line relative overflow-hidden py-20 md:py-28">
        <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal className="relative">
              <div className="grid grid-cols-2 gap-3">
                {image1Id && (
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/[0.04]">
                    <Image src={driveImg(image1Id, 600)} alt="" fill className="object-cover" />
                  </div>
                )}
                {image2Id && (
                  <div className="relative mt-8 aspect-[3/4] overflow-hidden rounded-2xl border border-white/[0.04]">
                    <Image src={driveImg(image2Id, 600)} alt="" fill className="object-cover" />
                  </div>
                )}
              </div>
            </Reveal>
            <Reveal className="flex flex-col justify-center" delay={0.15}>
              {eyebrow && (
                <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.3em] text-accent">
                  {eyebrow}
                </span>
              )}
              <h2 className="mb-6 text-3xl font-black text-white md:text-4xl">
                {pre}{mid && <span className="gradient-text-static">{mid}</span>}{post}
              </h2>
              <div className="space-y-5">
                {features?.map((f, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-surface-2">
                      <Icon name={f.icon} size={18} className="text-accent" />
                    </div>
                    <div>
                      <h3 className="mb-1 text-sm font-bold text-white">{f.title}</h3>
                      <p className="text-sm leading-relaxed text-muted">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    );
  },
};

/* ─────────────────────────────────────────────────────────
   7. PaymentMilestones — % cards with trust badges
   ───────────────────────────────────────────────────────── */
export const PaymentMilestones: ComponentConfig<{
  eyebrow?: string;
  heading: string;
  gradientWord?: string;
  subhead?: string;
  milestones: { pct: string; label: string; desc: string }[];
  badges?: { text: string }[];
}> = {
  label: "Payment Milestones",
  fields: {
    eyebrow: { type: "text", label: "Eyebrow" },
    heading: { type: "text", label: "Heading" },
    gradientWord: { type: "text", label: "Gradient word" },
    subhead: { type: "textarea", label: "Subhead" },
    milestones: {
      type: "array", label: "Milestones",
      arrayFields: {
        pct: { type: "text", label: "Percent" },
        label: { type: "text", label: "Label" },
        desc: { type: "textarea", label: "Description" },
      },
      getItemSummary: (i) => i.label || i.pct || "Milestone",
    },
    badges: {
      type: "array", label: "Trust badges",
      arrayFields: { text: { type: "text", label: "Text" } },
      getItemSummary: (i) => i.text || "Badge",
    },
  },
  defaultProps: {
    eyebrow: "Flexible Payment",
    heading: "Pay As We Progress",
    gradientWord: "Progress",
    subhead: "No surprise invoices. Milestone-based payments tied to real progress.",
    milestones: [
      { pct: "25%", label: "Start Custom Art", desc: "Kick off your project — artists begin your design." },
      { pct: "25%", label: "Design Approval", desc: "Pay once you love the final approved artwork." },
      { pct: "50%", label: "Print & Deliver", desc: "Final payment to print on premium vinyl & ship." },
    ],
    badges: [
      { text: "No Hidden Fees" }, { text: "Revisions Included" },
      { text: "Milestone-Based" }, { text: "Money-Back Guarantee" },
    ],
  },
  render: ({ eyebrow, heading, gradientWord, subhead, milestones, badges }) => {
    let pre = heading, mid = "", post = "";
    if (gradientWord && heading.includes(gradientWord)) {
      const i = heading.indexOf(gradientWord);
      pre = heading.slice(0, i); mid = gradientWord; post = heading.slice(i + gradientWord.length);
    }
    return (
      <section className="section-line relative overflow-hidden py-20 md:py-28">
        <div className="relative z-10 mx-auto max-w-5xl px-5 text-center lg:px-8">
          <Reveal>
            {eyebrow && <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.3em] text-accent">{eyebrow}</span>}
            <h2 className="mb-5 text-3xl font-black text-white md:text-4xl">
              {pre}{mid && <span className="gradient-text-static">{mid}</span>}{post}
            </h2>
            {subhead && <p className="mx-auto mb-12 max-w-xl text-base text-muted-light">{subhead}</p>}
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {milestones?.map((p, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="card-glow group h-full p-7 text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/20 bg-accent/[0.05]">
                    <span className="text-xl font-black text-white">{p.pct}</span>
                  </div>
                  <h3 className="mb-2 text-base font-bold text-white">{p.label}</h3>
                  <p className="text-sm text-muted">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          {badges && badges.length > 0 && (
            <Reveal className="mt-8" delay={0.4}>
              <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-muted">
                {badges.map((b, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-accent3" /> {b.text}
                  </span>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>
    );
  },
};

/* ─────────────────────────────────────────────────────────
   8. VideoShowcase — hero video + grid
   ───────────────────────────────────────────────────────── */
export const VideoShowcase: ComponentConfig<{
  eyebrow?: string;
  heading: string;
  subhead?: string;
  seeAllLabel?: string;
  seeAllHref?: string;
  heroIndex?: number;
  gridStart?: number;
  gridCount?: number;
}> = {
  label: "Video Showcase (hero + grid)",
  fields: {
    eyebrow: { type: "text", label: "Eyebrow" },
    heading: { type: "text", label: "Heading" },
    subhead: { type: "textarea", label: "Subhead" },
    seeAllLabel: { type: "text", label: "See-all link label" },
    seeAllHref: { type: "text", label: "See-all link href" },
    heroIndex: { type: "number", label: "Hero video index" },
    gridStart: { type: "number", label: "Grid start index" },
    gridCount: { type: "number", label: "Grid count" },
  },
  defaultProps: {
    eyebrow: "Behind the Scenes",
    heading: "Watch Our Builds Come to Life",
    subhead: "From concept to completion — real footage from our Houston studio.",
    seeAllLabel: "See All",
    seeAllHref: "/portfolio",
    heroIndex: 0, gridStart: 1, gridCount: 6,
  },
  render: ({ eyebrow, heading, subhead, seeAllLabel, seeAllHref, heroIndex = 0, gridStart = 1, gridCount = 6 }) => {
    const hero = videoAssets[heroIndex];
    const grid = videoAssets.slice(gridStart, gridStart + gridCount);
    return (
      <section className="section-line relative overflow-hidden py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(255,26,108,0.04),transparent_70%)]" />
        <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="mb-10 flex items-end justify-between">
            <div>
              {eyebrow && (
                <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-accent">
                  <Play size={12} className="fill-accent" /> {eyebrow}
                </span>
              )}
              <h2 className="text-3xl font-black text-white md:text-4xl">{heading}</h2>
              {subhead && <p className="mt-3 max-w-lg text-sm text-muted">{subhead}</p>}
            </div>
            {seeAllLabel && (
              <Link href={seeAllHref || "#"} className="hidden items-center gap-2 text-sm font-semibold text-accent transition-all hover:gap-3 md:flex">
                {seeAllLabel} <ArrowRight size={14} />
              </Link>
            )}
          </Reveal>
          {hero && (
            <Reveal className="mb-4">
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/[0.06] bg-surface-1">
                <iframe src={driveVideo(hero.id)} title={hero.title} allow="autoplay; encrypted-media" allowFullScreen className="h-full w-full border-0" />
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">{hero.category}</span>
                  <h3 className="mt-1 text-lg font-bold text-white">{hero.title}</h3>
                </div>
              </div>
            </Reveal>
          )}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
            {grid.map((v, i) => (
              <Reveal key={v.id} delay={i * 0.08}>
                <div className="group relative aspect-video overflow-hidden rounded-2xl border border-white/[0.06] bg-surface-1 transition-all hover:border-accent/20">
                  <iframe src={driveVideo(v.id)} title={v.title} allow="autoplay; encrypted-media" allowFullScreen className="h-full w-full border-0" />
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent/80">{v.category}</span>
                    <h3 className="mt-0.5 text-sm font-bold text-white">{v.title}</h3>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    );
  },
};

/* ─────────────────────────────────────────────────────────
   9. CTAOverlay — fullbleed image with centered CTA
   ───────────────────────────────────────────────────────── */
export const CTAOverlay: ComponentConfig<{
  imageId: string;
  heading: string;
  body?: string;
  primaryLabel?: string;
  primaryHref?: string;
  primaryIcon?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  height?: "medium" | "large";
}> = {
  label: "CTA — Fullbleed Image",
  fields: {
    imageId: { type: "text", label: "Image ID / path" },
    heading: { type: "text", label: "Heading" },
    body: { type: "textarea", label: "Body" },
    primaryLabel: { type: "text", label: "Primary CTA label" },
    primaryHref: { type: "text", label: "Primary CTA href" },
    primaryIcon: { type: "select", label: "Primary CTA icon", options: ICON_OPTIONS },
    secondaryLabel: { type: "text", label: "Secondary CTA label" },
    secondaryHref: { type: "text", label: "Secondary CTA href" },
    height: {
      type: "select", label: "Height",
      options: [{ label: "Medium (60vh)", value: "medium" }, { label: "Large (80vh)", value: "large" }],
    },
  },
  defaultProps: {
    imageId: "",
    heading: "Ready to Turn Heads?",
    body: "Join 500+ customers who turned their vehicles into anime masterpieces. Get your instant quote in under 2 minutes.",
    primaryLabel: "Shop Now",
    primaryHref: "/pricing",
    primaryIcon: "ShoppingBag",
    secondaryLabel: "Contact Us",
    secondaryHref: "/contact",
    height: "medium",
  },
  render: ({ imageId, heading, body, primaryLabel, primaryHref, primaryIcon, secondaryLabel, secondaryHref, height }) => {
    const h = height === "large" ? "h-[80vh]" : "h-[60vh]";
    return (
      <section className={`relative ${h} min-h-[400px] overflow-hidden`}>
        {imageId && <Image src={driveImg(imageId, 1920)} alt="" fill className="object-cover" />}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <Reveal>
            <h2 className="mb-5 text-4xl font-black text-white md:text-6xl">{heading}</h2>
            {body && <p className="mx-auto mb-8 max-w-xl text-base text-white/70 md:text-lg">{body}</p>}
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              {primaryLabel && (
                <Link href={primaryHref || "#"} className="btn-primary !px-10 !py-4 !text-base">
                  <Icon name={primaryIcon} size={18} />
                  <span>{primaryLabel}</span>
                  <ArrowRight size={16} />
                </Link>
              )}
              {secondaryLabel && (
                <Link href={secondaryHref || "#"} className="btn-ghost !px-7 !py-4 !text-base">
                  {secondaryLabel}
                </Link>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    );
  },
};

/* ─────────────────────────────────────────────────────────
   10. StepTimeline — vertical numbered steps with icons
   ───────────────────────────────────────────────────────── */
export const StepTimeline: ComponentConfig<{
  steps: { number: string; icon?: string; title: string; desc: string; color?: string }[];
}> = {
  label: "Step Timeline",
  fields: {
    steps: {
      type: "array", label: "Steps",
      arrayFields: {
        number: { type: "text", label: "Number (01, 02, ...)" },
        icon: { type: "select", label: "Icon", options: ICON_OPTIONS },
        title: { type: "text", label: "Title" },
        desc: { type: "textarea", label: "Description" },
        color: {
          type: "select", label: "Icon gradient",
          options: [
            { label: "Pink → Purple", value: "from-accent to-accent2" },
            { label: "Purple → Cyan", value: "from-accent2 to-accent3" },
            { label: "Cyan → Cyan", value: "from-accent3 to-accent3" },
            { label: "Cyan → Purple", value: "from-accent3 to-accent2" },
            { label: "Purple → Pink", value: "from-accent2 to-accent" },
          ],
        },
      },
      getItemSummary: (i) => i.title || i.number || "Step",
    },
  },
  defaultProps: {
    steps: [
      { number: "01", icon: "CreditCard", title: "Configure & Pay Deposit", desc: "Use our interactive pricing tool. Pay 25% deposit to kick off your project.", color: "from-accent to-accent2" },
      { number: "02", icon: "Palette", title: "Custom Artwork Design", desc: "Our artists create your unique design. Track progress in your portal.", color: "from-accent2 to-accent3" },
      { number: "03", icon: "MessageSquare", title: "Review & Approve", desc: "Review final mockup. Approve and pay second 25%.", color: "from-accent3 to-accent3" },
      { number: "04", icon: "Printer", title: "Premium Print", desc: "Avery Dennison vinyl with high-gloss UV lamination.", color: "from-accent3 to-accent3" },
      { number: "05", icon: "Truck", title: "Ship or Install", desc: "Pay the final 50%. We ship nationwide or install at our studio.", color: "from-accent3 to-accent2" },
      { number: "06", icon: "CheckCircle2", title: "Hit the Road", desc: "Show off your new Itasha — turn heads everywhere.", color: "from-accent2 to-accent" },
    ],
  },
  render: ({ steps }) => (
    <section className="relative overflow-hidden pb-32">
      <div className="absolute inset-0 bg-background" />
      <div className="relative z-10 mx-auto max-w-4xl px-6 lg:px-8">
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 hidden w-px bg-gradient-to-b from-accent via-accent2 to-accent3 md:block" />
          <div className="space-y-12">
            {steps?.map((s, i) => (
              <Reveal key={i} delay={i * 0.1} direction="left">
                <div className="flex items-start gap-8">
                  <div className="hidden shrink-0 md:flex">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color || "from-accent to-accent2"} shadow-lg`}>
                      <Icon name={s.icon} size={24} className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1 rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all hover:border-white/10">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="font-mono text-sm text-dark-500">Step {s.number}</span>
                      <div className="md:hidden">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${s.color || "from-accent to-accent2"}`}>
                          <Icon name={s.icon} size={16} className="text-white" />
                        </div>
                      </div>
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-white">{s.title}</h3>
                    <p className="leading-relaxed text-muted-light">{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  ),
};

/* ─────────────────────────────────────────────────────────
   11. PaymentTiers — 3 tier cards with checklist
   ───────────────────────────────────────────────────────── */
export const PaymentTiers: ComponentConfig<{
  eyebrow?: string;
  heading: string;
  subhead?: string;
  tiers: { percent: string; label: string; title: string; items: { text: string }[]; color?: string }[];
}> = {
  label: "Payment Tiers (checklist cards)",
  fields: {
    eyebrow: { type: "text", label: "Eyebrow" },
    heading: { type: "text", label: "Heading" },
    subhead: { type: "textarea", label: "Subhead" },
    tiers: {
      type: "array", label: "Tiers",
      arrayFields: {
        percent: { type: "text", label: "Percent" },
        label: { type: "text", label: "Label (small)" },
        title: { type: "text", label: "Title" },
        items: {
          type: "array", label: "Items",
          arrayFields: { text: { type: "text", label: "Item" } },
          getItemSummary: (i) => i.text || "Item",
        },
        color: {
          type: "select", label: "Color",
          options: [
            { label: "Pink → Purple", value: "from-accent to-accent2" },
            { label: "Purple → Cyan", value: "from-accent2 to-accent3" },
            { label: "Cyan", value: "from-accent3 to-accent3" },
          ],
        },
      },
      getItemSummary: (i) => i.title || i.percent || "Tier",
    },
  },
  defaultProps: {
    eyebrow: "Payment Structure",
    heading: "Pay As We Progress",
    subhead: "We split your project into three payments tied to milestones — so your money only moves when the work does.",
    tiers: [
      {
        percent: "25%", label: "First Payment", title: "Kick Off Custom Art",
        items: [{ text: "Project consultation" }, { text: "Artist assignment" }, { text: "Initial concept sketches" }, { text: "Reference gathering" }],
        color: "from-accent to-accent2",
      },
      {
        percent: "25%", label: "Second Payment", title: "Design Approved",
        items: [{ text: "Final artwork delivery" }, { text: "Vehicle template mockup" }, { text: "All revisions completed" }, { text: "Print-ready file prep" }],
        color: "from-accent2 to-accent3",
      },
      {
        percent: "50%", label: "Final Payment", title: "Print & Ship/Install",
        items: [{ text: "60\" Avery vinyl print" }, { text: "High-gloss UV lamination" }, { text: "Quality inspection" }, { text: "Shipping or installation" }],
        color: "from-accent3 to-accent3",
      },
    ],
  },
  render: ({ eyebrow, heading, subhead, tiers }) => (
    <section className="relative overflow-hidden py-32">
      <div className="absolute inset-0 bg-surface-0" />
      <div className="absolute left-1/2 top-0 h-[600px] w-[600px] rounded-full bg-accent/[0.05] blur-[120px]" />
      <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-8">
        <Reveal className="mb-16 text-center">
          {eyebrow && <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-accent">{eyebrow}</span>}
          <h2 className="mb-4 text-3xl font-black text-white md:text-5xl">{heading}</h2>
          {subhead && <p className="mx-auto max-w-xl text-muted-light">{subhead}</p>}
        </Reveal>
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          {tiers?.map((t, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div className="h-full rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all hover:border-white/10">
                <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${t.color || "from-accent to-accent2"}`}>
                  <span className="text-xl font-black text-white">{t.percent}</span>
                </div>
                <p className="mb-1 text-xs uppercase tracking-wider text-muted">{t.label}</p>
                <h3 className="mb-4 text-lg font-bold text-white">{t.title}</h3>
                <ul className="space-y-2">
                  {t.items?.map((it, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-muted-light">
                      <CheckCircle2 size={14} className="shrink-0 text-accent3" />
                      {it.text}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  ),
};

/* ─────────────────────────────────────────────────────────
   12. GuaranteeGrid — 2-col icon cards
   ───────────────────────────────────────────────────────── */
export const GuaranteeGrid: ComponentConfig<{
  heading?: string;
  items: { icon?: string; title: string; desc: string }[];
}> = {
  label: "Guarantee Grid (icon cards)",
  fields: {
    heading: { type: "text", label: "Heading" },
    items: {
      type: "array", label: "Items",
      arrayFields: {
        icon: { type: "select", label: "Icon", options: ICON_OPTIONS },
        title: { type: "text", label: "Title" },
        desc: { type: "textarea", label: "Description" },
      },
      getItemSummary: (i) => i.title || "Item",
    },
  },
  defaultProps: {
    heading: "Our Guarantees",
    items: [
      { icon: "Shield", title: "Quality Guarantee", desc: "Premium Avery Dennison vinyl rated for 5+ years outdoor durability." },
      { icon: "MessageSquare", title: "Unlimited Revisions", desc: "We don't stop until you love it. Revisions are included in your design package." },
      { icon: "Clock", title: "Transparent Timeline", desc: "Track every stage of your project in real-time through our public project board." },
      { icon: "CreditCard", title: "Milestone Payments", desc: "Pay as we progress. 25% deposit, 25% on approval, 50% on completion." },
    ],
  },
  render: ({ heading, items }) => (
    <section className="relative overflow-hidden py-32">
      <div className="absolute inset-0 bg-background" />
      <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-8">
        {heading && (
          <Reveal className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-black text-white md:text-4xl">{heading}</h2>
          </Reveal>
        )}
        <div className="grid gap-6 md:grid-cols-2">
          {items?.map((it, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="flex gap-5 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/[0.08]">
                  <Icon name={it.icon} size={20} className="text-accent" />
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-white">{it.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-light">{it.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  ),
};

/* ─────────────────────────────────────────────────────────
   13. CTABanner — simple center text + button
   ───────────────────────────────────────────────────────── */
export const CTABanner: ComponentConfig<{
  heading: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
  background?: "surface" | "background";
}> = {
  label: "CTA Banner (simple)",
  fields: {
    heading: { type: "text", label: "Heading" },
    body: { type: "textarea", label: "Body" },
    ctaLabel: { type: "text", label: "CTA label" },
    ctaHref: { type: "text", label: "CTA href" },
    background: {
      type: "select", label: "Background",
      options: [{ label: "Surface (lighter)", value: "surface" }, { label: "Background (dark)", value: "background" }],
    },
  },
  defaultProps: {
    heading: "Ready to Get Started?",
    body: "Build your wrap in under 2 minutes with our instant pricing tool.",
    ctaLabel: "Start Now",
    ctaHref: "/pricing",
    background: "surface",
  },
  render: ({ heading, body, ctaLabel, ctaHref, background }) => (
    <section className="relative overflow-hidden py-24">
      <div className={`absolute inset-0 ${background === "background" ? "bg-background" : "bg-surface-0"}`} />
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center lg:px-8">
        <Reveal>
          <h2 className="mb-4 text-3xl font-black text-white md:text-4xl">{heading}</h2>
          {body && <p className="mb-8 text-muted-light">{body}</p>}
          {ctaLabel && (
            <Link href={ctaHref || "#"} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent2 px-8 py-4 text-base font-bold text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_#ff2d7b44]">
              {ctaLabel} <ArrowRight size={16} />
            </Link>
          )}
        </Reveal>
      </div>
    </section>
  ),
};

/* ─────────────────────────────────────────────────────────
   14. ContactInfoGrid — icon cards with phone/email/etc
   ───────────────────────────────────────────────────────── */
export const ContactInfoGrid: ComponentConfig<{
  items: {
    icon?: string;
    iconColor?: string;
    title: string;
    line1?: string;
    line2?: string;
    href?: string;
  }[];
}> = {
  label: "Contact Info Cards",
  fields: {
    items: {
      type: "array", label: "Cards",
      arrayFields: {
        icon: { type: "select", label: "Icon", options: ICON_OPTIONS },
        iconColor: {
          type: "select", label: "Icon color",
          options: [
            { label: "Accent (pink)", value: "accent" },
            { label: "Accent2 (purple)", value: "accent2" },
            { label: "Accent3 (cyan)", value: "accent3" },
          ],
        },
        title: { type: "text", label: "Title" },
        line1: { type: "text", label: "Line 1" },
        line2: { type: "text", label: "Line 2" },
        href: { type: "text", label: "Link (tel:, mailto:, or URL)" },
      },
      getItemSummary: (i) => i.title || "Card",
    },
  },
  defaultProps: {
    items: [
      { icon: "Phone", iconColor: "accent", title: "Call Us", line1: "(346) 317-7987", line2: "Mon-Sat, 9AM-6PM CT", href: "tel:+13463177987" },
      { icon: "Mail", iconColor: "accent2", title: "Email", line1: "info@xpressskins.com", line2: "We reply within 24 hours", href: "mailto:info@xpressskins.com" },
      { icon: "MapPin", iconColor: "accent3", title: "Studio", line1: "1804 W Sam Houston Pkwy N", line2: "Houston, TX 77043" },
      { icon: "Clock", iconColor: "accent3", title: "Business Hours", line1: "Monday - Saturday: 9AM - 6PM CT", line2: "Sunday: Closed" },
    ],
  },
  render: ({ items }) => {
    const colorBg = (c?: string) =>
      c === "accent2" ? "bg-accent2/10" : c === "accent3" ? "bg-accent3/[0.08]" : "bg-accent/[0.08]";
    const colorText = (c?: string) =>
      c === "accent2" ? "text-accent2" : c === "accent3" ? "text-accent3" : "text-accent";
    return (
      <div className="space-y-6">
        {items?.map((it, i) => {
          const inner = (
            <>
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colorBg(it.iconColor)} transition-colors`}>
                <Icon name={it.icon} size={20} className={colorText(it.iconColor)} />
              </div>
              <div>
                <h3 className="mb-1 font-bold text-white">{it.title}</h3>
                {it.line1 && <p className="text-sm text-muted-light">{it.line1}</p>}
                {it.line2 && <p className="mt-1 text-xs text-muted">{it.line2}</p>}
              </div>
            </>
          );
          const cls = "group flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all";
          return it.href ? (
            <a key={i} href={it.href} className={`${cls} hover:border-accent/20`}>{inner}</a>
          ) : (
            <div key={i} className={cls}>{inner}</div>
          );
        })}
      </div>
    );
  },
};

/* ─────────────────────────────────────────────────────────
   15. SocialLinks
   ───────────────────────────────────────────────────────── */
export const SocialLinks: ComponentConfig<{
  heading?: string;
  links: { label: string; href: string }[];
}> = {
  label: "Social Links",
  fields: {
    heading: { type: "text", label: "Heading" },
    links: {
      type: "array", label: "Links",
      arrayFields: {
        label: { type: "text", label: "Label" },
        href: { type: "text", label: "URL" },
      },
      getItemSummary: (i) => i.label || "Link",
    },
  },
  defaultProps: {
    heading: "Follow Us",
    links: [
      { label: "Instagram", href: "https://www.instagram.com/xpressskins/" },
      { label: "TikTok", href: "https://www.tiktok.com/@xpress_skins_" },
      { label: "YouTube", href: "https://www.youtube.com/@XpressSkins" },
      { label: "Facebook", href: "https://www.facebook.com/xpressskins2018/" },
    ],
  },
  render: ({ heading, links }) => (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
      {heading && (
        <h3 className="mb-3 flex items-center gap-2 font-bold text-white">
          <MessageCircle size={16} className="text-accent" /> {heading}
        </h3>
      )}
      <div className="flex flex-wrap gap-3">
        {links?.map((l, i) => (
          <a key={i} href={l.href} target="_blank" rel="noopener noreferrer"
             className="rounded-full border border-white/5 bg-white/5 px-4 py-2 text-sm font-medium text-muted-light transition-all hover:border-accent/20 hover:bg-accent/[0.08] hover:text-accent">
            {l.label}
          </a>
        ))}
      </div>
    </div>
  ),
};

/* ─────────────────────────────────────────────────────────
   16. ContactForm (functional — keeps original form)
   ───────────────────────────────────────────────────────── */
type ContactFormProps = {
  buttonLabel?: string;
  successHeading?: string;
  successBody?: string;
};
function ContactFormInner({ buttonLabel, successHeading, successBody }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", vehicle: "", message: "", designType: "fullcustom",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name, email: formData.email, phone: formData.phone,
          vehicle_info: formData.vehicle, wrap_type: formData.designType, message: formData.message,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-accent3/20 bg-white/[0.02] p-12 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent3/10">
          <Send size={24} className="text-accent3" />
        </div>
        <h3 className="mb-3 text-2xl font-bold text-white">{successHeading || "Message Sent!"}</h3>
        <p className="text-muted-light">{successBody || "Thank you for reaching out. We'll get back to you within 24 hours."}</p>
      </div>
    );
  }

  const inputCls = "w-full rounded-xl border border-white/10 bg-surface-2 px-4 py-3 text-white placeholder:text-dark-500 transition-colors focus:border-accent focus:outline-none";
  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-white/5 bg-white/[0.02] p-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-muted-light">Name *</label>
          <input type="text" required value={formData.name}
                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                 className={inputCls} placeholder="Your name" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-muted-light">Email *</label>
          <input type="email" required value={formData.email}
                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                 className={inputCls} placeholder="you@email.com" />
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-muted-light">Phone</label>
          <input type="tel" value={formData.phone}
                 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                 className={inputCls} placeholder="(555) 123-4567" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-muted-light">Vehicle (Year Make Model)</label>
          <input type="text" value={formData.vehicle}
                 onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                 className={inputCls} placeholder="2024 Honda Civic" />
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-muted-light">Design Type</label>
        <select value={formData.designType}
                onChange={(e) => setFormData({ ...formData, designType: e.target.value })}
                className={inputCls}>
          <option value="premade">Pre-Made Design</option>
          <option value="semicustom">Semi-Custom</option>
          <option value="fullcustom">Fully Custom Itasha</option>
          <option value="other">Other / Not Sure</option>
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-muted-light">Tell Us About Your Vision *</label>
        <textarea required rows={4} value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`${inputCls} resize-none`}
                  placeholder="Which anime/character? What kind of wrap coverage? Any reference images?" />
      </div>
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
      )}
      <button type="submit" disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent2 px-8 py-4 text-base font-bold text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_#ff2d7b44] disabled:cursor-not-allowed disabled:opacity-50">
        {submitting ? "Sending…" : (buttonLabel || "Send Message")}
      </button>
    </form>
  );
}
export const ContactForm: ComponentConfig<ContactFormProps> = {
  label: "Contact Form",
  fields: {
    buttonLabel: { type: "text", label: "Submit button label" },
    successHeading: { type: "text", label: "Success heading" },
    successBody: { type: "textarea", label: "Success message" },
  },
  defaultProps: {
    buttonLabel: "Send Message",
    successHeading: "Message Sent!",
    successBody: "Thank you for reaching out. We'll get back to you within 24 hours.",
  },
  render: (props) => <ContactFormInner {...props} />,
};

/* ─────────────────────────────────────────────────────────
   17. TwoColumnLayout — left/right split (for contact)
   ───────────────────────────────────────────────────────── */
// (Not needed as a Puck block — we model the contact body as a
// PageHero followed by a single Section that contains both columns.)
// We'll use a dedicated ContactSection block instead:
export const ContactSection: ComponentConfig<{
  leftWeight?: "2/5" | "1/2";
  // Children go via DropZone — but to keep the JSON simple, we
  // accept prebuilt left/right slots as raw inner blocks via separate Puck zones.
}> = {
  label: "Contact Section (2 columns)",
  fields: {
    leftWeight: {
      type: "select", label: "Left column weight",
      options: [{ label: "2/5 (info side)", value: "2/5" }, { label: "1/2", value: "1/2" }],
    },
  },
  defaultProps: { leftWeight: "2/5" },
  render: ({ leftWeight }) => {
    const cols = leftWeight === "1/2" ? "lg:grid-cols-2" : "lg:grid-cols-5";
    const left = leftWeight === "1/2" ? "" : "lg:col-span-2";
    const right = leftWeight === "1/2" ? "" : "lg:col-span-3";
    return (
      <section className="relative pb-32">
        <div className="absolute inset-0 bg-background" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-8">
          <div className={`grid gap-12 ${cols}`}>
            <div className={left}><DropZone zone="left" /></div>
            <div className={right}><DropZone zone="right" /></div>
          </div>
        </div>
      </section>
    );
  },
};

/* ─────────────────────────────────────────────────────────
   18. PortfolioGallery — filterable image grid + lightbox
   ───────────────────────────────────────────────────────── */
export const PortfolioGallery: ComponentConfig<{
  showFilters?: boolean;
  showCount?: boolean;
}> = {
  label: "Portfolio Gallery (filterable)",
  fields: {
    showFilters: { type: "radio", label: "Show category filters", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
    showCount: { type: "radio", label: "Show count", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
  },
  defaultProps: { showFilters: true, showCount: true },
  render: ({ showFilters, showCount }) => <PortfolioGalleryInner showFilters={!!showFilters} showCount={!!showCount} />,
};
function PortfolioGalleryInner({ showFilters, showCount }: { showFilters: boolean; showCount: boolean }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const categories = ["All", "Full Wrap", "Partial Wrap"];
  const filtered = activeCategory === "All" ? allImages : allImages.filter((i) => i.category === activeCategory);
  const open = (i: number) => setLightboxIdx(i);
  const close = () => setLightboxIdx(null);
  const next = () => lightboxIdx !== null && setLightboxIdx((lightboxIdx + 1) % filtered.length);
  const prev = () => lightboxIdx !== null && setLightboxIdx((lightboxIdx - 1 + filtered.length) % filtered.length);
  return (
    <>
      {showFilters && (
        <section className="relative pb-8">
          <div className="absolute inset-0 bg-background" />
          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-3">
              <FilterIcon size={16} className="text-muted" />
              {categories.map((c) => (
                <button key={c} onClick={() => setActiveCategory(c)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                          activeCategory === c ? "bg-accent text-white" : "bg-white/5 text-muted-light hover:bg-white/10"
                        }`}>
                  {c}
                </button>
              ))}
              {showCount && <span className="ml-auto text-xs text-muted">{filtered.length} builds</span>}
            </div>
          </div>
        </section>
      )}
      <section className="relative pb-32">
        <div className="absolute inset-0 bg-background" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence>
              {filtered.map((item, i) => (
                <motion.div key={item.id} layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="group cursor-pointer" onClick={() => open(i)}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/5 bg-surface-1 transition-all hover:border-accent/30">
                    <Image src={driveImg(item.id, 600)} alt={item.alt} fill
                           className="object-cover transition-transform duration-700 group-hover:scale-110"
                           sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/80">
                        <Eye size={20} className="text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 translate-y-full p-4 transition-transform group-hover:translate-y-0">
                      <span className="inline-block rounded-full bg-accent/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent backdrop-blur-sm">
                        {item.category}
                      </span>
                      <p className="mt-1 text-xs text-white/80">{item.alt}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
      <AnimatePresence>
        {lightboxIdx !== null && filtered[lightboxIdx] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl"
                      onClick={close}>
            <button onClick={close} className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20">
              <XIcon size={20} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); prev(); }}
                    className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-accent/60">
              <ChevronLeft size={24} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); next(); }}
                    className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-accent/60">
              <ChevronRight size={24} />
            </button>
            <motion.div key={filtered[lightboxIdx].id}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative max-h-[85vh] max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-surface-1"
                        onClick={(e) => e.stopPropagation()}>
              <div className="relative aspect-video">
                <Image src={driveImg(filtered[lightboxIdx].id, 1600)} alt={filtered[lightboxIdx].alt} fill className="object-cover" />
              </div>
              <div className="p-6">
                <p className="text-lg font-bold text-white">{filtered[lightboxIdx].alt}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-accent/20 bg-accent/[0.08] px-3 py-1 text-xs text-accent">{filtered[lightboxIdx].category}</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-light">Xpress Skins Inc.</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   19. VideoGallery — grid of videos
   ───────────────────────────────────────────────────────── */
export const VideoGallery: ComponentConfig<{
  eyebrow?: string;
  heading?: string;
  start?: number;
  count?: number;
}> = {
  label: "Video Gallery (grid)",
  fields: {
    eyebrow: { type: "text", label: "Eyebrow" },
    heading: { type: "text", label: "Heading" },
    start: { type: "number", label: "Start index" },
    count: { type: "number", label: "Count" },
  },
  defaultProps: {
    eyebrow: "Video Gallery",
    heading: "Watch Our Builds",
    start: 0, count: 6,
  },
  render: ({ eyebrow, heading, start = 0, count = 6 }) => {
    const grid = videoAssets.slice(start, start + count);
    return (
      <section className="relative pb-12">
        <div className="absolute inset-0 bg-background" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          {(eyebrow || heading) && (
            <Reveal className="mb-6">
              {eyebrow && (
                <span className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-accent">
                  <Play size={12} className="fill-accent" /> {eyebrow}
                </span>
              )}
              {heading && <h2 className="text-2xl font-black text-white md:text-3xl">{heading}</h2>}
            </Reveal>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {grid.map((v, i) => (
              <Reveal key={v.id} delay={i * 0.08}>
                <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/[0.06] bg-surface-1">
                  <iframe src={driveVideo(v.id)} title={v.title} allow="autoplay; encrypted-media" allowFullScreen className="h-full w-full border-0" />
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent/80">{v.category}</span>
                    <h3 className="text-sm font-bold text-white">{v.title}</h3>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    );
  },
};

/* ─────────────────────────────────────────────────────────
   20. PhysicsBalls — wraps the IntroAnimation component
   ───────────────────────────────────────────────────────── */
import PhysicsBallsSection from "@/components/IntroAnimation";
export const PhysicsBalls: ComponentConfig<Record<string, never>> = {
  label: "Physics Balls Animation",
  fields: {},
  defaultProps: {},
  render: () => <PhysicsBallsSection />,
};
