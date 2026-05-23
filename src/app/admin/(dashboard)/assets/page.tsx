import { redirect } from "next/navigation";
import { isBuilderUser } from "@/builder/server";
import { createServerSupabase } from "@/lib/supabase/server";
import AssetLibrary from "./AssetLibrary";
import type { AssetRow } from "@/builder/types";

export const dynamic = "force-dynamic";

export default async function AssetsPage() {
  const { role } = await isBuilderUser();
  if (!role) redirect("/admin/login");
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("builder_assets")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  const assets = (data as AssetRow[] | null) ?? [];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Assets</h1>
        <p className="text-sm text-gray-400">
          Upload images, SVGs and videos to use across the site.
        </p>
      </div>
      <AssetLibrary initial={assets} />
    </div>
  );
}
