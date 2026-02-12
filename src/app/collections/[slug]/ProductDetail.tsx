"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ArrowLeft, ArrowRight, Star, ShieldCheck, Clock, Truck, Check } from "lucide-react";

const FEATURES: Record<string, { icon: typeof ShieldCheck; items: string[] }> = {
  full_wrap: {
    icon: Star,
    items: [
      "Full vehicle coverage — every panel",
      "Premium Avery Dennison or 3M vinyl",
      "Custom artwork by our design team",
      "Up to 3 revision rounds",
      "5-year vinyl warranty",
      "Professional installation",
    ],
  },
  partial_wrap: {
    icon: Star,
    items: [
      "Doors & quarter panels",
      "Premium Avery Dennison vinyl",
      "Custom artwork included",
      "2 revision rounds",
      "5-year vinyl warranty",
      "Professional installation",
    ],
  },
  hood: {
    icon: Star,
    items: [
      "Full hood coverage",
      "Premium cast vinyl",
      "Custom character artwork",
      "2 revision rounds",
      "5-year warranty",
      "Professional install",
    ],
  },
  trunk: {
    icon: Star,
    items: [
      "Full trunk lid coverage",
      "Optional perf vinyl for rear window",
      "Custom artwork",
      "2 revision rounds",
      "5-year warranty",
      "Professional install",
    ],
  },
  color_change: {
    icon: Star,
    items: [
      "Full vehicle color change",
      "Premium 3M or Avery vinyl",
      "Matte, gloss, satin or chrome",
      "Interior door jams included",
      "5-year vinyl warranty",
      "Professional installation",
    ],
  },
  custom: {
    icon: Star,
    items: [
      "Fully bespoke design",
      "Multi-character scenes, liveries, panels",
      "Unlimited concept sketches",
      "Up to 5 revision rounds",
      "Premium materials",
      "Professional installation",
    ],
  },
};

export function ProductDetail({ product }: { product: Product }) {
  const [checkingOut, setCheckingOut] = useState(false);
  const price = product.sale_price ?? product.base_price;
  const deposit = Math.round(price * 0.25);
  const features = FEATURES[product.category] ?? FEATURES.custom;

  async function handleCheckout() {
    setCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_slug: product.slug,
          product_name: product.name,
          wrap_type: product.category,
          total_price: price,
          deposit_amount: deposit,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setCheckingOut(false);
    }
  }

  return (
    <>
      {/* Back nav */}
      <section className="relative pt-28 pb-4">
        <div className="absolute inset-0 bg-background" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
          <Link href="/collections" className="inline-flex items-center gap-2 text-sm text-muted-light hover:text-white transition-colors">
            <ArrowLeft size={14} /> Back to Shop
          </Link>
        </div>
      </section>

      <section className="relative pb-32">
        <div className="absolute inset-0 bg-background" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left — Visual */}
            <AnimatedSection>
              <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02]">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-[400px] object-cover"
                  />
                ) : (
                  <div className="w-full h-[400px] bg-gradient-to-br from-accent/20 via-accent2/20 to-accent3/20 flex items-center justify-center">
                    <span className="text-6xl">
                      {product.category === "full_wrap" ? "🎌" :
                        product.category === "partial_wrap" ? "✨" :
                        product.category === "hood" ? "🔥" :
                        product.category === "trunk" ? "🎨" :
                        product.category === "color_change" ? "🌈" : "⚡"}
                    </span>
                  </div>
                )}
              </div>
            </AnimatedSection>

            {/* Right — Details */}
            <AnimatedSection delay={0.1}>
              <div className="space-y-6">
                {product.featured && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-400 text-xs font-bold">
                    <Star size={10} fill="currentColor" /> Featured
                  </span>
                )}

                <h1 className="text-3xl md:text-4xl font-black text-white">{product.name}</h1>

                <p className="text-muted-light text-base leading-relaxed">{product.description}</p>

                {/* Price block */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-baseline gap-3 mb-2">
                    {product.sale_price ? (
                      <>
                        <span className="text-3xl font-black text-white">${product.sale_price.toLocaleString()}</span>
                        <span className="text-lg text-muted line-through">${product.base_price.toLocaleString()}</span>
                        <span className="text-sm text-accent font-bold">
                          Save ${(product.base_price - product.sale_price).toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-xs text-muted uppercase tracking-wider">From</span>
                        <span className="text-3xl font-black text-white">${product.base_price.toLocaleString()}</span>
                      </>
                    )}
                  </div>

                  {/* Payment schedule */}
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                      <p className="text-accent font-bold text-lg">25%</p>
                      <p className="text-muted text-xs">Deposit</p>
                      <p className="text-white text-sm font-semibold">${deposit.toLocaleString()}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                      <p className="text-accent2 font-bold text-lg">50%</p>
                      <p className="text-muted text-xs">At Print</p>
                      <p className="text-white text-sm font-semibold">${Math.round(price * 0.5).toLocaleString()}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                      <p className="text-accent3 font-bold text-lg">25%</p>
                      <p className="text-muted text-xs">On Delivery</p>
                      <p className="text-white text-sm font-semibold">${Math.round(price * 0.25).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleCheckout}
                    disabled={checkingOut}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-accent to-accent2 rounded-full hover:shadow-[0_0_40px_#ff2d7b44] hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {checkingOut ? "Redirecting…" : `Pay ${deposit.toLocaleString()} Deposit`}
                    <ArrowRight size={18} />
                  </button>
                  <Link
                    href="/pricing"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white border border-white/10 rounded-full hover:bg-white/5 transition-all"
                  >
                    Customize Quote
                  </Link>
                </div>

                {/* Trust signals */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-green-400" /> 5‑year warranty</span>
                  <span className="flex items-center gap-1"><Clock size={14} className="text-accent3" /> 2–4 week turnaround</span>
                  <span className="flex items-center gap-1"><Truck size={14} className="text-accent2" /> Free local install</span>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* What's Included */}
          <AnimatedSection>
            <div className="mt-16 p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <h2 className="text-2xl font-black text-white mb-6">What&apos;s Included</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {features.items.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <Check size={16} className="text-accent mt-0.5 shrink-0" />
                    <span className="text-muted-light text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
