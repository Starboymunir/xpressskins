// Finds the best downloadable, commercially licensed Sketchfab model for every
// make + model in src/data/vehicles.ts. Search is public; no token needed.
// Output: data/model-matches.json
//
//   node scripts/match-models.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = fs.readFileSync(path.join(ROOT, "src/data/vehicles.ts"), "utf8");
const OUT = path.join(ROOT, "data/model-matches.json");

const rows = [...SRC.matchAll(/\{ make: "([^"]+)", model: "([^"]+)", year: (\d+), trim: "([^"]*)", totalSqft: ([\d.]+) \}/g)]
  .map((m) => ({ make: m[1], model: m[2], year: +m[3], trim: m[4] }));

/* ── body type classifier ── */
const TRUCK = /\b(f-?\d{3}|silverado|sierra|ram|1500|2500|3500|tacoma|tundra|ranger|colorado|canyon|frontier|titan|ridgeline|gladiator|gladitor|dakota|maverick|santa cruz|cybertruck|sut|pickup|cab|bed)\b/i;
const VAN = /\b(transit|sprinter|promaster|express|savana|e-\d{3}|odyssey|sienna|pacifica|carnival|sedona|quest|caravan|grand caravan|freestar|entourage|metris|nv\d+|van|shuttle|town & country)\b/i;
const SUV = /\b(suv|cuv|4runner|wrangler|bronco|cherokee|grand cherokee|wagoneer|durango|explorer|expedition|escape|edge|tahoe|suburban|yukon|traverse|equinox|blazer|trax|acadia|terrain|enclave|encore|envision|highlander|rav4|sequoia|land cruiser|cr-v|hr-v|pilot|passport|cx-\d+|rogue|murano|pathfinder|armada|kicks|juke|outback|forester|ascent|crosstrek|tucson|santa fe|palisade|kona|sorento|telluride|sportage|seltos|niro|atlas|tiguan|id\.4|q\d|x\d|gl[abceks]?-class|g-class|eq[bce]|range rover|defender|discovery|cayenne|macan|model x|model y|compass|renegade|journey|flex|aviator|navigator|nautilus|corsair|xt\d|escalade|qx\d+|rdx|mdx|gx\d+|lx\d+|rx\d*|nx|ux|f-pace|e-pace|countryman|ecosport|h[123]|fj cruiser|element|c-hr|corolla cross|venza|trailblazer|envista|eclipse cross|outlander|ariya|ioniq 5|ev6|gv\d+|stelvio|levante|urus|bentayga|cullinan|grecale|mustang mach-e|freelander|lr\d|commander|aspen|envoy|crosstour)\b/i;
const SPORT = /\b(911|718|cayman|boxster|corvette|gt-r|370z|350z|\bz\b|supra|gr86|86|brz|fr-s|mx-5|miata|nsx|r8|huracan|aventador|amg gt|f-type|4c|i8|m[2-8]\b|rc ?f|lc ?500|viper|camaro|mustang|challenger|challanger|charger|gto|genesis coupe|celica|s2000|tt|128i|spider|spyder|roadster|db\d+|dbs|vantage|california|488|f8|gt3|gt4|type-r|sti|wrx|focus rs|gr corolla|golf r)\b/i;
function bodyType({ model, trim }) {
  const s = `${model} ${trim}`;
  if (VAN.test(s)) return "van";
  if (TRUCK.test(s)) return "truck";
  if (/convertible|cabrio|roadster|spyder|spider|volante/i.test(s)) return "sports";
  if (SPORT.test(s)) return "sports";
  if (SUV.test(s)) return "suv";
  if (/wagon|sportwagen|allroad|estate/i.test(s)) return "wagon";
  if (/hatch|hatchback|golf|gti|fit|fiesta|focus|cooper|mini|leaf|bolt|500|veloster|yaris|mazda3 hatch|forte5|elantra gt|i3|cube|fortwo|c-max|prius/i.test(s)) return "hatchback";
  if (/coupe/i.test(s)) return "coupe";
  return "sedan";
}

/* ── normalise the model name to what people actually search ── */
const TRIM_WORDS = /\b(crew|regular|extended|quad|king|double|access|super|mega)?\s*(cab|crew)\b.*$|\b(short|long|standard|styleside|flareside)\s+bed\b.*$|\b(sedan|coupe|hatchback|wagon|convertible|cabriolet|suv|cuv|sut|roadster|spyder|volante|\d-door|\d door|passanger|passenger|cargo|chassis|dually)\b|\b(sport|limited|touring|premium|platinum|signature|denali|overland|laredo|trailhawk|summit reserve|essence|avenir|convenience|r-line|sel|se|le|xle|xlt|lx|ex|si|s|base|plus|turbo|hybrid|plug-in|electric drive|n-line|competition)\b/gi;
function baseModel(model) {
  let m = model.replace(/\.0$/, "").replace(/\(.*?\)/g, "");
  m = m.replace(TRIM_WORDS, " ").replace(/\s+/g, " ").trim();
  m = m.replace(/\b(\d+)-?series\b/i, "$1 Series").replace(/-class\b/i, " Class");
  return m || model;
}

/* ── scoring ── */
const GOOD_LIC = new Set(["CC Attribution", "CC0 Public Domain"]);
const BAD = /\b(low ?poly|lowpoly|fortnite|toy|lego|cartoon|chibi|wheel|wheels|rim|rims|tire|tyre|engine|seat|interior only|steering|badge|logo|key|hot ?wheels|matchbox|minecraft|roblox|gta|blender ?render|wireframe|crashed|destroyed|wreck|rusty|abandoned|police|taxi|ambulance)\b/i;
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
function score(r, make, base) {
  const lic = r.license?.label;
  if (!GOOD_LIC.has(lic) || !r.isDownloadable) return -1;
  const name = norm(r.name);
  if (BAD.test(r.name)) return -1;
  const faces = r.faceCount ?? 0;
  if (faces < 15000 || faces > 1600000) return -1;
  const mk = norm(make).split(" ")[0];
  const bt = norm(base).split(" ").filter((t) => t.length > 1 || /\d/.test(t));
  const hitsMake = name.includes(mk) ? 1 : 0;
  const hitsModel = bt.length ? bt.filter((t) => name.split(" ").includes(t)).length / bt.length : 0;
  if (hitsModel < 0.5) return -1;
  let s = hitsModel * 60 + hitsMake * 20;
  s += Math.min(15, Math.log10((r.likeCount ?? 0) + 1) * 6);
  s += faces >= 60000 && faces <= 700000 ? 10 : 3; // sweet spot for a browser
  if (/\b(19[5-9]\d|200\d)\b/.test(r.name)) s -= 8; // prefer modern generations
  if (/\bscan\b/i.test(r.name)) s -= 10;
  if (lic === "CC0 Public Domain") s += 3;
  return s;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function search(q) {
  const url = `https://api.sketchfab.com/v3/search?type=models&downloadable=true&count=24&sort_by=-likeCount&q=${encodeURIComponent(q)}`;
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (res.status === 429) { await sleep(4000 * (attempt + 1)); continue; }
      if (!res.ok) return [];
      return (await res.json()).results ?? [];
    } catch {
      await sleep(3000 * (attempt + 1)); // flaky network: back off and retry
    }
  }
  return null; // unknown: leave this group for the next run
}

/* ── run ── */
const prev = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : { queries: {} };
const queries = prev.queries ?? {};
const groups = new Map(); // "Make|Base" -> {make, base, models:Set, body}
for (const r of rows) {
  const base = baseModel(r.model);
  const key = `${r.make}|${base}`;
  if (!groups.has(key)) groups.set(key, { make: r.make, base, models: new Set(), body: bodyType(r) });
  groups.get(key).models.add(r.model);
}
console.log(`${rows.length} rows · ${groups.size} search groups`);

let i = 0;
for (const [key, g] of groups) {
  i++;
  if (queries[key]) continue;
  const results = await search(`${g.make} ${g.base}`);
  if (results === null) { process.stdout.write(`\r${i}/${groups.size} ${key} — network, skipped   \n`); continue; }
  const ranked = results
    .map((r) => ({ uid: r.uid, name: r.name, author: r.user?.displayName ?? r.user?.username, authorUrl: r.user?.profileUrl, url: r.viewerUrl, license: r.license?.label, faces: r.faceCount, likes: r.likeCount, score: score(r, g.make, g.base) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  queries[key] = { make: g.make, base: g.base, body: g.body, models: [...g.models], candidates: ranked };
  if (i % 20 === 0) { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify({ queries }, null, 1)); }
  process.stdout.write(`\r${i}/${groups.size} ${key.padEnd(40).slice(0, 40)} ${ranked[0] ? "✓" : "·"}   `);
  await sleep(350);
}
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ queries }, null, 1));

const all = Object.values(queries);
const hit = all.filter((q) => q.candidates.length);
const rowsHit = rows.filter((r) => queries[`${r.make}|${baseModel(r.model)}`]?.candidates.length).length;
console.log(`\n\nexact model found for ${hit.length}/${all.length} groups · covers ${rowsHit}/${rows.length} vehicles`);
const byBody = {};
for (const q of all) (byBody[q.body] ??= [0, 0])[q.candidates.length ? 0 : 1]++;
console.log("by body type [found, missing]:", JSON.stringify(byBody));
