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
    .from("builder_page_versions")
    .select("id,label,created_at,created_by")
    .eq("page_id", id)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ versions: data });
}

/** Restore a version into the draft. */
export async function POST(req: Request, { params }: Ctx) {
  const { role } = await isBuilderUser();
  if (!role) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { versionId } = (await req.json()) as { versionId: string };
  const supabase = await createServerSupabase();
  const { data: ver, error: e1 } = await supabase
    .from("builder_page_versions")
    .select("data")
    .eq("id", versionId)
    .eq("page_id", id)
    .maybeSingle();
  if (e1) return NextResponse.json({ error: e1.message }, { status: 500 });
  if (!ver) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { error } = await supabase
    .from("builder_pages")
    .update({ draft_data: ver.data })
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
