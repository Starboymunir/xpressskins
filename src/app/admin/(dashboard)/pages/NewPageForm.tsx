"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPageForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const res = await fetch("/api/builder/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug }),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) {
      setErr(json.error || "Failed");
      return;
    }
    router.push(`/admin/pages/${json.page.id}/edit`);
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-wrap items-end gap-3 rounded-2xl border border-white/[0.06] bg-[#0a0a0f] p-4"
    >
      <div className="flex-1 min-w-[180px]">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400">
          Title
        </label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. About us"
          className="w-full rounded-lg border border-white/[0.08] bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#ff1a6c]"
        />
      </div>
      <div className="flex-1 min-w-[180px]">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400">
          Slug (empty = home)
        </label>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="about-us"
          className="w-full rounded-lg border border-white/[0.08] bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#ff1a6c]"
        />
      </div>
      <button
        type="submit"
        disabled={busy}
        className="rounded-lg bg-[#ff1a6c] px-4 py-2 text-sm font-bold text-white hover:bg-[#ff5c99] disabled:opacity-50"
      >
        {busy ? "Creating…" : "Create page"}
      </button>
      {err && <p className="basis-full text-sm text-red-400">{err}</p>}
    </form>
  );
}
