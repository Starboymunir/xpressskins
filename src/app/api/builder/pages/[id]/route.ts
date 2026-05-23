import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { isBuilderUser } from "@/builder/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { role } = await isBuilderUser();
  if (!role) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("builder_pages")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ page: data });
}

export async function PUT(req: Request, { params }: Ctx) {
  const { role, user } = await isBuilderUser();
  if (!role) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = (await req.json()) as {
    title?: string;
    slug?: string;
    draft_data?: unknown;
    seo?: unknown;
    in_nav?: boolean;
    nav_label?: string;
    nav_order?: number;
  };
  const supabase = await createServerSupabase();

  // Snapshot prior draft into versions for undo history
  const { data: existing } = await supabase
    .from("builder_pages")
    .select("draft_data")
    .eq("id", id)
    .maybeSingle();
  if (existing?.draft_data && body.draft_data) {
    await supabase.from("builder_page_versions").insert({
      page_id: id,
      data: existing.draft_data,
      label: "autosave",
      created_by: user?.id ?? null,
    });
  }

  const patch: Record<string, unknown> = {};
  if (body.title !== undefined) patch.title = body.title;
  if (body.slug !== undefined) patch.slug = body.slug.replace(/^\/+|\/+$/g, "");
  if (body.draft_data !== undefined) patch.draft_data = body.draft_data;
  if (body.seo !== undefined) patch.seo = body.seo;
  if (body.in_nav !== undefined) patch.in_nav = body.in_nav;
  if (body.nav_label !== undefined) patch.nav_label = body.nav_label;
  if (body.nav_order !== undefined) patch.nav_order = body.nav_order;

  const { data, error } = await supabase
    .from("builder_pages")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ page: data });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { role } = await isBuilderUser();
  if (role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { error } = await supabase.from("builder_pages").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
