/**
 * All Puck component definitions live here.
 * Each exported entry is { render, fields, defaultProps } for one block.
 *
 * Naming convention: keep render functions client-safe (no server-only APIs)
 * because Puck's <Render> runs them on the client.
 */
"use client";

import { DropZone, type ComponentConfig } from "@puckeditor/core";
import Link from "next/link";
import { styleField } from "./fields";
import { resolveStyle } from "./styleProps";
import { StyleTag } from "./StyleTag";
import type { ResponsiveStyle } from "./types";

// Re-export the existing site components (already client components) so we
// can wrap them as Puck blocks without losing their behaviour.
import { Navbar as SiteNavbar } from "@/components/Navbar";
import { Footer as SiteFooter } from "@/components/Footer";

type WithStyle<P> = P & { style?: ResponsiveStyle };

/* ─────────────────────────────────────────────────────────
   GENERIC LAYOUT BLOCKS
   ───────────────────────────────────────────────────────── */

export const Section: ComponentConfig<WithStyle<{ children?: never }>> = {
  label: "Section (full-width)",
  fields: {
    style: styleField,
  },
  defaultProps: {
    style: {
      base: {
        paddingTop: "5rem",
        paddingBottom: "5rem",
        paddingLeft: "1.25rem",
        paddingRight: "1.25rem",
      },
    },
  },
  render: ({ style }) => {
    const r = resolveStyle(style);
    return (
      <>
        <StyleTag css={r.css} />
        <section className={`${r.className} relative`} style={r.inline}>
          <DropZone zone="children" />
        </section>
      </>
    );
  },
};

export const Container: ComponentConfig<WithStyle<{ maxW?: string }>> = {
  label: "Container (centered)",
  fields: {
    maxW: { type: "text", label: "Max width (e.g. 80rem)" },
    style: styleField,
  },
  defaultProps: {
    maxW: "80rem",
    style: { base: { paddingLeft: "1.25rem", paddingRight: "1.25rem" } },
  },
  render: ({ maxW, style }) => {
    const r = resolveStyle(style);
    return (
      <>
        <StyleTag css={r.css} />
        <div
          className={`${r.className} mx-auto`}
          style={{ ...r.inline, maxWidth: maxW || "80rem" }}
        >
          <DropZone zone="children" />
        </div>
      </>
    );
  },
};

export const Box: ComponentConfig<WithStyle<{ tag?: "div" | "article" | "aside" }>> = {
  label: "Box (div)",
  fields: {
    tag: {
      type: "select",
      options: [
        { label: "div", value: "div" },
        { label: "article", value: "article" },
        { label: "aside", value: "aside" },
      ],
    },
    style: styleField,
  },
  defaultProps: { tag: "div", style: { base: {} } },
  render: ({ tag, style }) => {
    const r = resolveStyle(style);
    const Tag = (tag || "div") as "div";
    return (
      <>
        <StyleTag css={r.css} />
        <Tag className={r.className} style={r.inline}>
          <DropZone zone="children" />
        </Tag>
      </>
    );
  },
};

export const Columns: ComponentConfig<WithStyle<{ columns: number; gap?: string }>> = {
  label: "Columns",
  fields: {
    columns: {
      type: "select",
      label: "Columns",
      options: [
        { label: "2", value: 2 },
        { label: "3", value: 3 },
        { label: "4", value: 4 },
      ],
    },
    gap: { type: "text", label: "Gap (e.g. 1.5rem)" },
    style: styleField,
  },
  defaultProps: { columns: 2, gap: "1.5rem", style: { base: {} } },
  render: ({ columns, gap, style }) => {
    const r = resolveStyle(style);
    return (
      <>
        <StyleTag css={r.css} />
        <div
          className={`${r.className} grid`}
          style={{
            ...r.inline,
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            gap: gap || "1.5rem",
          }}
        >
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i}>
              <DropZone zone={`col-${i}`} />
            </div>
          ))}
        </div>
      </>
    );
  },
};

export const Spacer: ComponentConfig<{ height: string }> = {
  label: "Spacer",
  fields: { height: { type: "text", label: "Height (e.g. 2rem)" } },
  defaultProps: { height: "2rem" },
  render: ({ height }) => <div style={{ height }} />,
};

export const Divider: ComponentConfig<WithStyle<{ thickness?: string; color?: string }>> = {
  label: "Divider",
  fields: {
    thickness: { type: "text", label: "Thickness (e.g. 1px)" },
    color: { type: "text", label: "Color" },
    style: styleField,
  },
  defaultProps: {
    thickness: "1px",
    color: "rgba(255,255,255,0.08)",
    style: { base: { marginTop: "2rem", marginBottom: "2rem" } },
  },
  render: ({ thickness, color, style }) => {
    const r = resolveStyle(style);
    return (
      <>
        <StyleTag css={r.css} />
        <hr
          className={r.className}
          style={{
            ...r.inline,
            border: 0,
            borderTop: `${thickness || "1px"} solid ${color || "rgba(255,255,255,0.08)"}`,
          }}
        />
      </>
    );
  },
};

/* ─────────────────────────────────────────────────────────
   CONTENT BLOCKS
   ───────────────────────────────────────────────────────── */

export const Heading: ComponentConfig<
  WithStyle<{
    text: string;
    level: 1 | 2 | 3 | 4 | 5 | 6;
    gradient?: boolean;
  }>
> = {
  label: "Heading",
  fields: {
    text: { type: "text", label: "Text" },
    level: {
      type: "select",
      label: "Level",
      options: [1, 2, 3, 4, 5, 6].map((n) => ({ label: `H${n}`, value: n })),
    },
    gradient: {
      type: "radio",
      label: "Gradient text?",
      options: [
        { label: "No", value: false },
        { label: "Yes", value: true },
      ],
    },
    style: styleField,
  },
  defaultProps: {
    text: "Your Headline",
    level: 2,
    gradient: false,
    style: { base: { fontWeight: "900", fontSize: "clamp(2rem, 5vw, 3.5rem)" } },
  },
  render: ({ text, level, gradient, style }) => {
    const r = resolveStyle(style);
    const Tag = `h${level}` as "h2";
    return (
      <>
        <StyleTag css={r.css} />
        <Tag
          className={`${r.className} ${gradient ? "gradient-text-static" : ""}`}
          style={r.inline}
        >
          {text}
        </Tag>
      </>
    );
  },
};

export const Text: ComponentConfig<WithStyle<{ text: string }>> = {
  label: "Text / Paragraph",
  fields: {
    text: { type: "textarea", label: "Text" },
    style: styleField,
  },
  defaultProps: {
    text: "Some descriptive paragraph text. Edit me from the panel on the right.",
    style: { base: { fontSize: "1rem", lineHeight: "1.6", color: "var(--bx-color-mutedLight)" } },
  },
  render: ({ text, style }) => {
    const r = resolveStyle(style);
    return (
      <>
        <StyleTag css={r.css} />
        <p className={r.className} style={r.inline}>
          {text}
        </p>
      </>
    );
  },
};

export const RichText: ComponentConfig<WithStyle<{ html: string }>> = {
  label: "Rich text (HTML)",
  fields: {
    html: { type: "textarea", label: "HTML (sanitized on render)" },
    style: styleField,
  },
  defaultProps: { html: "<p>Edit me</p>", style: { base: {} } },
  render: ({ html, style }) => {
    const r = resolveStyle(style);
    const safe = sanitizeHtml(html ?? "");
    return (
      <>
        <StyleTag css={r.css} />
        <div
          className={r.className}
          style={r.inline}
          dangerouslySetInnerHTML={{ __html: safe }}
        />
      </>
    );
  },
};

export const Img: ComponentConfig<
  WithStyle<{ src: string; alt: string; width?: number; height?: number; rounded?: string }>
> = {
  label: "Image",
  fields: {
    src: { type: "text", label: "Image URL" },
    alt: { type: "text", label: "Alt text" },
    width: { type: "number", label: "Width (px)" },
    height: { type: "number", label: "Height (px)" },
    rounded: { type: "text", label: "Border radius (e.g. 1rem)" },
    style: styleField,
  },
  defaultProps: {
    src: "",
    alt: "",
    width: 1200,
    height: 800,
    rounded: "1rem",
    style: { base: {} },
  },
  render: ({ src, alt, width, height, rounded, style }) => {
    const r = resolveStyle(style);
    if (!src) {
      return (
        <div
          className={`${r.className} flex items-center justify-center bg-white/5 text-xs text-white/40`}
          style={{ ...r.inline, minHeight: 200, borderRadius: rounded }}
        >
          Add an image URL
        </div>
      );
    }
    return (
      <>
        <StyleTag css={r.css} />
        <div className={r.className} style={r.inline}>
          {/* Use native img to avoid Next.js remote-image domain config blocking it */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt || ""}
            width={width}
            height={height}
            style={{ width: "100%", height: "auto", borderRadius: rounded, display: "block" }}
          />
        </div>
      </>
    );
  },
};

export const Button: ComponentConfig<
  WithStyle<{ text: string; href: string; variant: "primary" | "ghost"; newTab?: boolean }>
> = {
  label: "Button",
  fields: {
    text: { type: "text", label: "Label" },
    href: { type: "text", label: "Link URL" },
    variant: {
      type: "radio",
      label: "Variant",
      options: [
        { label: "Primary", value: "primary" },
        { label: "Ghost", value: "ghost" },
      ],
    },
    newTab: {
      type: "radio",
      label: "Open in new tab?",
      options: [
        { label: "No", value: false },
        { label: "Yes", value: true },
      ],
    },
    style: styleField,
  },
  defaultProps: {
    text: "Click me",
    href: "#",
    variant: "primary",
    newTab: false,
    style: { base: {} },
  },
  render: ({ text, href, variant, newTab, style }) => {
    const r = resolveStyle(style);
    const cls = `${r.className} ${variant === "primary" ? "btn-primary" : "btn-ghost"}`;
    const isExternal = /^https?:\/\//i.test(href || "");
    if (isExternal || newTab) {
      return (
        <>
          <StyleTag css={r.css} />
          <a
            className={cls}
            style={r.inline}
            href={href || "#"}
            target={newTab ? "_blank" : undefined}
            rel={newTab ? "noopener noreferrer" : undefined}
          >
            {text}
          </a>
        </>
      );
    }
    return (
      <>
        <StyleTag css={r.css} />
        <Link className={cls} style={r.inline} href={href || "#"}>
          {text}
        </Link>
      </>
    );
  },
};

export const Video: ComponentConfig<
  WithStyle<{ src: string; poster?: string; controls?: boolean; loop?: boolean; autoPlay?: boolean; muted?: boolean }>
> = {
  label: "Video",
  fields: {
    src: { type: "text", label: "Video URL (mp4 or HLS)" },
    poster: { type: "text", label: "Poster image URL" },
    controls: { type: "radio", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
    loop: { type: "radio", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
    autoPlay: { type: "radio", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
    muted: { type: "radio", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
    style: styleField,
  },
  defaultProps: {
    src: "",
    poster: "",
    controls: true,
    loop: false,
    autoPlay: false,
    muted: true,
    style: { base: {} },
  },
  render: ({ src, poster, controls, loop, autoPlay, muted, style }) => {
    const r = resolveStyle(style);
    return (
      <>
        <StyleTag css={r.css} />
        <video
          className={r.className}
          style={{ ...r.inline, width: "100%", display: "block" }}
          src={src}
          poster={poster}
          controls={controls}
          loop={loop}
          autoPlay={autoPlay}
          muted={muted}
          playsInline
        />
      </>
    );
  },
};

export const HtmlEmbed: ComponentConfig<WithStyle<{ html: string }>> = {
  label: "HTML embed",
  fields: {
    html: { type: "textarea", label: "Raw HTML (script tags removed for safety)" },
    style: styleField,
  },
  defaultProps: { html: "", style: { base: {} } },
  render: ({ html, style }) => {
    const r = resolveStyle(style);
    return (
      <>
        <StyleTag css={r.css} />
        <div
          className={r.className}
          style={r.inline}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(html ?? "") }}
        />
      </>
    );
  },
};

/* ─────────────────────────────────────────────────────────
   SITE-SPECIFIC WRAPPERS
   ───────────────────────────────────────────────────────── */

export const NavbarBlock: ComponentConfig<Record<string, never>> = {
  label: "Site Navbar",
  fields: {},
  defaultProps: {},
  render: () => <SiteNavbar />,
};

export const FooterBlock: ComponentConfig<Record<string, never>> = {
  label: "Site Footer",
  fields: {},
  defaultProps: {},
  render: () => <SiteFooter />,
};

/* ─────────────────────────────────────────────────────────
   helpers
   ───────────────────────────────────────────────────────── */
function sanitizeHtml(input: string): string {
  // Strip <script>, on*= handlers, and javascript: URLs. Not a full sanitizer
  // — but good enough for editor-supplied snippets behind admin auth.
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/ on[a-z]+="[^"]*"/gi, "")
    .replace(/ on[a-z]+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

