/**
 * Utilities for the shared StyleProps field group.
 * `resolveStyle` produces a React inline-style object, merging base + md + lg
 * with a media-query strategy: we pass `base` as inline style and emit a
 * scoped <style> tag for md/lg overrides keyed by a per-instance className.
 */
import type { CSSProperties } from "react";
import type { ResponsiveStyle, StyleProps } from "./types";

/** Map a flat StyleProps object to a CSSProperties object. */
export function toCss(s: StyleProps | undefined): CSSProperties {
  if (!s) return {};
  const css: CSSProperties = {};
  const k = (key: keyof StyleProps, target: keyof CSSProperties = key as never) => {
    const v = s[key];
    if (v !== undefined && v !== "") (css as Record<string, unknown>)[target as string] = v;
  };
  // colors
  k("color");
  if (s.bg) css.backgroundColor = s.bg;
  if (s.bgImage) {
    css.backgroundImage = `url("${s.bgImage}")`;
    css.backgroundSize = s.bgSize ?? "cover";
    css.backgroundPosition = s.bgPosition ?? "center";
    css.backgroundRepeat = "no-repeat";
  }
  // typography
  k("fontFamily");
  k("fontSize");
  k("fontWeight");
  k("lineHeight");
  k("letterSpacing");
  k("textAlign");
  // spacing
  k("paddingTop");
  k("paddingRight");
  k("paddingBottom");
  k("paddingLeft");
  k("marginTop");
  k("marginRight");
  k("marginBottom");
  k("marginLeft");
  // box
  k("width");
  k("maxWidth");
  k("minHeight");
  k("borderRadius");
  if (s.borderWidth || s.borderColor || s.borderStyle) {
    css.borderWidth = s.borderWidth ?? "1px";
    css.borderStyle = s.borderStyle ?? "solid";
    css.borderColor = s.borderColor ?? "currentColor";
  }
  k("boxShadow");
  if (s.opacity !== undefined && s.opacity !== "") css.opacity = Number(s.opacity);
  // layout
  k("display");
  k("flexDirection");
  k("alignItems");
  k("justifyContent");
  k("gap");
  k("gridTemplateColumns");
  return css;
}

/** Stable hash so a given style object always produces the same class name. */
export function styleId(prefix: string, obj: unknown): string {
  const s = JSON.stringify(obj ?? {});
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return `${prefix}-${(h >>> 0).toString(36)}`;
}

/** Turn a CSSProperties object back into a CSS declaration string. */
function declarations(css: CSSProperties): string {
  return Object.entries(css)
    .map(([k, v]) => {
      const prop = k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
      return `${prop}:${v as string};`;
    })
    .join("");
}

/**
 * Resolve a ResponsiveStyle into:
 *  - inline base style (no media query needed)
 *  - a className + <style> string for md/lg overrides
 */
export function resolveStyle(rs: ResponsiveStyle | undefined): {
  className: string;
  inline: CSSProperties;
  css: string;
} {
  const inline = toCss(rs?.base);
  const className = styleId("bx", rs ?? {});
  const md = rs?.md ? toCss(rs.md) : null;
  const lg = rs?.lg ? toCss(rs.lg) : null;
  let css = "";
  if (md && Object.keys(md).length) {
    css += `@media (min-width:768px){.${className}{${declarations(md)}}}`;
  }
  if (lg && Object.keys(lg).length) {
    css += `@media (min-width:1024px){.${className}{${declarations(lg)}}}`;
  }
  return { className, inline, css };
}
