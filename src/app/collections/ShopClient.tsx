"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Search, SlidersHorizontal, ShoppingBag, ArrowRight, Star } from "lucide-react";

const CATEGORIES = [
  { value: "all", label: "All Wraps" },
  { value: "full_wrap", label: "Full Wraps" },
  { value: "partial_wrap", label: "Partial Wraps" },
  { value: "hood", label: "Hood Wraps" },
  { value: "trunk", label: "Trunk Wraps" },
  { value: "color_change", label: "Color Change" },
  { value: "custom", label: "Custom" },
];

// Fallback products when DB is empty (so the shop never looks bare)
const FALLBACK_PRODUCTS: Omit<Product, "id" | "created_at" | "updated_at">[] = [
  {
    name: "Full Body Itasha Wrap",
    slug: "full-body-itasha-wrap",
    description: "Complete vehicle transformation with your favorite anime characters. Premium Avery Dennison vinyl, full coverage from bumper to bumper. Includes custom artwork designed by our artists.",
    short_description: "Complete anime wrap — bumper to bumper",
    category: "full_wrap",
    base_price: 3500,
    sale_price: null,
    images: [],
    featured: true,
    status: "active",
    sort_order: 0,
  },
  {
    name: "Partial Wrap — Side Panels",
    slug: "partial-wrap-side-panels",
    description: "Eye-catching side panel wraps for doors and quarter panels. Perfect balance of impact and budget. Choose your characters, we'll design the layout.",
    short_description: "Doors & quarter panels — high impact",
    category: "partial_wrap",
    base_price: 1800,
    sale_price: 1499,
    images: [],
    featured: true,
    status: "active",
    sort_order: 1,
  },
  {
    name: "Hood Wrap — Character Feature",
    slug: "hood-wrap-character-feature",
    description: "Bold character artwork on your hood. The most popular entry point into itasha culture. Full custom artwork with 2 revision rounds included.",
    short_description: "Your character, front and center",
    category: "hood",
    base_price: 800,
    sale_price: 649,
    images: [],
    featured: true,
    status: "active",
    sort_order: 2,
  },
  {
    name: "Trunk Wrap — Waifu Window",
    slug: "trunk-wrap-waifu-window",
    description: "Full trunk lid wrap with transparent perforated vinyl option for rear windows. Showcase your favorite characters wherever you go.",
    short_description: "Trunk lid with optional perf window",
    category: "trunk",
    base_price: 600,
    sale_price: null,
    images: [],
    featured: false,
    status: "active",
    sort_order: 3,
  },
  {
    name: "Color Change Wrap",
    slug: "color-change-wrap",
    description: "Full vehicle color change with premium 3M or Avery vinyl. Matte, gloss, satin, chrome — transform your ride without permanent paint.",
    short_description: "Full color transformation, no paint",
    category: "color_change",
    base_price: 2800,
    sale_price: null,
    images: [],
    featured: false,
    status: "active",
    sort_order: 4,
  },
  {
    name: "Custom Design Package",
    slug: "custom-design-package",
    description: "Fully bespoke design service. Bring us your wildest ideas — multi-character scenes, racing liveries, manga panels — and we'll bring them to life.",
    short_description: "100% custom — your vision, our craft",
    category: "custom",
    base_price: 500,
    sale_price: null,
    images: [],
    featured: true,
    status: "active",
    sort_order: 5,
  },
];

function getCategoryColor(cat: string) {
  const map: Record<string, string> = {
    full_wrap: "from-[#ff1a6c] to-[#a855f7]",
    partial_wrap: "from-[#a855f7] to-[#06b6d4]",
    hood: "from-[#06b6d4] to-[#22c55e]",
    trunk: "from-[#f59e0b] to-[#ff1a6c]",
    color_change: "from-[#8b5cf6] to-[#ec4899]",
    custom: "from-[#ff1a6c] to-[#f59e0b]",
  };
  return map[cat] ?? "from-[#ff1a6c] to-[#a855f7]";
}

function getCategoryIcon(cat: string) {
  const map: Record<string, string> = {
    full_wrap: "🎌",
    partial_wrap: "✨",
    hood: "🔥",
    trunk: "🎨",
    color_change: "🌈",
    custom: "⚡",
  };
  return map[cat] ?? "🎨";
}

export function ShopClient({ products }: { products: Product[] }) {
  const items = products.length > 0 ? products : (FALLBACK_PRODUCTS as Product[]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return items.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [items, category, search]);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/[0.04] rounded-full blur-[120px]" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-subtle text-accent text-xs font-bold tracking-wider uppercase mb-6">
              <ShoppingBag size={12} /> The Wrap Shop
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              Shop{" "}
              <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
                Wraps
              </span>
            </h1>
            <p className="text-muted-light text-lg max-w-xl mx-auto">
              Browse our wrap packages, pick your style, and start your build with a 25% deposit.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="relative pb-32">
        <div className="absolute inset-0 bg-background" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
          {/* Filters */}
          <AnimatedSection>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setCategory(c.value)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      category === c.value
                        ? "bg-accent/10 text-accent border border-accent/20"
                        : "text-muted-light border border-white/5 hover:border-white/10 hover:text-white"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search wraps…"
                  className="pl-9 pr-4 py-2.5 w-full sm:w-64 rounded-xl bg-surface-2 border border-white/5 text-sm text-white placeholder:text-muted focus:border-accent/30 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </AnimatedSection>

          {/* Product Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-light text-lg">No wraps found for this filter.</p>
              <button onClick={() => { setCategory("all"); setSearch(""); }} className="mt-4 text-accent text-sm font-semibold hover:underline">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((product, i) => (
                <AnimatedSection key={product.slug} delay={i * 0.05}>
                  <div className="group relative flex flex-col h-full rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-accent/20 transition-all duration-500">
                    {/* Gradient header */}
                    <div className={`relative h-48 bg-gradient-to-br ${getCategoryColor(product.category)} opacity-80 group-hover:opacity-100 transition-opacity`}>
                      <div className="absolute inset-0 bg-black/30" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                        <span className="text-4xl mb-2">{getCategoryIcon(product.category)}</span>
                        <h3 className="text-xl font-black text-white drop-shadow-lg">{product.name}</h3>
                      </div>
                      {product.featured && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm text-yellow-400 text-xs font-bold">
                          <Star size={10} fill="currentColor" /> Featured
                        </div>
                      )}
                      {product.sale_price && (
                        <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-accent text-white text-xs font-bold">
                          SALE
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-5">
                      <p className="text-muted-light text-sm mb-4 flex-1">
                        {product.short_description || product.description.slice(0, 120)}
                      </p>

                      {/* Price */}
                      <div className="mb-4">
                        {product.sale_price ? (
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-white">${product.sale_price.toLocaleString()}</span>
                            <span className="text-sm text-muted line-through">${product.base_price.toLocaleString()}</span>
                          </div>
                        ) : (
                          <div className="flex items-baseline gap-1">
                            <span className="text-xs text-muted">from</span>
                            <span className="text-2xl font-black text-white">${product.base_price.toLocaleString()}</span>
                          </div>
                        )}
                        <p className="text-xs text-accent mt-1">
                          25% deposit = ${Math.round((product.sale_price ?? product.base_price) * 0.25).toLocaleString()} to start
                        </p>
                      </div>

                      {/* CTAs */}
                      <div className="flex gap-2">
                        <Link
                          href={`/collections/${product.slug}`}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-accent to-accent2 rounded-xl hover:shadow-[0_0_20px_#ff2d7b44] hover:scale-[1.02] transition-all"
                        >
                          View Details <ArrowRight size={14} />
                        </Link>
                        <Link
                          href={`/pricing`}
                          className="inline-flex items-center justify-center px-4 py-3 text-sm font-semibold text-muted-light border border-white/10 rounded-xl hover:bg-white/5 hover:text-white transition-all"
                        >
                          Get Quote
                        </Link>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}

          {/* Bottom CTA */}
          <AnimatedSection>
            <div className="mt-16 text-center">
              <div className="inline-block p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <h3 className="text-2xl font-black text-white mb-2">Can&apos;t find what you need?</h3>
                <p className="text-muted-light mb-6">Use our pricing wizard to build a custom quote in minutes.</p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-accent to-accent2 rounded-full hover:shadow-[0_0_40px_#ff2d7b44] hover:scale-105 transition-all"
                >
                  Build Your Quote <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
