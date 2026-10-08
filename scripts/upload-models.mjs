// Uploads optimised car models from public/models/cars to a public Supabase Storage
// bucket and rewrites src/data/carModels.json to point at the hosted URLs.
// Keeps gigabytes of 3D files out of git and out of the Vercel deploy.
//
//   node scripts/upload-models.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const env = Object.fromEntries(
  fs.readFileSync(path.join(ROOT, ".env.local"), "utf8").split(/\r?\n/).filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()]),
);
const url = env.NEXT_PUBLIC_SUPABASE_URL, key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error("Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local"); process.exit(1); }

const BUCKET = "car-models";
const sb = createClient(url, key, { auth: { persistSession: false } });
const { data: buckets } = await sb.storage.listBuckets();
if (!buckets?.some((b) => b.name === BUCKET)) {
  const { error } = await sb.storage.createBucket(BUCKET, { public: true, fileSizeLimit: "50MB" });
  if (error) { console.error("createBucket:", error.message); process.exit(1); }
  console.log(`created public bucket "${BUCKET}"`);
}

const MANIFEST = path.join(ROOT, "src/data/carModels.json");
const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
const DIR = path.join(ROOT, "public/models/cars");
let up = 0;
// only models that passed analysis, popular makes first
const POPULAR = ["Toyota", "Honda", "Ford", "Chevrolet", "Nissan", "Tesla", "Jeep", "Hyundai", "Kia", "Dodge", "Subaru", "Mazda", "BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Lexus", "GMC", "Ram"];
const makeOf = (uid) => Object.values(manifest.groups).find((g) => g.uid === uid)?.make ?? "";
const rank = (uid) => { const i = POPULAR.indexOf(makeOf(uid)); return i < 0 ? 99 : i; };
const queue = Object.entries(manifest.models).filter(([, m]) => m.file && m.config?.usable).sort(([a], [b]) => rank(a) - rank(b));
let bytes = 0;
const LIMIT = process.argv.includes("--limit") ? +process.argv[process.argv.indexOf("--limit") + 1] : Infinity;
for (const [uid, m] of queue) {
  if (up >= LIMIT) break;
  if (!m.file) continue;
  if (m.file.startsWith("http")) continue; // already hosted
  const local = path.join(DIR, `${uid}.glb`);
  if (!fs.existsSync(local)) continue;
  const { error } = await sb.storage.from(BUCKET).upload(`${uid}.glb`, fs.readFileSync(local), { contentType: "model/gltf-binary", upsert: true, cacheControl: "31536000" });
  if (error) { console.log(`✗ ${uid} ${error.message}`); continue; }
  m.file = sb.storage.from(BUCKET).getPublicUrl(`${uid}.glb`).data.publicUrl;
  up++; bytes += fs.statSync(local).size;
  console.log(`↑ ${m.name}`);
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1));
}
console.log(`\nuploaded ${up} models to Supabase Storage`);
