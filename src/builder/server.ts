/**
 * Server-side helpers: load active theme + look up page by slug.
 */
import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import type { PageRow, Theme } from "./types";

export async function getActiveTheme(): Promise<Theme | null> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("themes")
    .select("*")
    .eq("is_default", true)
    .maybeSingle();
  return (data as Theme | null) ?? null;
}

export async function getPublishedPageBySlug(
  slug: string,
): Promise<PageRow | null> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("builder_pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return (data as PageRow | null) ?? null;
}

export async function getPageById(id: string): Promise<PageRow | null> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("builder_pages")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as PageRow | null) ?? null;
}

export async function listPages(): Promise<PageRow[]> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("builder_pages")
    .select("*")
    .order("updated_at", { ascending: false });
  return (data as PageRow[] | null) ?? [];
}

export async function isBuilderUser(): Promise<{
  user: { id: string; email?: string | null } | null;
  role: "admin" | "editor" | null;
}> {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, role: null };
  const { data: row } = await supabase
    .from("admin_users")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();
  return {
    user: { id: user.id, email: user.email },
    role: (row?.role as "admin" | "editor" | undefined) ?? null,
  };
}
