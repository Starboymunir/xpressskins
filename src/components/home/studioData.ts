// Plain data shared by the builder UI and the 3D viewer. No three.js imports here,
// so importing it never pulls the 3D bundle into the main page.
export type Coverage = "full" | "half" | "sides" | "hood";
export type FinishId = "gloss" | "matte" | "satin";
export type ViewId = "front" | "side" | "rear" | "top" | "free";
export type BodyKind = "sedan" | "coupe" | "sports" | "hatchback" | "wagon" | "suv" | "truck" | "van";

export const LIVERIES = [
  { id: "sakura", name: "Sakura Drift", src: "/liveries/sakura.jpg", swatch: "#ff8fcf" },
  { id: "neon", name: "Neon District", src: "/liveries/neon.jpg", swatch: "#1ee3ff" },
  { id: "shrine", name: "Shrine Tide", src: "/liveries/shrine.jpg", swatch: "#2b3a8f" },
  { id: "ronin", name: "Crimson Ronin", src: "/liveries/ronin.jpg", swatch: "#c81e2b" },
];

export const PAINTS = [
  { id: "pearl", name: "Pearl white", hex: "#eef0f2" },
  { id: "jet", name: "Jet black", hex: "#0b0b0d" },
  { id: "nardo", name: "Nardo grey", hex: "#8e9196" },
  { id: "gunmetal", name: "Gunmetal", hex: "#3a3d44" },
  { id: "midnight", name: "Midnight blue", hex: "#15224d" },
  { id: "candy", name: "Candy red", hex: "#b4122b" },
  { id: "sakura", name: "Sakura pink", hex: "#f2a6c9" },
  { id: "lime", name: "Acid lime", hex: "#b7f03a" },
];

export const FALLBACK_MODEL = "/models/ferrari.glb";
