"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PageRowActions({ id, isAdmin }: { id: string; isAdmin: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function publish() {
    setBusy(true);
    await fetch(`/api/builder/pages/${id}/publish`, { method: "POST" });
    setBusy(false);
    router.refresh();
  }
  async function remove() {
    if (!confirm("Delete this page? This cannot be undone.")) return;
    setBusy(true);
    await fetch(`/api/builder/pages/${id}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  }

  return (
    <>
      <button
        onClick={publish}
        disabled={busy}
        className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 disabled:opacity-50"
      >
        Publish
      </button>
      {isAdmin && (
        <button
          onClick={remove}
          disabled={busy}
          className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/20 disabled:opacity-50"
        >
          Delete
        </button>
      )}
    </>
  );
}
