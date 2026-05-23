"use client";

import { useState } from "react";
import type { Theme, ThemeTokens } from "@/builder/types";

const colorKeys = [
  "primary",
  "primaryLight",
  "secondary",
  "accent",
  "background",
  "foreground",
  "muted",
  "mutedLight",
  "surface0",
  "surface1",
  "surface2",
  "surface3",
] as const;
const radiusKeys = ["none", "sm", "md", "lg", "xl", "full"] as const;

export default function ThemeEditor({ theme }: { theme: Theme }) {
  const [tokens, setTokens] = useState<ThemeTokens>(theme.tokens || {});
  const [name, setName] = useState(theme.name);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  function setColor(k: string, v: string) {
    setTokens((t) => ({ ...t, colors: { ...(t.colors || {}), [k]: v } }));
  }
  function setRadius(k: string, v: string) {
    setTokens((t) => ({ ...t, radii: { ...(t.radii || {}), [k]: v } }));
  }
  function setFont(k: "body" | "heading", v: string) {
    setTokens((t) => ({ ...t, fonts: { ...(t.fonts || {}), [k]: v } }));
  }

  async function save() {
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/builder/themes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: theme.id, name, tokens }),
    });
    setBusy(false);
    setMsg(res.ok ? "Saved ✓" : "Save failed");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0f] p-5">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400">
          Theme name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full max-w-md rounded-lg border border-white/[0.08] bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#ff1a6c]"
        />
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0f] p-5">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Colors</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {colorKeys.map((k) => (
            <div key={k}>
              <label className="mb-1 block text-xs font-semibold capitalize text-gray-400">
                {k}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={tokens.colors?.[k] || "#000000"}
                  onChange={(e) => setColor(k, e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded border border-white/[0.08] bg-transparent"
                />
                <input
                  type="text"
                  value={tokens.colors?.[k] || ""}
                  onChange={(e) => setColor(k, e.target.value)}
                  className="flex-1 rounded-lg border border-white/[0.08] bg-black/40 px-2 py-1.5 text-xs text-white outline-none focus:border-[#ff1a6c]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0f] p-5">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Fonts</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {((["body", "heading"] as const)).map((k) => (
            <div key={k}>
              <label className="mb-1 block text-xs font-semibold capitalize text-gray-400">
                {k}
              </label>
              <input
                type="text"
                value={tokens.fonts?.[k] || ""}
                onChange={(e) => setFont(k, e.target.value)}
                placeholder='e.g. "Inter", sans-serif'
                className="w-full rounded-lg border border-white/[0.08] bg-black/40 px-2 py-1.5 text-xs text-white outline-none focus:border-[#ff1a6c]"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0f] p-5">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Radius</h2>
        <div className="grid gap-4 sm:grid-cols-4">
          {radiusKeys.map((k) => (
            <div key={k}>
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">
                {k}
              </label>
              <input
                type="text"
                value={tokens.radii?.[k] || ""}
                onChange={(e) => setRadius(k, e.target.value)}
                placeholder="e.g. 12px"
                className="w-full rounded-lg border border-white/[0.08] bg-black/40 px-2 py-1.5 text-xs text-white outline-none focus:border-[#ff1a6c]"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={save}
          disabled={busy}
          className="rounded-lg bg-[#ff1a6c] px-5 py-2 text-sm font-bold text-white hover:bg-[#ff5c99] disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save theme"}
        </button>
        {msg && <span className="text-sm text-gray-300">{msg}</span>}
      </div>
    </div>
  );
}
