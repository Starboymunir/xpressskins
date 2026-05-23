/**
 * One-shot Supabase bootstrap:
 *  1. Create the `builder-assets` storage bucket (public).
 *  2. Create the admin user (or reuse existing) and insert into admin_users.
 *
 * Reads env vars:
 *   NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL)
 *   SUPABASE_SERVICE_ROLE_KEY
 *   ADMIN_EMAIL
 *   ADMIN_PASSWORD
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Load .env.local manually (no dep on dotenv)
try {
  const envPath = resolve(process.cwd(), ".env.local");
  const text = readFileSync(envPath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
if (!adminEmail || !adminPassword) {
  console.error("Missing ADMIN_EMAIL or ADMIN_PASSWORD env vars");
  process.exit(1);
}

const sb = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── 1. Storage bucket ──────────────────────────────────────────────
console.log("→ Ensuring storage bucket 'builder-assets'…");
{
  const { data: existing } = await sb.storage.getBucket("builder-assets");
  if (existing) {
    console.log("  ✓ bucket already exists");
  } else {
    const { error } = await sb.storage.createBucket("builder-assets", {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024,
    });
    if (error) {
      console.error("  ✗ failed:", error.message);
      process.exit(1);
    }
    console.log("  ✓ bucket created (public)");
  }
}

// ── 2. Admin user ──────────────────────────────────────────────────
console.log(`→ Ensuring admin user '${adminEmail}'…`);
let userId;
{
  // Try create; if it already exists, look it up
  const { data: created, error: createErr } = await sb.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
  });

  if (created?.user) {
    userId = created.user.id;
    console.log("  ✓ user created:", userId);
  } else if (
    createErr &&
    /already (registered|been registered|exists)/i.test(createErr.message)
  ) {
    // Find existing user by paging through admin.listUsers
    let page = 1;
    while (true) {
      const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 200 });
      if (error) {
        console.error("  ✗ listUsers failed:", error.message);
        process.exit(1);
      }
      const found = data.users.find(
        (u) => u.email?.toLowerCase() === adminEmail.toLowerCase(),
      );
      if (found) {
        userId = found.id;
        break;
      }
      if (data.users.length < 200) break;
      page += 1;
    }
    if (!userId) {
      console.error("  ✗ user reportedly exists but not found");
      process.exit(1);
    }
    console.log("  ✓ user already exists:", userId);
  } else {
    console.error("  ✗ createUser failed:", createErr?.message);
    process.exit(1);
  }
}

// ── 3. admin_users row ─────────────────────────────────────────────
console.log("→ Ensuring admin_users row…");
{
  const { error } = await sb
    .from("admin_users")
    .upsert(
      { user_id: userId, email: adminEmail, role: "admin" },
      { onConflict: "user_id" },
    );
  if (error) {
    console.error("  ✗ upsert failed:", error.message);
    process.exit(1);
  }
  console.log("  ✓ admin role granted");
}

console.log("\nAll done. You can now log in at /admin/login.");
