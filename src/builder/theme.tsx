/**
 * Theme helpers — read the active theme and emit CSS variables.
 */
import type { Theme, ThemeTokens } from "./types";

export function tokensToCssVars(tokens: ThemeTokens): string {
  const lines: string[] = [];
  for (const [k, v] of Object.entries(tokens.colors ?? {})) {
    lines.push(`--bx-color-${k}: ${v};`);
  }
  for (const [k, v] of Object.entries(tokens.radii ?? {})) {
    lines.push(`--bx-radius-${k}: ${v};`);
  }
  for (const [k, v] of Object.entries(tokens.spacing ?? {})) {
    lines.push(`--bx-space-${k}: ${v};`);
  }
  for (const [k, v] of Object.entries(tokens.shadows ?? {})) {
    lines.push(`--bx-shadow-${k}: ${v};`);
  }
  if (tokens.fonts?.body) lines.push(`--bx-font-body: ${tokens.fonts.body};`);
  if (tokens.fonts?.heading) lines.push(`--bx-font-heading: ${tokens.fonts.heading};`);
  return `:root{${lines.join("")}}`;
}

export function ThemeStyle({ theme }: { theme: Theme | null }) {
  if (!theme) return null;
  return (
    <style
      dangerouslySetInnerHTML={{ __html: tokensToCssVars(theme.tokens) }}
    />
  );
}
