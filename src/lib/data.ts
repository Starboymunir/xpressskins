import { createServiceClient } from "@/lib/supabase/server";
import type { Product, PortfolioImage, PortfolioVideo, ContentBlock, Project } from "@/lib/types";

// ─── Products ─────────────────────────────────────────────
export async function getActiveProducts(): Promise<Product[]> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("status", "active")
      .order("sort_order");
    return (data as Product[]) ?? [];
  } catch {
    return [];
  }
}

// ─── Portfolio ────────────────────────────────────────────
export async function getPortfolioImages(): Promise<PortfolioImage[]> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("portfolio_images")
      .select("*")
      .order("sort_order");
    return (data as PortfolioImage[]) ?? [];
  } catch {
    return [];
  }
}

export async function getFeaturedImages(limit = 12): Promise<PortfolioImage[]> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("portfolio_images")
      .select("*")
      .eq("featured", true)
      .order("sort_order")
      .limit(limit);
    return (data as PortfolioImage[]) ?? [];
  } catch {
    return [];
  }
}

export async function getPortfolioVideos(): Promise<PortfolioVideo[]> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("portfolio_videos")
      .select("*")
      .order("sort_order");
    return (data as PortfolioVideo[]) ?? [];
  } catch {
    return [];
  }
}

export async function getFeaturedVideos(limit = 6): Promise<PortfolioVideo[]> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("portfolio_videos")
      .select("*")
      .eq("featured", true)
      .order("sort_order")
      .limit(limit);
    return (data as PortfolioVideo[]) ?? [];
  } catch {
    return [];
  }
}

// ─── Content Blocks ───────────────────────────────────────
export async function getContentBlocks(page: string): Promise<Record<string, string>> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("content_blocks")
      .select("*")
      .eq("page", page);
    const map: Record<string, string> = {};
    (data as ContentBlock[] ?? []).forEach((b) => {
      map[`${b.section}.${b.key}`] = b.value;
    });
    return map;
  } catch {
    return {};
  }
}

// ─── Projects ─────────────────────────────────────────────
export async function getActiveProjects(): Promise<Project[]> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("projects")
      .select("*")
      .neq("status", "completed")
      .order("created_at", { ascending: false });
    return (data as Project[]) ?? [];
  } catch {
    return [];
  }
}
