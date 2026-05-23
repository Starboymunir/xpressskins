"use client";

import { useState } from "react";
import type { AssetRow } from "@/builder/types";

export default function AssetLibrary({ initial }: { initial: AssetRow[] }) {
  const [assets, setAssets] = useState<AssetRow[]>(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setErr(null);
    const next: AssetRow[] = [];
    for (const f of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/builder/assets", { method: "POST", body: fd });
      const j = await res.json();
      if (!res.ok) {
        setErr(j.error || "Upload failed");
        break;
      }
      next.push(j.asset as AssetRow);
    }
    setBusy(false);
    setAssets((cur) => [...next, ...cur]);
  }

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url);
  }

  return (
    <div className="space-y-6">
      <label className="flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-[#0a0a0f] p-10 text-center transition hover:border-[#ff1a6c]/50 hover:bg-[#ff1a6c]/[0.03]">
        <div>
          <div className="text-sm font-semibold text-white">
            {busy ? "Uploading…" : "Click to upload or drop files"}
          </div>
          <div className="mt-1 text-xs text-gray-400">PNG, JPG, SVG, WebP, MP4</div>
        </div>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => upload(e.target.files)}
        />
      </label>
      {err && <p className="text-sm text-red-400">{err}</p>}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {assets.map((a) => (
          <button
            key={a.id}
            onClick={() => copyUrl(a.url)}
            className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a0a0f] aspect-square"
            title="Click to copy URL"
          >
            {a.type === "video" ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video src={a.url} className="h-full w-full object-cover" muted />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={a.url} alt={a.alt || ""} className="h-full w-full object-cover" />
            )}
            <div className="absolute inset-x-0 bottom-0 truncate bg-black/70 px-2 py-1 text-[10px] text-white opacity-0 transition group-hover:opacity-100">
              {a.url.split("/").pop()}
            </div>
          </button>
        ))}
      </div>
      {assets.length === 0 && (
        <p className="text-center text-sm text-gray-500">No assets yet.</p>
      )}
    </div>
  );
}
