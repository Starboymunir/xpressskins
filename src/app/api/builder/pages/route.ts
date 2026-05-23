import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { isBuilderUser } from "@/builder/server";
import { emptyData } from "@/builder/config";

export async function GET() {
  const { role } = await isBuilderUser();
  if (!role) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("builder_pages")
    .select("id,slug,title,status,in_nav,nav_label,nav_order,updated_at,published_at")
    .order("updated_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ pages: data });
}

export async function POST(req: Request) {
  const { role } = await isBuilderUser();
  if (!role) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await req.json()) as { slug: string; title: string };
  const slug = (body.slug || "").trim().replace(/^\/+|\/+$/g, "");
  if (!body.title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("builder_pages")
    .insert({
      slug,
      title: body.title,
      status: "draft",
      draft_data: emptyData,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ page: data });
}
