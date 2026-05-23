/**
 * Reusable Puck field-group definitions.
 * We construct field objects (not custom field components) so Puck
 * auto-renders the inputs. This keeps v1 simple and reliable.
 */
import type { Field, ObjectField } from "@puckeditor/core";
import type { StyleProps, ResponsiveStyle } from "./types";

/** A single StyleProps schema — flat list of inputs. */
const styleFields: ObjectField<StyleProps>["objectFields"] = {
  // Background / colors
  bg: { type: "text", label: "Background color (e.g. #0e0e16 or token)" },
  bgImage: { type: "text", label: "Background image URL" },
  bgSize: {
    type: "select",
    label: "Background size",
    options: [
      { label: "—", value: "" as unknown as "cover" },
      { label: "cover", value: "cover" },
      { label: "contain", value: "contain" },
      { label: "auto", value: "auto" },
    ],
  },
  bgPosition: { type: "text", label: "Background position (e.g. center)" },
  color: { type: "text", label: "Text color" },

  // Typography
  fontFamily: { type: "text", label: "Font family" },
  fontSize: { type: "text", label: "Font size (1rem, 18px, clamp(…) )" },
  fontWeight: {
    type: "select",
    label: "Font weight",
    options: [
      { label: "—", value: "" },
      { label: "300", value: "300" },
      { label: "400", value: "400" },
      { label: "500", value: "500" },
      { label: "600", value: "600" },
      { label: "700", value: "700" },
      { label: "800", value: "800" },
      { label: "900", value: "900" },
    ],
  },
  lineHeight: { type: "text", label: "Line height" },
  letterSpacing: { type: "text", label: "Letter spacing" },
  textAlign: {
    type: "select",
    label: "Text align",
    options: [
      { label: "—", value: "" as unknown as "left" },
      { label: "left", value: "left" },
      { label: "center", value: "center" },
      { label: "right", value: "right" },
      { label: "justify", value: "justify" },
    ],
  },

  // Spacing
  paddingTop: { type: "text", label: "Padding top" },
  paddingRight: { type: "text", label: "Padding right" },
  paddingBottom: { type: "text", label: "Padding bottom" },
  paddingLeft: { type: "text", label: "Padding left" },
  marginTop: { type: "text", label: "Margin top" },
  marginRight: { type: "text", label: "Margin right" },
  marginBottom: { type: "text", label: "Margin bottom" },
  marginLeft: { type: "text", label: "Margin left" },

  // Box
  width: { type: "text", label: "Width" },
  maxWidth: { type: "text", label: "Max width" },
  minHeight: { type: "text", label: "Min height" },
  borderRadius: { type: "text", label: "Border radius (e.g. 0.75rem, 9999px)" },
  borderWidth: { type: "text", label: "Border width" },
  borderColor: { type: "text", label: "Border color" },
  borderStyle: {
    type: "select",
    label: "Border style",
    options: [
      { label: "—", value: "" as unknown as "solid" },
      { label: "solid", value: "solid" },
      { label: "dashed", value: "dashed" },
      { label: "dotted", value: "dotted" },
      { label: "none", value: "none" },
    ],
  },
  boxShadow: { type: "text", label: "Box shadow (CSS)" },
  opacity: { type: "text", label: "Opacity (0–1)" },

  // Layout
  display: {
    type: "select",
    label: "Display",
    options: [
      { label: "—", value: "" as unknown as "block" },
      { label: "block", value: "block" },
      { label: "flex", value: "flex" },
      { label: "inline-flex", value: "inline-flex" },
      { label: "grid", value: "grid" },
      { label: "inline-block", value: "inline-block" },
    ],
  },
  flexDirection: {
    type: "select",
    label: "Flex direction",
    options: [
      { label: "—", value: "" as unknown as "row" },
      { label: "row", value: "row" },
      { label: "column", value: "column" },
      { label: "row-reverse", value: "row-reverse" },
      { label: "column-reverse", value: "column-reverse" },
    ],
  },
  alignItems: {
    type: "select",
    label: "Align items",
    options: [
      { label: "—", value: "" as unknown as "stretch" },
      { label: "stretch", value: "stretch" },
      { label: "center", value: "center" },
      { label: "flex-start", value: "flex-start" },
      { label: "flex-end", value: "flex-end" },
      { label: "baseline", value: "baseline" },
    ],
  },
  justifyContent: {
    type: "select",
    label: "Justify content",
    options: [
      { label: "—", value: "" as unknown as "flex-start" },
      { label: "flex-start", value: "flex-start" },
      { label: "center", value: "center" },
      { label: "flex-end", value: "flex-end" },
      { label: "space-between", value: "space-between" },
      { label: "space-around", value: "space-around" },
      { label: "space-evenly", value: "space-evenly" },
    ],
  },
  gap: { type: "text", label: "Gap" },
  gridTemplateColumns: { type: "text", label: "Grid template columns (e.g. 1fr 1fr)" },
} as ObjectField<StyleProps>["objectFields"];

/** Top-level `style` field: { base, md, lg } each = StyleProps. */
export const styleField: Field<ResponsiveStyle | undefined> = {
  type: "object",
  label: "Style (base / tablet / desktop)",
  objectFields: {
    base: {
      type: "object",
      label: "Base (all screens)",
      objectFields: styleFields,
    },
    md: {
      type: "object",
      label: "Tablet ≥ 768px (overrides)",
      objectFields: styleFields,
    },
    lg: {
      type: "object",
      label: "Desktop ≥ 1024px (overrides)",
      objectFields: styleFields,
    },
  } as ObjectField<ResponsiveStyle>["objectFields"],
};

/** Convenience SEO fields (used on Root). */
export const seoField: Field = {
  type: "object",
  label: "SEO",
  objectFields: {
    title: { type: "text", label: "Page title" },
    description: { type: "textarea", label: "Meta description" },
    image: { type: "text", label: "Social share image URL" },
  },
};
