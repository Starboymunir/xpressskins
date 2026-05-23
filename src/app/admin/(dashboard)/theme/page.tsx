import { redirect } from "next/navigation";
import { isBuilderUser } from "@/builder/server";
import { createServerSupabase } from "@/lib/supabase/server";
import ThemeEditor from "./ThemeEditor";
import type { Theme } from "@/builder/types";

export const dynamic = "force-dynamic";

export default async function ThemePage() {
  const { role } = await isBuilderUser();
  if (!role) redirect("/admin/login");

  const supabase = await createServerSupabase();
  const { data } = await supabase.from("themes").select("*").order("name");
  const themes = (data as Theme[] | null) ?? [];
  const active =
    themes.find((t) => t.is_default) ?? themes[0] ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Theme</h1>
        <p className="text-sm text-gray-400">
          Edit brand colors, fonts and radii. Changes apply to every builder page after Save.
        </p>
      </div>
      {active ? (
        <ThemeEditor theme={active} />
      ) : (
        <p className="text-gray-400">
          No themes found. Run <code>supabase/add-builder-tables.sql</code> first.
        </p>
      )}
    </div>
  );
}
