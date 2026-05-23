import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { isBuilderUser } from "@/builder/server";

export async function GET() {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from("themes").select("*").order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ themes: data });
}

export async function PUT(req: Request) {
  const { role } = await isBuilderUser();
  if (!role) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await req.json()) as {
    id: string;
    name?: string;
    tokens?: unknown;
    is_default?: boolean;
  };
  const supabase = await createServerSupabase();

  if (body.is_default) {
    // Clear other defaults first
    await supabase.from("themes").update({ is_default: false }).eq("is_default", true);
  }

  const patch: Record<string, unknown> = {};
  if (body.name !== undefined) patch.name = body.name;
  if (body.tokens !== undefined) patch.tokens = body.tokens;
  if (body.is_default !== undefined) patch.is_default = body.is_default;

  const { data, error } = await supabase
    .from("themes")
    .update(patch)
    .eq("id", body.id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ theme: data });
}
