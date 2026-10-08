// Copies the usable (analysed, approved) car models into public/models/v/, which IS tracked
// by git and served by the site, and points src/data/carModels.json at them.
// Rejected models stay in the git-ignored public/models/cars/.
//
//   node scripts/publish-models.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = path.join(ROOT, "src/data/carModels.json");
const SRC = path.join(ROOT, "public/models/cars");
const DST = path.join(ROOT, "public/models/v");
fs.mkdirSync(DST, { recursive: true });

const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
let copied = 0, bytes = 0;
for (const [uid, m] of Object.entries(manifest.models)) {
  if (!m.config?.usable) continue;
  const from = path.join(SRC, `${uid}.glb`);
  const to = path.join(DST, `${uid}.glb`);
  if (!fs.existsSync(to)) {
    if (!fs.existsSync(from)) continue;
    fs.copyFileSync(from, to);
    copied++;
  }
  bytes += fs.statSync(to).size;
  m.file = `/models/v/${uid}.glb`;
}
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1));
const n = fs.readdirSync(DST).filter((f) => f.endsWith(".glb")).length;
console.log(`${n} models in public/models/v (${(bytes / 1e6).toFixed(0)} MB), ${copied} newly copied`);
