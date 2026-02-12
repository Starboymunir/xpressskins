"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/lib/types";
import {
  PageHeader, Card, Badge, Input, Textarea, Select, Button, EmptyState,
} from "@/components/admin/AdminUI";
import { Package, Plus, Pencil, Trash2, X, Search, DollarSign } from "lucide-react";

const CATEGORIES = [
  { value: "full_wrap", label: "Full Wrap" },
  { value: "partial_wrap", label: "Partial Wrap" },
  { value: "hood", label: "Hood" },
  { value: "trunk", label: "Trunk" },
  { value: "color_change", label: "Color Change" },
  { value: "custom", label: "Custom" },
];

const STATUSES = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function ProductsPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });
    setProducts((data as Product[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.includes(search.toLowerCase()),
  );

  function openNew() {
    setEditing({
      name: "", slug: "", description: "", short_description: "",
      category: "full_wrap", base_price: 0, sale_price: null,
      images: [], featured: false, status: "draft", sort_order: products.length,
    });
  }

  async function save() {
    if (!editing?.name) return;
    setSaving(true);

    const payload = {
      ...editing,
      slug: editing.slug || slugify(editing.name),
    };

    if (editing.id) {
      await supabase.from("products").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("products").insert(payload);
    }

    setSaving(false);
    setEditing(null);
    load();
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <PageHeader title="Products" description="Manage your wrap products and pricing.">
        <Button onClick={openNew}><Plus size={16} /> Add Product</Button>
      </PageHeader>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/[0.05] py-3 pl-11 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-[#ff1a6c]/50"
        />
      </div>

      {/* Table */}
      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-[#ff1a6c]" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Package} title="No products yet" description="Add your first wrap product to get started." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06] text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-6 py-4">
                      <div>
                        <span className="text-sm font-semibold text-white">{p.name}</span>
                        {p.featured && <Badge variant="accent">Featured</Badge>}
                        <p className="mt-0.5 text-xs text-gray-500 truncate max-w-xs">{p.short_description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge>{p.category.replace("_", " ")}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-white">${p.base_price}</span>
                      {p.sale_price && (
                        <span className="ml-2 text-xs text-green-400">${p.sale_price}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={p.status === "active" ? "green" : p.status === "draft" ? "amber" : "default"}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setEditing(p)} className="rounded-lg p-2 text-gray-400 hover:bg-white/[0.05] hover:text-white">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => deleteProduct(p.id)} className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Edit/Create modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0a0a0f] p-6 max-h-[90vh] overflow-y-auto">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-black text-white">
                {editing.id ? "Edit Product" : "New Product"}
              </h2>
              <button onClick={() => setEditing(null)} className="rounded-lg p-2 text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Product Name" value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Cyberpunk Lucy GR Corolla" />
                <Input label="Slug" value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="cyberpunk-lucy-gr-corolla" />
              </div>
              <Input label="Short Description" value={editing.short_description ?? ""} onChange={(e) => setEditing({ ...editing, short_description: e.target.value })} placeholder="Full body anime wrap with custom artwork" />
              <Textarea label="Full Description" value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={4} placeholder="Detailed description..." />
              <div className="grid gap-5 sm:grid-cols-3">
                <Select label="Category" value={editing.category ?? "custom"} onChange={(e) => setEditing({ ...editing, category: e.target.value as Product["category"] })} options={CATEGORIES} />
                <Input label="Base Price" type="number" value={editing.base_price ?? 0} onChange={(e) => setEditing({ ...editing, base_price: Number(e.target.value) })} />
                <Input label="Sale Price" type="number" value={editing.sale_price ?? ""} onChange={(e) => setEditing({ ...editing, sale_price: e.target.value ? Number(e.target.value) : null })} placeholder="Optional" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Select label="Status" value={editing.status ?? "draft"} onChange={(e) => setEditing({ ...editing, status: e.target.value as Product["status"] })} options={STATUSES} />
                <Input label="Sort Order" type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={editing.featured ?? false}
                  onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#ff1a6c] focus:ring-[#ff1a6c]"
                />
                <label className="text-sm text-gray-300">Featured product</label>
              </div>
              <Textarea label="Image URLs (one per line)" value={(editing.images ?? []).join("\n")} onChange={(e) => setEditing({ ...editing, images: e.target.value.split("\n").filter(Boolean) })} rows={3} placeholder="Drive ID or image URL, one per line" />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={save} loading={saving}>
                <DollarSign size={14} />
                {editing.id ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
