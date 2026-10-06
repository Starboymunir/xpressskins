// Downloads the matched Sketchfab models and optimises them for the browser.
// Needs SKETCHFAB_TOKEN in .env.local (Sketchfab > Settings > Password & API).
//
//   node scripts/fetch-models.mjs            # all matched groups
//   node scripts/fetch-models.mjs --limit 20 # first 20, most popular makes first
//
// Output: public/models/cars/<uid>.glb + src/data/carModels.json (manifest + credits)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import os from "node:os";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const env = fs.existsSync(path.join(ROOT, ".env.local")) ? fs.readFileSync(path.join(ROOT, ".env.local"), "utf8") : "";
const TOKEN = process.env.SKETCHFAB_TOKEN || env.match(/^SKETCHFAB_TOKEN=(.+)$/m)?.[1]?.trim();
if (!TOKEN) { console.error("Missing SKETCHFAB_TOKEN in .env.local"); process.exit(1); }

const limitArg = process.argv.indexOf("--limit");
const LIMIT = limitArg > 0 ? +process.argv[limitArg + 1] : Infinity;
const MATCHES = JSON.parse(fs.readFileSync(path.join(ROOT, "data/model-matches.json"), "utf8")).queries;
const OUTDIR = path.join(ROOT, "public/models/cars");
const MANIFEST = path.join(ROOT, "src/data/carModels.json");
fs.mkdirSync(OUTDIR, { recursive: true });
const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, "utf8")) : { models: {}, groups: {} };

const POPULAR = ["Toyota", "Honda", "Ford", "Chevrolet", "Nissan", "Subaru", "Tesla", "Jeep", "Dodge", "Ram", "Hyundai", "Kia", "Mazda", "BMW", "Mercedes-Benz", "Audi", "Lexus", "Volkswagen", "GMC"];
const order = Object.entries(MATCHES)
  .filter(([, q]) => q.candidates.length)
  .sort(([, a], [, b]) => (POPULAR.indexOf(a.make) + 1 || 99) - (POPULAR.indexOf(b.make) + 1 || 99));

const gt = path.join(ROOT, "node_modules/.bin", process.platform === "win32" ? "gltf-transform.cmd" : "gltf-transform");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let done = 0;

for (const [key, q] of order) {
  if (done >= LIMIT) break;
  // skip movie cars, old generations and race/wreck versions when a cleaner candidate exists
  const UNSUITABLE = /F&F|fast ?(and|&) ?furious|furious|\bice\b|'[5-9]\d\b|\b19[5-9]\d\b|nascar|wreck|crash|rally|drift|widebody|police|taxi/i;
  const pick = q.candidates.find((c) => !UNSUITABLE.test(c.name)) ?? q.candidates[0];
  manifest.groups[key] = { make: q.make, base: q.base, body: q.body, models: q.models, uid: pick.uid };
  if (manifest.models[pick.uid]?.file) { done++; continue; }
  try {
    const res = await fetch(`https://api.sketchfab.com/v3/models/${pick.uid}/download`, { headers: { Authorization: `Token ${TOKEN}` } });
    if (res.status === 401 || res.status === 403) throw new Error(`auth ${res.status} (check token)`);
    if (res.status === 429) { await sleep(10000); continue; }
    const info = await res.json();
    const glb = info.glb?.url;
    if (!glb) throw new Error("no GLB archive offered");
    const tmp = path.join(os.tmpdir(), `${pick.uid}.glb`);
    fs.writeFileSync(tmp, Buffer.from(await (await fetch(glb)).arrayBuffer()));
    const out = path.join(OUTDIR, `${pick.uid}.glb`);
    execFileSync(gt, ["optimize", tmp, out, "--compress", "draco", "--texture-compress", "webp", "--texture-size", "2048", "--simplify", "false"], { stdio: "ignore", shell: process.platform === "win32" });
    fs.rmSync(tmp, { force: true });
    manifest.models[pick.uid] = { file: `/models/cars/${pick.uid}.glb`, name: pick.name, author: pick.author, authorUrl: pick.authorUrl, url: pick.url, license: pick.license, bytes: fs.statSync(out).size };
    console.log(`✓ ${key.padEnd(36)} ${(fs.statSync(out).size / 1e6).toFixed(1)} MB  "${pick.name}" by ${pick.author}`);
  } catch (e) {
    manifest.models[pick.uid] = { ...manifest.models[pick.uid], error: String(e.message || e) };
    console.log(`✗ ${key.padEnd(36)} ${e.message || e}`);
  }
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1));
  done++;
  await sleep(1200);
}
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1));
const ok = Object.values(manifest.models).filter((m) => m.file).length;
console.log(`\n${ok} models ready in public/models/cars`);
