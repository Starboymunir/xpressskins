import { getActiveProducts } from "@/lib/data";
import { notFound } from "next/navigation";
import { ProductDetail } from "./ProductDetail";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await getActiveProducts();
  const product = products.find((p) => p.slug === slug);

  // Allow fallback products when DB is empty (match ShopClient fallback slugs)
  const FALLBACK_SLUGS = [
    "full-body-itasha-wrap",
    "partial-wrap-side-panels",
    "hood-wrap-character-feature",
    "trunk-wrap-waifu-window",
    "color-change-wrap",
    "custom-design-package",
  ];

  if (!product && !FALLBACK_SLUGS.includes(slug)) {
    notFound();
  }

  // Provide a simple fallback so the page still renders before the DB has products
  const fallbackMap: Record<string, { name: string; description: string; category: string; base_price: number; sale_price: number | null }> = {
    "full-body-itasha-wrap": { name: "Full Body Itasha Wrap", description: "Complete vehicle transformation with your favorite anime characters. Premium Avery Dennison vinyl, full coverage from bumper to bumper. Includes custom artwork designed by our in-house artists with up to 3 revision rounds.", category: "full_wrap", base_price: 3500, sale_price: null },
    "partial-wrap-side-panels": { name: "Partial Wrap — Side Panels", description: "Eye-catching side panel wraps for doors and quarter panels. Perfect balance of impact and budget. Choose your characters and we'll design the layout.", category: "partial_wrap", base_price: 1800, sale_price: 1499 },
    "hood-wrap-character-feature": { name: "Hood Wrap — Character Feature", description: "Bold character artwork on your hood. The most popular entry point into itasha culture. Full custom artwork with 2 revision rounds included.", category: "hood", base_price: 800, sale_price: 649 },
    "trunk-wrap-waifu-window": { name: "Trunk Wrap — Waifu Window", description: "Full trunk lid wrap with transparent perforated vinyl option for rear windows. Showcase your favorite characters wherever you go.", category: "trunk", base_price: 600, sale_price: null },
    "color-change-wrap": { name: "Color Change Wrap", description: "Full vehicle color change with premium 3M or Avery vinyl. Matte, gloss, satin, chrome — transform your ride without permanent paint.", category: "color_change", base_price: 2800, sale_price: null },
    "custom-design-package": { name: "Custom Design Package", description: "Fully bespoke design service. Bring us your wildest ideas — multi-character scenes, racing liveries, manga panels — and we'll bring them to life.", category: "custom", base_price: 500, sale_price: null },
  };

  const fb = fallbackMap[slug];
  const p = product ?? {
    id: slug,
    slug,
    name: fb?.name ?? slug,
    description: fb?.description ?? "",
    short_description: "",
    category: (fb?.category ?? "custom") as "full_wrap" | "partial_wrap" | "hood" | "trunk" | "color_change" | "custom",
    base_price: fb?.base_price ?? 0,
    sale_price: fb?.sale_price ?? null,
    images: [],
    featured: false,
    status: "active" as const,
    sort_order: 0,
    created_at: "",
    updated_at: "",
  };

  return <ProductDetail product={p} />;
}
