/**
 * Shared builder/editor types.
 * Mirrors the relevant Puck Data shape so we can keep imports light
 * in server code.
 */
import type { Data } from "@puckeditor/core";

export type BuilderData = Data;

export type ThemeTokens = {
  colors?: Record<string, string>;
  fonts?: { body?: string; heading?: string };
  radii?: Record<string, string>;
  spacing?: Record<string, string>;
  shadows?: Record<string, string>;
};

export type Theme = {
  id: string;
  name: string;
  is_default: boolean;
  tokens: ThemeTokens;
};

export type PageRow = {
  id: string;
  slug: string;
  title: string;
  status: "draft" | "published" | "archived";
  theme_id: string | null;
  draft_data: BuilderData;
  published_data: BuilderData | null;
  seo: { title?: string; description?: string; image?: string };
  in_nav: boolean;
  nav_label: string;
  nav_order: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

export type AssetRow = {
  id: string;
  url: string;
  storage_path: string | null;
  type: "image" | "video" | "svg" | "other";
  mime_type: string | null;
  width: number | null;
  height: number | null;
  size_bytes: number | null;
  alt: string;
  folder: string;
  created_at: string;
};

export type BreakpointKey = "base" | "md" | "lg";

/** Style props attached to nearly every block. All values optional;
 *  base applies always, md/lg override at min-width 768/1024. */
export type StyleProps = {
  // colors
  color?: string;
  bg?: string;
  bgImage?: string;          // asset URL
  bgSize?: "cover" | "contain" | "auto";
  bgPosition?: string;       // e.g. "center", "top left"
  // typography
  fontFamily?: string;
  fontSize?: string;         // e.g. "1rem", "clamp(1rem,2vw,2rem)"
  fontWeight?: string;       // "400","700"
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  // spacing
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  // box
  width?: string;
  maxWidth?: string;
  minHeight?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  borderStyle?: "solid" | "dashed" | "dotted" | "none";
  boxShadow?: string;
  opacity?: string;
  // layout helpers (only used on flex/grid containers)
  display?: "block" | "flex" | "grid" | "inline-flex" | "inline-block";
  flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
  alignItems?: "stretch" | "center" | "flex-start" | "flex-end" | "baseline";
  justifyContent?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly";
  gap?: string;
  gridTemplateColumns?: string;
};

export type ResponsiveStyle = {
  base?: StyleProps;
  md?: StyleProps;
  lg?: StyleProps;
};
