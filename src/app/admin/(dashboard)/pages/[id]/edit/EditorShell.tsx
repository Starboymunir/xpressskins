"use client";

import { Puck, type Data } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { builderConfig } from "@/builder/config";
import type { PageRow } from "@/builder/types";

export default function EditorShell({ page }: { page: PageRow }) {
  const router = useRouter();
  const [status, setStatus] = useState<string>("Saved");
  const [data, setData] = useState<Data>((page.draft_data as Data) || { content: [], root: { props: {} } });

  // Persist draft on every Puck change (debounced)
  const save = useCallback(
    async (next: Data) => {
      setStatus("Saving…");
      const res = await fetch(`/api/builder/pages/${page.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft_data: next }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setStatus(`Error: ${j.error || res.status}`);
      } else {
        setStatus("Saved");
      }
    },
    [page.id],
  );

  // Debounce
  let timer: ReturnType<typeof setTimeout> | null = null;
  function scheduleSave(next: Data) {
    setData(next);
    setStatus("Editing…");
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => save(next), 800);
  }

  async function publish() {
    setStatus("Publishing…");
    await fetch(`/api/builder/pages/${page.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ draft_data: data }),
    });
    const res = await fetch(`/api/builder/pages/${page.id}/publish`, { method: "POST" });
    if (res.ok) {
      setStatus("Published ✓");
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setStatus(`Publish failed: ${j.error || res.status}`);
    }
  }

  return (
    <div className="flex h-screen flex-col bg-[#050508] text-white">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] bg-[#0a0a0f] px-4 py-3">
        <div className="flex items-center gap-3">
          <a href="/admin/pages" className="text-xs text-gray-400 hover:text-white">
            ← All pages
          </a>
          <div className="text-sm font-semibold">{page.title}</div>
          <code className="rounded bg-white/[0.04] px-2 py-0.5 text-xs text-gray-400">
            /p/{page.slug}
          </code>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">{status}</span>
          <a
            href={`/p/${page.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs font-semibold hover:bg-white/10"
          >
            Preview
          </a>
          <button
            onClick={publish}
            className="rounded-lg bg-[#ff1a6c] px-4 py-1.5 text-xs font-bold hover:bg-[#ff5c99]"
          >
            Publish
          </button>
        </div>
      </div>

      {/* Puck */}
      <div className="flex-1 overflow-hidden bg-white text-black">
        <Puck
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          config={builderConfig as any}
          data={data}
          onChange={scheduleSave}
          onPublish={publish}
        />
      </div>
    </div>
  );
}
