#!/usr/bin/env node
/**
 * Strip any PhysicsBalls blocks from the home page's draft_data and
 * published_data in builder_pages.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

try {
  const text = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const supabase = createClient(url, key, { auth: { persistSession: false } });

const SLUG = "home";

function strip(data) {
  if (!data || !Array.isArray(data.content)) return data;
  return {
    ...data,
    content: data.content.filter((b) => b?.type !== "PhysicsBalls"),
  };
}

const { data: row, error } = await supabase
  .from("builder_pages")
  .select("id, slug, draft_data, published_data")
  .eq("slug", SLUG)
  .single();
if (error) {
  console.error(error);
  process.exit(1);
}

const update = {
  draft_data: strip(row.draft_data),
  published_data: strip(row.published_data),
};
const { error: upErr } = await supabase
  .from("builder_pages")
  .update(update)
  .eq("id", row.id);
if (upErr) {
  console.error(upErr);
  process.exit(1);
}
console.log(`Stripped PhysicsBalls from /${SLUG}`);
