"use client";

import { useId } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ────────────────────────────────────────────────────────────
   ItashaCar — side-profile SVG car split into wrap panels.
   Each visual panel maps to one or more pricing panel ids from
   src/data/vehicles.ts so the price stays honest.
   ──────────────────────────────────────────────────────────── */

export type CarPanelId =
  | "hood" | "roof" | "front-bumper" | "rear-bumper" | "trunk"
  | "front-fenders" | "front-door" | "rear-door" | "quarter-panels"
  | "rockers" | "mirrors" | "pillars";

export interface CarPanel {
  id: CarPanelId;
  label: string;
  d: string;
  /** x, y, w, h — used for the reveal wipe */
  bbox: [number, number, number, number];
  /** ids in panelDefinitions (vehicles.ts) this visual panel represents */
  priceIds: string[];
}

export const CAR_PANELS: CarPanel[] = [
  { id: "front-bumper", label: "Front Bumper", priceIds: ["front-bumper"],
    d: "M60,232 C52,255 50,290 62,320 L150,320 L150,245 L140,205 Z", bbox: [50, 205, 100, 115] },
  { id: "hood", label: "Hood", priceIds: ["hood"],
    d: "M140,205 L385,175 L385,200 L150,245 Z", bbox: [140, 175, 245, 70] },
  { id: "front-fenders", label: "Front Fenders", priceIds: ["front-fenders"],
    d: "M150,245 L385,200 L385,212 L335,212 L335,320 L313,320 A78,78 0 0 0 157,320 L150,320 Z", bbox: [150, 200, 235, 120] },
  { id: "front-door", label: "Front Doors", priceIds: ["driver-front-door", "passenger-front-door"],
    d: "M335,212 L525,208 L525,300 L335,300 Z", bbox: [335, 208, 190, 92] },
  { id: "rear-door", label: "Rear Doors", priceIds: ["driver-rear-door", "passenger-rear-door"],
    d: "M530,208 L680,204 L680,300 L530,300 Z", bbox: [530, 204, 150, 96] },
  { id: "quarter-panels", label: "Quarter Panels", priceIds: ["quarter-panels"],
    d: "M680,204 L790,196 L905,235 L860,235 L860,320 L843,320 A78,78 0 0 0 687,320 L687,300 L680,300 Z", bbox: [680, 196, 225, 124] },
  { id: "rockers", label: "Rocker Panels", priceIds: ["rockers"],
    d: "M313,300 L687,300 L687,320 L313,320 Z", bbox: [313, 300, 374, 20] },
  { id: "trunk", label: "Trunk", priceIds: ["trunk"],
    d: "M790,196 L800,172 L905,212 L905,235 Z", bbox: [790, 172, 115, 63] },
  { id: "rear-bumper", label: "Rear Bumper", priceIds: ["rear-bumper"],
    d: "M905,235 L940,225 C948,250 950,290 935,320 L860,320 L860,235 Z", bbox: [860, 225, 90, 95] },
  { id: "roof", label: "Roof", priceIds: ["roof"],
    d: "M480,98 L690,105 L690,123 L480,116 Z", bbox: [480, 98, 210, 25] },
  { id: "pillars", label: "Pillars & Trim", priceIds: ["pillars"],
    d: "M385,175 L480,98 L480,116 L400,200 L385,200 Z M690,105 L800,172 L790,196 L775,196 L690,123 Z M522,116 L534,116 L534,200 L522,200 Z", bbox: [385, 98, 415, 102] },
  { id: "mirrors", label: "Mirrors", priceIds: ["mirrors"],
    d: "M378,186 C378,178 384,174 392,174 C402,174 410,180 410,190 C410,198 402,204 392,204 C384,204 378,196 378,186 Z", bbox: [378, 174, 32, 30] },
];

export interface WrapDesign {
  id: string;
  name: string;
  kanji: string;
  c1: string;
  c2: string;
  c3: string;
}

export const WRAP_DESIGNS: WrapDesign[] = [
  { id: "sakura", name: "Sakura Drift", kanji: "桜", c1: "#ff8fcf", c2: "#8b3fd9", c3: "#ffe3f3" },
  { id: "shrine", name: "Neon Shrine", kanji: "神", c1: "#ff3d5a", c2: "#1a1030", c3: "#ffd23f" },
  { id: "wave", name: "Wave Rider", kanji: "波", c1: "#37d6f0", c2: "#1e2f8f", c3: "#f2fbff" },
  { id: "void", name: "Void Runner", kanji: "夜", c1: "#b6f04a", c2: "#0f1626", c3: "#e9ffb0" },
];

export type Finish = "gloss" | "matte" | "satin";

const SILHOUETTE =
  "M60,232 C52,255 50,290 62,320 L157,320 A78,78 0 0 1 313,320 L687,320 A78,78 0 0 1 843,320 L935,320 C950,290 948,250 940,225 L905,212 L800,172 L690,105 L480,98 L385,175 L140,205 Z";

interface Props {
  selected: ReadonlySet<CarPanelId>;
  design: WrapDesign;
  finish?: Finish;
  hovered?: CarPanelId | null;
  onHover?: (id: CarPanelId | null) => void;
  onToggle?: (id: CarPanelId, point?: { x: number; y: number }) => void;
  interactive?: boolean;
  className?: string;
  /** "paper" = light page, "ink" = dark page */
  tone?: "paper" | "ink";
  /** thicker manga-style linework */
  bold?: boolean;
}

export function ItashaCar({
  selected, design, finish = "gloss", hovered = null, onHover, onToggle,
  interactive = true, className = "", tone = "paper", bold = false,
}: Props) {
  const uid = useId().replace(/:/g, "");
  const base = tone === "paper" ? "#ffffff" : "#2a2a32";
  const line = tone === "paper" ? "#08080a" : "#fffdf5";
  const glass = tone === "paper" ? "#bfe9ff" : "#3b4652";
  const lw = bold ? 2.2 : 1;
  const glossOpacity = finish === "gloss" ? 0.38 : finish === "satin" ? 0.16 : 0.05;
  const kanjiFont = "var(--font-kanji), 'Noto Sans JP', sans-serif";

  return (
    <svg
      viewBox="0 0 1000 400"
      className={className}
      role="img"
      aria-label="Car with selected panels wrapped"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id={`grad-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={design.c1} />
          <stop offset="55%" stopColor={design.c2} />
          <stop offset="100%" stopColor={design.c1} />
        </linearGradient>
        <pattern id={`dots-${uid}`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
          <circle cx="4" cy="4" r="2.2" fill="#fff" opacity="0.28" />
        </pattern>
        <linearGradient id={`gloss-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="45%" stopColor="#fff" stopOpacity="1" />
          <stop offset="60%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`body-${uid}`}><path d={SILHOUETTE} /></clipPath>
        {CAR_PANELS.map((p) => (
          <clipPath key={p.id} id={`clip-${uid}-${p.id}`}><path d={p.d} /></clipPath>
        ))}

        {/* The artwork, drawn once at full-car size, reused per panel */}
        <g id={`art-${uid}`}>
          <rect x="0" y="0" width="1000" height="400" fill={`url(#grad-${uid})`} />
          <rect x="0" y="0" width="1000" height="400" fill={`url(#dots-${uid})`} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x={120 + i * 150} y="60" width={i % 2 ? 6 : 3} height="380" fill="#fff" opacity="0.35" transform={`skewX(-28) translate(${i * 8},0)`} />
          ))}
          {[[150, 250], [330, 140], [560, 330], [720, 150], [880, 280], [430, 290], [640, 240]].map(([x, y], i) => (
            <path
              key={i}
              d="M0,-16 C8,-10 10,0 0,14 C-10,0 -8,-10 0,-16 Z"
              fill={design.c3}
              opacity="0.85"
              transform={`translate(${x},${y}) rotate(${i * 47}) scale(${1 + (i % 3) * 0.5})`}
            />
          ))}
          <circle cx="760" cy="230" r="120" fill={design.c3} opacity="0.22" />
          <text x="600" y="335" textAnchor="middle" fontSize="300" fontWeight={900} style={{ fontFamily: kanjiFont }} fill="#fff" opacity="0.22">
            {design.kanji}
          </text>
          <text x="250" y="300" textAnchor="middle" fontSize="150" fontWeight={900} style={{ fontFamily: kanjiFont }} fill={design.c3} opacity="0.5">
            痛車
          </text>
        </g>
      </defs>

      {/* ground shadow */}
      <ellipse cx="500" cy="345" rx="470" ry="14" fill={line} opacity="0.12" />

      {/* base body panels */}
      {CAR_PANELS.map((p) => (
        <path key={p.id} d={p.d} fill={base} stroke={line} strokeWidth={1.5 * lw} strokeLinejoin="round" />
      ))}

      {/* glass */}
      <path d="M400,200 L480,116 L522,116 L522,200 Z" fill={glass} />
      <path d="M534,116 L690,123 L775,196 L534,200 Z" fill={glass} />
      <path d="M410,196 L482,120 L500,120 L430,196 Z" fill="#fff" opacity="0.35" />

      {/* wrapped panels — artwork revealed with a squeegee wipe */}
      <AnimatePresence>
        {CAR_PANELS.filter((p) => selected.has(p.id)).map((p) => {
          const [bx, by, bw, bh] = p.bbox;
          return (
            <motion.g key={p.id} initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.25 } }}>
              <mask id={`mask-${uid}-${p.id}`}>
                <motion.rect
                  x={bx} y={by} width={bw} height={bh} fill="#fff"
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformBox: "fill-box", transformOrigin: "0% 50%" }}
                />
              </mask>
              <g clipPath={`url(#clip-${uid}-${p.id})`} mask={`url(#mask-${uid}-${p.id})`}>
                <use href={`#art-${uid}`} />
              </g>
              <g clipPath={`url(#clip-${uid}-${p.id})`}>
                <motion.rect
                  y={by - 10} width="18" height={bh + 20} fill="#fff"
                  initial={{ x: bx - 18, opacity: 0.9 }}
                  animate={{ x: bx + bw + 4, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </g>
            </motion.g>
          );
        })}
      </AnimatePresence>

      {/* finish highlight sweeping across the body */}
      <g clipPath={`url(#body-${uid})`} style={{ mixBlendMode: "soft-light" }}>
        <motion.rect
          y="60" width="520" height="320" fill={`url(#gloss-${uid})`} opacity={glossOpacity}
          initial={{ x: -600 }} animate={{ x: 1200 }}
          transition={{ duration: finish === "gloss" ? 5 : 9, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
        />
      </g>

      {/* panel seams, hover + selected outlines */}
      {CAR_PANELS.map((p) => {
        const isHover = hovered === p.id;
        const isOn = selected.has(p.id);
        return (
          <path
            key={`o-${p.id}`}
            d={p.d}
            fill="#ff2fb3"
            fillOpacity={isHover ? 0.28 : 0}
            stroke={isHover ? "#ff2fb3" : line}
            strokeWidth={(isHover ? 4 : isOn ? 2 : 1.2) * lw}
            strokeLinejoin="round"
            style={{ transition: "stroke-width .15s, fill-opacity .15s", pointerEvents: "none" }}
          />
        );
      })}

      {/* silhouette outline for crispness */}
      <path d={SILHOUETTE} fill="none" stroke={line} strokeWidth={2.5 * lw} strokeLinejoin="round" style={{ pointerEvents: "none" }} />

      {/* details: lights, handles */}
      <g style={{ pointerEvents: "none" }}>
        <path d="M68,236 L120,228 L122,246 L70,252 Z" fill="#fff" stroke={line} strokeWidth="1.2" />
        <path d="M928,232 L940,230 L942,248 L928,250 Z" fill="#e0245e" stroke={line} strokeWidth="1.2" />
        <rect x="470" y="232" width="34" height="8" rx="4" fill={line} opacity="0.7" />
        <rect x="628" y="228" width="34" height="8" rx="4" fill={line} opacity="0.7" />
      </g>

      {/* wheels */}
      {[235, 765].map((cx) => (
        <g key={cx} style={{ pointerEvents: "none" }}>
          <circle cx={cx} cy="318" r="60" fill="#111116" />
          <circle cx={cx} cy="318" r="37" fill={tone === "paper" ? "#ffffff" : "#d9d9de"} stroke={line} strokeWidth={2 * lw} />
          {[0, 72, 144, 216, 288].map((a) => (
            <rect key={a} x={cx - 4} y="290" width="8" height="28" rx="3" fill="#111116" transform={`rotate(${a} ${cx} 318)`} />
          ))}
          <circle cx={cx} cy="318" r="8" fill="#111116" />
        </g>
      ))}

      {/* hit layer */}
      {interactive &&
        CAR_PANELS.map((p) => (
          <path
            key={`hit-${p.id}`}
            d={p.d}
            fill="#000"
            fillOpacity="0"
            style={{ cursor: "pointer" }}
            onMouseEnter={() => onHover?.(p.id)}
            onMouseLeave={() => onHover?.(null)}
            onClick={(e) => onToggle?.(p.id, { x: e.clientX, y: e.clientY })}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle?.(p.id); } }}
            aria-label={`${p.label}${selected.has(p.id) ? " (wrapped)" : ""}`}
            role="button"
          >
            <title>{p.label}</title>
          </path>
        ))}
    </svg>
  );
}
