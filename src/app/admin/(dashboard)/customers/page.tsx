"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Customer, Quote } from "@/lib/types";
import {
  PageHeader, Card, Badge, Input, Button, EmptyState, Textarea,
  quoteStatusColor,
} from "@/components/admin/AdminUI";
import { Users, Plus, Pencil, Trash2, X, Eye, Mail, Phone } from "lucide-react";

export default function CustomersPage() {
  const supabase = createClient();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Partial<Customer> | null>(null);
  const [saving, setSaving] = useState(false);
  const [viewing, setViewing] = useState<Customer | null>(null);
  const [customerQuotes, setCustomerQuotes] = useState<Quote[]>([]);

  async function loadCustomers() {
    const { data } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
    setCustomers((data as Customer[]) ?? []);
  }

  useEffect(() => {
    loadCustomers().then(() => setLoading(false));
  }, []);

  async function saveCustomer() {
    if (!editing?.name || !editing?.email) return;
    setSaving(true);
    if (editing.id) {
      await supabase.from("customers").update(editing).eq("id", editing.id);
    } else {
      await supabase.from("customers").insert(editing);
    }
    setSaving(false);
    setEditing(null);
    loadCustomers();
  }

  async function deleteCustomer(id: string) {
    if (!confirm("Delete this customer?")) return;
    await supabase.from("customers").delete().eq("id", id);
    loadCustomers();
  }

  async function viewCustomer(c: Customer) {
    setViewing(c);
    const { data } = await supabase.from("quotes").select("*").eq("email", c.email).order("created_at", { ascending: false });
    setCustomerQuotes((data as Quote[]) ?? []);
  }

  const filtered = customers.filter((c) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return c.name.toLowerCase().includes(s) || c.email.toLowerCase().includes(s) || (c.phone ?? "").includes(s);
  });

  return (
    <div>
      <PageHeader title="Customers" description={`${customers.length} total`}>
        <Button onClick={() => setEditing({ name: "", email: "", phone: "", notes: "" })}>
          <Plus size={16} /> Add Customer
        </Button>
      </PageHeader>

      <div className="mb-6">
        <Input placeholder="Search name, email, phone…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-md" />
      </div>

      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-[#ff1a6c]" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Users} title="No customers yet" description="Customers will appear here as quotes come in." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Quotes</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((c) => (
                  <tr key={c.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{c.phone || "—"}</td>
                    <td className="px-4 py-3 text-gray-300">{c.total_quotes ?? 0}</td>
                    <td className="px-4 py-3 text-gray-400">{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => viewCustomer(c)} className="rounded-lg p-2 text-gray-400 hover:bg-white/[0.05] hover:text-white" title="View">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => setEditing(c)} className="rounded-lg p-2 text-gray-400 hover:bg-white/[0.05] hover:text-white" title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => deleteCustomer(c.id)} className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400" title="Delete">
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

      {/* Edit / Add modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a0a0f] p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-black text-white">{editing.id ? "Edit Customer" : "Add Customer"}</h2>
              <button onClick={() => setEditing(null)} className="rounded-lg p-2 text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <Input label="Full Name" value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="John Doe" />
              <Input label="Email" type="email" value={editing.email ?? ""} onChange={(e) => setEditing({ ...editing, email: e.target.value })} placeholder="john@example.com" />
              <Input label="Phone" value={editing.phone ?? ""} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} placeholder="(346) 555-0000" />
              <Textarea label="Notes" value={editing.notes ?? ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} rows={3} placeholder="Customer notes…" />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={saveCustomer} loading={saving}>{editing.id ? "Update" : "Add Customer"}</Button>
            </div>
          </div>
        </div>
      )}

      {/* View customer detail */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0a0a0f] p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-black text-white">{viewing.name}</h2>
              <button onClick={() => setViewing(null)} className="rounded-lg p-2 text-gray-400 hover:text-white"><X size={20} /></button>
            </div>

            <div className="mb-6 flex flex-wrap gap-4">
              <a href={`mailto:${viewing.email}`} className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-sm text-gray-300 hover:text-white">
                <Mail size={14} /> {viewing.email}
              </a>
              {viewing.phone && (
                <a href={`tel:${viewing.phone}`} className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-sm text-gray-300 hover:text-white">
                  <Phone size={14} /> {viewing.phone}
                </a>
              )}
            </div>

            {viewing.notes && (
              <div className="mb-6 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
                <p className="mb-1 text-xs font-semibold uppercase text-gray-400">Notes</p>
                <p className="whitespace-pre-wrap text-gray-300">{viewing.notes}</p>
              </div>
            )}

            <h3 className="mb-3 text-sm font-semibold uppercase text-gray-400">Quote History ({customerQuotes.length})</h3>
            {customerQuotes.length === 0 ? (
              <p className="text-sm text-gray-500">No quotes from this customer.</p>
            ) : (
              <div className="space-y-2">
                {customerQuotes.map((q) => (
                  <div key={q.id} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                    <div>
                      <p className="text-sm text-white">{q.wrap_type || "Quote"} — {q.vehicle_info || "No vehicle"}</p>
                      <p className="text-xs text-gray-400">{new Date(q.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {q.quoted_price && <span className="text-sm font-semibold text-[#ff1a6c]">${q.quoted_price}</span>}
                      <Badge variant={quoteStatusColor(q.status)}>{q.status.replace("_", " ")}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button variant="secondary" onClick={() => setViewing(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
