"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ContentBlock } from "@/lib/types";
import {
  PageHeader, Card, Badge, Input, Button, EmptyState, Textarea,
} from "@/components/admin/AdminUI";
import { FileText, Pencil, X, Save, Plus, Trash2 } from "lucide-react";

const PAGES = ["all", "homepage", "pricing", "contact", "how-it-works", "about", "global"];

export default function ContentPage() {
  const supabase = createClient();
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("all");
  const [editing, setEditing] = useState<Partial<ContentBlock> | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadBlocks() {
    let query = supabase.from("content_blocks").select("*").order("page").order("section");
    if (activePage !== "all") query = query.eq("page", activePage);
    const { data } = await query;
    setBlocks((data as ContentBlock[]) ?? []);
  }

  useEffect(() => {
    loadBlocks().then(() => setLoading(false));
  }, [activePage]);

  async function saveBlock() {
    if (!editing?.page || !editing?.section || !editing?.key) return;
    setSaving(true);
    if (editing.id) {
      await supabase.from("content_blocks").update(editing).eq("id", editing.id);
    } else {
      await supabase.from("content_blocks").insert(editing);
    }
    setSaving(false);
    setEditing(null);
    loadBlocks();
  }

  async function deleteBlock(id: string) {
    if (!confirm("Delete this content block?")) return;
    await supabase.from("content_blocks").delete().eq("id", id);
    loadBlocks();
  }

  // group by section
  const grouped: Record<string, ContentBlock[]> = {};
  blocks.forEach((b) => {
    const key = `${b.page} / ${b.section}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(b);
  });

  return (
    <div>
      <PageHeader title="Content CMS" description="Edit your website copy and content blocks.">
        <Button onClick={() => setEditing({ page: activePage === "all" ? "homepage" : activePage, section: "", key: "", value: "", type: "text" })}>
          <Plus size={16} /> Add Block
        </Button>
      </PageHeader>

      {/* Page filter tabs */}
      <div className="mb-6 flex flex-wrap gap-1 rounded-xl bg-white/[0.03] p-1 border border-white/[0.06] w-fit">
        {PAGES.map((p) => (
          <button
            key={p}
            onClick={() => setActivePage(p)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
              activePage === p ? "bg-[#ff1a6c]/10 text-[#ff1a6c]" : "text-gray-400 hover:text-white"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {loading ? (
        <Card>
          <div className="flex items-center justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-[#ff1a6c]" />
          </div>
        </Card>
      ) : blocks.length === 0 ? (
        <Card>
          <EmptyState icon={FileText} title="No content blocks" description="Add content blocks to manage your website copy." />
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([sectionKey, items]) => (
            <Card key={sectionKey}>
              <div className="border-b border-white/[0.06] px-5 py-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">{sectionKey}</h3>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {items.map((block) => (
                  <div key={block.id} className="flex items-start gap-4 px-5 py-4">
                    <div className="flex-1 min-w-0">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="font-mono text-xs text-[#ff1a6c]">{block.key}</span>
                        <Badge>{block.type}</Badge>
                      </div>
                      <p className="text-sm text-gray-300 line-clamp-2">
                        {block.value || <span className="italic text-gray-500">empty</span>}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => setEditing(block)} className="rounded-lg p-2 text-gray-400 hover:bg-white/[0.05] hover:text-white">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => deleteBlock(block.id)} className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit / Create modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a0a0f] p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-black text-white">{editing.id ? "Edit Block" : "New Content Block"}</h2>
              <button onClick={() => setEditing(null)} className="rounded-lg p-2 text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Page" value={editing.page ?? ""} onChange={(e) => setEditing({ ...editing, page: e.target.value })} placeholder="homepage" />
                <Input label="Section" value={editing.section ?? ""} onChange={(e) => setEditing({ ...editing, section: e.target.value })} placeholder="hero" />
              </div>
              <Input label="Key" value={editing.key ?? ""} onChange={(e) => setEditing({ ...editing, key: e.target.value })} placeholder="title" />
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">Type</label>
                <div className="flex gap-2">
                  {["text", "richtext", "image", "json"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setEditing({ ...editing, type: t as ContentBlock["type"] })}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                        editing.type === t
                          ? "bg-[#ff1a6c]/10 text-[#ff1a6c] border border-[#ff1a6c]/20"
                          : "bg-white/[0.05] text-gray-400 border border-white/[0.06] hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <Textarea
                label="Value"
                rows={editing.type === "richtext" ? 8 : 3}
                value={editing.value ?? ""}
                onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                placeholder="Content value…"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={saveBlock} loading={saving}>
                <Save size={14} /> {editing.id ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
