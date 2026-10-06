import manifest from "@/data/carModels.json";
import { FALLBACK_MODEL, type BodyKind } from "@/components/home/studioData";

type ModelInfo = { file?: string; name: string; author: string; authorUrl?: string; url: string; license: string; error?: string; config?: { paint: string[]; frontSign: number; longAxis: string; usable?: boolean; upsideDown?: boolean } };
const ok = (m?: ModelInfo) => !!m?.file && m.config?.usable !== false;
type Group = { make: string; base: string; body: BodyKind; models: string[]; uid: string };
const M = manifest as unknown as { models: Record<string, ModelInfo>; groups: Record<string, Group> };

/* Same rules as scripts/match-models.mjs, so the site and the pipeline agree. */
const TRUCK = /\b(f-?\d{3}|silverado|sierra|ram|1500|2500|3500|tacoma|tundra|ranger|colorado|canyon|frontier|titan|ridgeline|gladiator|gladitor|dakota|maverick|santa cruz|cybertruck|sut|pickup|cab|bed)\b/i;
const VAN = /\b(transit|sprinter|promaster|express|savana|e-\d{3}|odyssey|sienna|pacifica|carnival|sedona|quest|caravan|freestar|entourage|metris|van|shuttle)\b/i;
const SUV = /\b(suv|cuv|4runner|wrangler|bronco|cherokee|wagoneer|durango|explorer|expedition|escape|edge|tahoe|suburban|yukon|traverse|equinox|blazer|trax|acadia|terrain|enclave|encore|envision|highlander|rav4|sequoia|land cruiser|cr-v|hr-v|pilot|passport|cx-\d+|rogue|murano|pathfinder|armada|kicks|juke|outback|forester|ascent|crosstrek|tucson|santa fe|palisade|kona|sorento|telluride|sportage|seltos|niro|atlas|tiguan|id\.4|q\d|x\d|gl[abceks]?-class|g-class|eq[bce]|range rover|defender|discovery|cayenne|macan|model x|model y|compass|renegade|journey|flex|aviator|navigator|nautilus|corsair|xt\d|escalade|qx\d+|rdx|mdx|gx\d+|lx\d+|rx\d*|nx|ux|f-pace|e-pace|countryman|ecosport|h[123]|fj cruiser|element|c-hr|corolla cross|venza|trailblazer|envista|eclipse cross|outlander|ariya|ioniq 5|ev6|gv\d+|stelvio|levante|urus|bentayga|cullinan|grecale|mach-e|freelander|lr\d|commander|aspen|envoy|crosstour)\b/i;
const SPORT = /\b(911|718|cayman|boxster|corvette|gt-r|370z|350z|supra|gr86|86|brz|fr-s|mx-5|miata|nsx|r8|huracan|aventador|amg gt|f-type|4c|i8|viper|camaro|mustang|challenger|challanger|charger|gto|genesis coupe|celica|s2000|tt|spider|spyder|roadster|db\d+|dbs|vantage|california|gt3|gt4|type-r|sti|wrx|focus rs|gr corolla)\b/i;

export function bodyType(model: string, trim = ""): BodyKind {
  const s = `${model} ${trim}`;
  if (VAN.test(s)) return "van";
  if (TRUCK.test(s)) return "truck";
  if (/convertible|cabrio|roadster|spyder|spider|volante/i.test(s) || SPORT.test(s)) return "sports";
  if (SUV.test(s)) return "suv";
  if (/wagon|sportwagen|allroad|estate/i.test(s)) return "wagon";
  if (/hatch|golf|gti|\bfit\b|fiesta|focus|cooper|leaf|bolt|500|veloster|yaris|forte5|elantra gt|i3|cube|fortwo|c-max|prius/i.test(s)) return "hatchback";
  if (/coupe/i.test(s)) return "coupe";
  return "sedan";
}

const byVehicle = new Map<string, string>(); // "Make|Model" -> uid
for (const g of Object.values(M.groups)) for (const model of g.models) if (ok(M.models[g.uid])) byVehicle.set(`${g.make}|${model}`, g.uid);

const NEAR: Record<BodyKind, BodyKind[]> = {
  sedan: ["sedan", "coupe", "hatchback", "wagon", "sports"], coupe: ["coupe", "sports", "sedan"], sports: ["sports", "coupe", "sedan"],
  hatchback: ["hatchback", "sedan", "wagon"], wagon: ["wagon", "sedan", "suv"], suv: ["suv", "wagon", "truck"], truck: ["truck", "suv", "van"], van: ["van", "suv", "truck"],
};

export type Resolved = { url: string; body: BodyKind; exact: boolean; model?: ModelInfo };

export function resolveCar(make: string, model: string, trim = ""): Resolved {
  const body = bodyType(model, trim);
  const uid = byVehicle.get(`${make}|${model}`);
  if (uid) return { url: M.models[uid].file!, body, exact: true, model: M.models[uid] };
  for (const b of NEAR[body]) {
    const g = Object.values(M.groups).find((x) => x.body === b && ok(M.models[x.uid]));
    if (g) return { url: M.models[g.uid].file!, body, exact: false, model: M.models[g.uid] };
  }
  return { url: FALLBACK_MODEL, body, exact: false };
}

export function credits() {
  return Object.values(M.models).filter((m) => ok(m));
}
