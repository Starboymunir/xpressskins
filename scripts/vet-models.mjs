// Quality gate between matching and downloading. For each vehicle group, looks up the
// full details of its top candidates and keeps the first one that looks like a proper,
// separately-materialed car model. Writes `pick` + `thumb` into data/model-matches.json.
//
//   node scripts/vet-models.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILE = path.join(ROOT, "data/model-matches.json");
const data = JSON.parse(fs.readFileSync(FILE, "utf8"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const env = fs.existsSync(path.join(ROOT, ".env.local")) ? fs.readFileSync(path.join(ROOT, ".env.local"), "utf8") : "";
const TOKEN = process.env.SKETCHFAB_TOKEN || env.match(/^SKETCHFAB_TOKEN=(.+)$/m)?.[1]?.trim();
const AUTH = TOKEN ? { Authorization: `Token ${TOKEN}` } : {};

const BAD_NAME = /race ?car|racing|\blivery\b|time ?attack|\bgt3 ?r\b|\bcup ?car\b|super ?gt|\bdtm\b|photo ?scan|\bscan\b|\bday ?\d+\b|sketch|sculpt|F&F|furious|\bice\b|nascar|wreck|crash|rally|drift|widebody|police|taxi|low ?poly|game ?ready ?low|wip\b|test\b/i;

async function details(uid) {
  for (let attempt = 0; attempt < 8; attempt++) {
    try {
      const res = await fetch(`https://api.sketchfab.com/v3/models/${uid}`, { headers: AUTH, signal: AbortSignal.timeout(30000) });
      if (res.status === 404) return null;
      if (res.status === 429 || res.status >= 500) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {
      await sleep(Math.min(240000, 10000 * 2 ** Math.min(attempt, 4)));
    }
  }
  return undefined; // network: try again next run
}

function passes(d, body) {
  if (!d || !d.isDownloadable) return "not downloadable";
  if (!["truck", "suv"].includes(body) && /off ?road|4x4|lifted|monster|baja|prerunner/i.test(d.name)) return "modified build";
  if (BAD_NAME.test(d.name)) return "name";
  if ((d.materialCount ?? 0) < 5) return `only ${d.materialCount} materials`;
  if (d.faceCount < 40000 || d.faceCount > 1200000) return `${Math.round(d.faceCount / 1000)}k tris`;
  return "";
}

const groups = Object.entries(data.queries).filter(([, q]) => q.candidates.length);
let i = 0, picked = 0, rejected = 0;
for (const [key, q] of groups) {
  i++;
  if (q.vetted) { if (q.pick) picked++; else rejected++; continue; }
  let chosen = null, unknown = false;
  const reasons = [];
  for (const c of q.candidates) {
    const d = await details(c.uid);
    await sleep(1100);
    if (d === undefined) { unknown = true; break; }
    const why = passes(d, q.body);
    if (!why) {
      const thumbs = d.thumbnails?.images ?? [];
      chosen = { uid: c.uid, thumb: (thumbs.find((t) => t.width === 720) ?? thumbs[0])?.url, materials: d.materialCount };
      break;
    }
    reasons.push(`${c.name.slice(0, 30)}: ${why}`);
  }
  if (unknown) { process.stdout.write(`\n${key}: network, will retry next run\n`); continue; }
  q.vetted = true;
  q.pick = chosen?.uid ?? null;
  q.thumb = chosen?.thumb ?? null;
  q.rejected = reasons;
  chosen ? picked++ : rejected++;
  if (i % 10 === 0) fs.writeFileSync(FILE, JSON.stringify(data, null, 1));
  process.stdout.write(`\r${i}/${groups.length} passed ${picked} · none suitable ${rejected}   `);
}
fs.writeFileSync(FILE, JSON.stringify(data, null, 1));
console.log(`\n\n${picked} groups have a vetted model, ${rejected} fall back to the nearest body type`);
