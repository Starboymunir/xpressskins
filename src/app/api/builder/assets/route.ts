import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { isBuilderUser } from "@/builder/server";

export async function GET() {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("builder_assets")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ assets: data });
}

export async function POST(req: Request) {
  const { role, user } = await isBuilderUser();
  if (!role) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file");
  const folder = ((formData.get("folder") as string) || "").replace(/^\/+|\/+$/g, "");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file missing" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const ext = file.name.split(".").pop() || "bin";
  const path = `${folder ? folder + "/" : ""}${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;

  const arrayBuf = await file.arrayBuffer();
  const { error: upErr } = await supabase.storage
    .from("builder-assets")
    .upload(path, arrayBuf, { contentType: file.type, upsert: false });
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 400 });

  const { data: pub } = supabase.storage.from("builder-assets").getPublicUrl(path);
  const type = file.type.startsWith("video")
    ? "video"
    : file.type === "image/svg+xml"
      ? "svg"
      : file.type.startsWith("image")
        ? "image"
        : "other";

  const { data, error } = await supabase
    .from("builder_assets")
    .insert({
      url: pub.publicUrl,
      storage_path: path,
      type,
      mime_type: file.type,
      size_bytes: file.size,
      folder,
      uploaded_by: user?.id ?? null,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ asset: data });
}
