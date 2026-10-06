// Offline analysis of every downloaded car: finds the body-paint material(s) and which
// end is the front, so the browser does not have to guess. Writes `config` into
// src/data/carModels.json. Hand corrections in data/model-overrides.json win.
//
//   node scripts/analyze-models.mjs            # all models
//   node scripts/analyze-models.mjs --verbose  # print per-material scores
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import draco3d from "draco3dgltf";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = path.join(ROOT, "src/data/carModels.json");
const OV_FILE = path.join(ROOT, "data/model-overrides.json");
const VERBOSE = process.argv.includes("--verbose");
const ONLY = process.argv.find((a) => /^[0-9a-f]{32}$/.test(a));

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ "draco3d.decoder": await draco3d.createDecoderModule() });
const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
const overrides = fs.existsSync(OV_FILE) ? JSON.parse(fs.readFileSync(OV_FILE, "utf8")) : {};

const GLASS = /glass|window|windshield|windscreen|tint|lens|transparent|clear|crystal|visor/i;
const NOT_PAINT = /interior|interno|int_?\d*|cabin|tire|tyre|rubber|wheel|rim|brake|caliper|disc|rotor|interior|seat|leather|fabric|cloth|carpet|dash|steering|chrome|metal_?(?!lic)|plastic|black|trim|grill|grille|light|lamp|led|plate|logo|emblem|badge|exhaust|engine|mirror_?glass|shadow|\bao\b|undercarriage|chassis_?bottom|floor|bike|bicycle|fahrrad|rack|roof_?box|cargo|person|human|driver/i;
const PAINT = /pintura|vernice|peinture|paint|body|carpaint|car_?paint|exterior|shell|coque|carroc|karosserie|color|colour|main/i;
const FRONT = /head ?light|headlamp|\bhead\b|grill|grille|front|\bfr\b|bonnet|hood|windshield|windscreen/i;
const REAR = /tail ?light|taillamp|\btail\b|brake ?light|stop ?lamp|rear|\brr\b|trunk|boot|exhaust|muffler|tailgate|spoiler/i;

const lum = (c) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];

function worldPositions(doc) {
  // returns [{ mesh, material, positions: Float32Array(world space) }]
  const out = [];
  const scene = doc.getRoot().listScenes()[0];
  const visit = (node, parentM) => {
    const local = node.getMatrix();
    const m = mul(parentM, local);
    const mesh = node.getMesh();
    if (mesh) for (const prim of mesh.listPrimitives()) {
      const pos = prim.getAttribute("POSITION");
      if (!pos || prim.getMode() !== 4) continue; // triangles only: skip edge lines/points
      const n = pos.getCount(), arr = new Float32Array(n * 3), v = [0, 0, 0];
      for (let i = 0; i < n; i++) { pos.getElement(i, v); arr.set(xf(m, v), i * 3); }
      const idx = prim.getIndices();
      out.push({ node: node.getName(), mesh: mesh.getName(), material: prim.getMaterial(), positions: arr, indices: idx ? idx.getArray() : null });
    }
    for (const c of node.listChildren()) visit(c, m);
  };
  for (const n of scene.listChildren()) visit(n, IDENT);
  return out;
}
const IDENT = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
function mul(a, b) { const o = new Array(16).fill(0); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) o[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k]; return o; }
function xf(m, v) { return [m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12], m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13], m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14]]; }

function area(p, idx) {
  let a = 0; const tri = idx ? idx.length / 3 : p.length / 9;
  const step = Math.max(1, Math.floor(tri / 20000));
  for (let t = 0; t < tri; t += step) {
    const i0 = (idx ? idx[t * 3] : t * 3) * 3, i1 = (idx ? idx[t * 3 + 1] : t * 3 + 1) * 3, i2 = (idx ? idx[t * 3 + 2] : t * 3 + 2) * 3;
    const ux = p[i1] - p[i0], uy = p[i1 + 1] - p[i0 + 1], uz = p[i1 + 2] - p[i0 + 2];
    const vx = p[i2] - p[i0], vy = p[i2 + 1] - p[i0 + 1], vz = p[i2 + 2] - p[i0 + 2];
    const t2 = 0.5 * Math.hypot(uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx) * step;
    if (Number.isFinite(t2)) a += t2;
  }
  return a;
}

function bbox(arrs) {
  const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
  for (const p of arrs) for (let i = 0; i < p.length; i += 3) for (let k = 0; k < 3; k++) { if (p[i + k] < mn[k]) mn[k] = p[i + k]; if (p[i + k] > mx[k]) mx[k] = p[i + k]; }
  return { mn, mx, size: mx.map((x, k) => x - mn[k]) };
}

let done = 0;
for (const [uid, m] of Object.entries(manifest.models)) {
  if (!m.file || (ONLY && uid !== ONLY)) continue;
  const local = path.join(ROOT, "public/models/cars", `${uid}.glb`);
  if (!fs.existsSync(local)) continue;
  const doc = await io.read(local);
  const parts = worldPositions(doc);
  const all = bbox(parts.map((p) => p.positions));
  // axes: up = smallest of the two non-length axes is usually height; long = longest horizontal
  let up = 1; // glTF is Y-up; fall back to Z if Y is clearly the longest
  if (all.size[1] > all.size[0] && all.size[1] > all.size[2]) up = 2;
  const horiz = [0, 1, 2].filter((k) => k !== up);
  const long = all.size[horiz[0]] >= all.size[horiz[1]] ? horiz[0] : horiz[1];
  const wide = horiz.find((k) => k !== long);
  const L = all.size[long], W = all.size[wide], H = all.size[up];

  // multi-vehicle scene guard: real cars are ~2.2-3.2x longer than wide
  const aspect = L / Math.max(W, 1e-6);
  const isScene = aspect > 4 || aspect < 1.6;

  // per-material stats
  const stats = new Map();
  for (const p of parts) {
    if (!p.material) continue;
    const s = stats.get(p.material) ?? { area: 0, arrs: [], labels: new Set() };
    s.area += area(p.positions, p.indices); s.arrs.push(p.positions); s.labels.add(`${p.node} ${p.mesh}`);
    stats.set(p.material, s);
  }
  const totalArea = [...stats.values()].reduce((a, s) => a + s.area, 0);
  const scored = [];
  for (const [mat, s] of stats) {
    const name = mat.getName() || "";
    const label = `${name} ${[...s.labels].join(" ")}`;
    const b = bbox(s.arrs);
    const spanL = b.size[long] / L, spanW = b.size[wide] / W, spanH = b.size[up] / H;
    const topFrac = (b.mx[up] - all.mn[up]) / H; // how high this material reaches
    const lowFrac = (b.mn[up] - all.mn[up]) / H;
    const col = mat.getBaseColorFactor();
    const alpha = mat.getAlphaMode() !== "OPAQUE" || col[3] < 0.95 || !!mat.getExtension("KHR_materials_transmission");
    const darkNoTex = lum(col) < 0.06 && !mat.getBaseColorTexture();
    let score = (s.area / totalArea) * 100;
    score *= Math.min(1, spanL / 0.75) * Math.min(1, spanW / 0.7) * Math.min(1, spanH / 0.35);
    if (spanL < 0.85) score *= 0.2;               // paint runs nose to tail
    if (topFrac < 0.55) score *= 0.3;            // paint reaches the upper body
    if (lowFrac > 0.45) score *= 0.4;            // and comes down the sides
    if (alpha || GLASS.test(label)) score = 0;
    if (NOT_PAINT.test(name)) score *= 0.15;
    if (PAINT.test(name)) score *= 2.5;
    if (darkNoTex) score *= 0.4;
    scored.push({ name, score, area: s.area / totalArea, spanL, spanW, spanH, topFrac });
  }
  scored.sort((a, b) => b.score - a.score);
  // a single texture-atlas material covering most of the car also covers lights, glass and tyres:
  // prefer an explicitly named paint material if there is one
  let best = scored[0];
  if (best && best.area > 0.6 && !PAINT.test(best.name)) {
    const named = scored.find((x) => x.score > 0 && PAINT.test(x.name));
    best = named ?? { ...best, score: 0 };
  }
  // include other materials that look like the same paint (split bodies), within 35% of the best score
  const paint = best && best.score > 0 ? scored.filter((s) => s.score > 0 && s.score >= best.score * 0.35 && (PAINT.test(s.name) || s.name === best.name)).map((s) => s.name) : [];

  // front detection: named front/rear parts, else cabin bias (windshield sits closer to the front)
  let f = 0, fn = 0, r = 0, rn = 0;
  for (const p of parts) {
    const label = `${p.node} ${p.mesh} ${p.material?.getName() ?? ""}`;
    const isF = FRONT.test(label), isR = REAR.test(label);
    if (isF === isR) continue;
    const b = bbox([p.positions]); const c = (b.mn[long] + b.mx[long]) / 2;
    if (isF) { f += c; fn++; } else { r += c; rn++; }
  }
  let frontSign = 0; // -1: front is at min of long axis, +1: at max
  if (fn && rn) frontSign = f / fn < r / rn ? -1 : 1;
  else {
    // cabin bias: the tallest region (roof) is behind the middle on almost every car
    const bins = new Array(20).fill(-Infinity);
    for (const p of parts) for (let i = 0; i < p.positions.length; i += 3) {
      const t = Math.min(19, Math.max(0, Math.floor(((p.positions[i + long] - all.mn[long]) / L) * 20)));
      if (p.positions[i + up] > bins[t]) bins[t] = p.positions[i + up];
    }
    let peak = 0; for (let i = 1; i < 20; i++) if (bins[i] > bins[peak]) peak = i;
    frontSign = peak >= 10 ? -1 : 1;
  }

  const ov = overrides[`uid:${uid}`] ?? {};
  m.config = {
    paint: ov.paint ?? paint,
    frontSign: ov.frontSign ?? frontSign,
    upAxis: "xyz"[up], longAxis: "xyz"[long],
    scene: ov.scene ?? isScene,
    upsideDown: ov.upsideDown ?? false,
    confidence: best ? Math.round(best.score) : 0,
  };
  // only trust it when the paint is clearly identified and the file is one car
  m.config.usable = ov.usable ?? (!m.config.scene && m.config.paint.length > 0 && m.config.confidence >= 20);
  done++;
  console.log(`${(m.name ?? uid).slice(0, 34).padEnd(34)} paint=[${m.config.paint.join(", ").slice(0, 46)}] front=${frontSign < 0 ? "min" : "max"}${long === 2 ? "Z" : "X"} ${isScene ? "SCENE?" : ""} conf=${m.config.confidence} aspect=${aspect.toFixed(1)} ${m.config.usable ? "OK" : "FALLBACK"}`);
  if (VERBOSE) for (const s of scored.slice(0, 6)) console.log(`     ${s.name.slice(0, 30).padEnd(30)} score=${s.score.toFixed(1)} area=${(s.area * 100).toFixed(0)}% L=${s.spanL.toFixed(2)} W=${s.spanW.toFixed(2)} H=${s.spanH.toFixed(2)} top=${s.topFrac.toFixed(2)}`);
}
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1));
console.log(`\nanalysed ${done} models`);
