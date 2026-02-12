"use client";

import Image from "next/image";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Eye, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { driveImg, driveVideo, allImages, videoAssets } from "@/data/assets";
import { Play } from "lucide-react";

const categories = ["All", "Full Wrap", "Partial Wrap"];

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const filteredItems =
    activeCategory === "All"
      ? allImages
      : allImages.filter((item) => item.category === activeCategory);

  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);
  const nextImage = () => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx + 1) % filteredItems.length);
  };
  const prevImage = () => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden pb-12 pt-32">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute right-0 top-0 h-[400px] w-[600px] rounded-full bg-accent2/5 blur-[120px]" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center lg:px-8">
          <AnimatedSection>
            <h1 className="mb-4 text-4xl font-black text-white md:text-6xl">
              Our{" "}
              <span className="gradient-text-static">Portfolio</span>
            </h1>
            <p className="mx-auto max-w-xl text-lg text-muted-light">
              Every wrap tells a story. Browse our completed Itasha builds — all
              real work from our Houston studio.
            </p>
            <p className="mx-auto mt-2 max-w-lg text-sm text-muted">
              {allImages.length}+ completed builds and counting
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Video Gallery */}
      <section className="relative pb-12">
        <div className="absolute inset-0 bg-background" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection className="mb-6">
            <span className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-accent">
              <Play size={12} className="fill-accent" /> Video Gallery
            </span>
            <h2 className="text-2xl font-black text-white md:text-3xl">
              Watch Our Builds
            </h2>
          </AnimatedSection>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videoAssets.slice(0, 6).map((video, i) => (
              <AnimatedSection key={video.id} delay={i * 0.08}>
                <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/[0.06] bg-surface-1">
                  <iframe
                    src={driveVideo(video.id)}
                    title={video.title}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent/80">{video.category}</span>
                    <h3 className="text-sm font-bold text-white">{video.title}</h3>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="relative pb-8">
        <div className="absolute inset-0 bg-background" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <Filter size={16} className="text-muted" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-accent text-white"
                    : "bg-white/5 text-muted-light hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
            <span className="ml-auto text-xs text-muted">
              {filteredItems.length} builds
            </span>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="relative pb-32">
        <div className="absolute inset-0 bg-background" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            layout
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence>
              {filteredItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group cursor-pointer"
                  onClick={() => openLightbox(i)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/5 bg-surface-1 transition-all hover:border-accent/30">
                    <Image
                      src={driveImg(item.id, 600)}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
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

          {filteredItems.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-muted">No projects in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && filteredItems[lightboxIdx] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <X size={20} />
            </button>

            {/* Nav arrows */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-accent/60"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-accent/60"
            >
              <ChevronRight size={24} />
            </button>

            <motion.div
              key={filteredItems[lightboxIdx].id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-h-[85vh] max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-surface-1"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video">
                <Image
                  src={driveImg(filteredItems[lightboxIdx].id, 1600)}
                  alt={filteredItems[lightboxIdx].alt}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <p className="text-lg font-bold text-white">
                  {filteredItems[lightboxIdx].alt}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-accent/20 bg-accent/[0.08] px-3 py-1 text-xs text-accent">
                    {filteredItems[lightboxIdx].category}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-light">
                    Xpress Skins Inc.
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted">
                  {lightboxIdx + 1} of {filteredItems.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
