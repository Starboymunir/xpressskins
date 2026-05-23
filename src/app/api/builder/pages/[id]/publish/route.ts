import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { isBuilderUser } from "@/builder/server";

type Ctx = { params: Promise<{ id: string }> };

/** Promote draft_data → published_data and flip status. */
export async function POST(_req: Request, { params }: Ctx) {
  const { role, user } = await isBuilderUser();
  if (!role) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: current, error: e1 } = await supabase
    .from("builder_pages")
    .select("draft_data")
    .eq("id", id)
    .maybeSingle();
  if (e1) return NextResponse.json({ error: e1.message }, { status: 500 });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await supabase.from("builder_page_versions").insert({
    page_id: id,
    data: current.draft_data,
    label: "publish",
    created_by: user?.id ?? null,
  });

  const { data, error } = await supabase
    .from("builder_pages")
    .update({
      published_data: current.draft_data,
      status: "published",
      published_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ page: data });
}
