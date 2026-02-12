"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Quote } from "@/lib/types";
import {
  PageHeader, Card, Badge, Input, Select, Button, EmptyState, Textarea,
  quoteStatusColor,
} from "@/components/admin/AdminUI";
import { Inbox, Eye, X, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "quoted", label: "Quoted" },
  { value: "approved", label: "Approved" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const STATUS_FLOW = ["new", "contacted", "quoted", "approved", "in_progress", "completed"];

export default function QuotesPage() {
  const supabase = createClient();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState<Quote | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [quotedPrice, setQuotedPrice] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadQuotes() {
    let query = supabase.from("quotes").select("*").order("created_at", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter);
    const { data } = await query;
    setQuotes((data as Quote[]) ?? []);
  }

  useEffect(() => {
    loadQuotes().then(() => setLoading(false));
  }, [filter]);

  function openQuote(q: Quote) {
    setViewing(q);
    setAdminNotes(q.admin_notes ?? "");
    setQuotedPrice(q.quoted_price?.toString() ?? "");
  }

  async function updateStatus(id: string, newStatus: string) {
    await supabase.from("quotes").update({ status: newStatus }).eq("id", id);
    if (viewing?.id === id) setViewing({ ...viewing!, status: newStatus as Quote["status"] });
    loadQuotes();
  }

  async function saveQuoteDetails() {
    if (!viewing) return;
    setSaving(true);
    await supabase.from("quotes").update({
      admin_notes: adminNotes,
      quoted_price: quotedPrice ? Number(quotedPrice) : null,
    }).eq("id", viewing.id);
    setSaving(false);
    setViewing(null);
    loadQuotes();
  }

  async function deleteQuote(id: string) {
    if (!confirm("Delete this quote request?")) return;
    await supabase.from("quotes").delete().eq("id", id);
    if (viewing?.id === id) setViewing(null);
    loadQuotes();
  }

  const filtered = quotes.filter((q) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      q.name.toLowerCase().includes(s) ||
      q.email.toLowerCase().includes(s) ||
      (q.vehicle_info ?? "").toLowerCase().includes(s) ||
      (q.wrap_type ?? "").toLowerCase().includes(s)
    );
  });

  const newCount = quotes.filter((q) => q.status === "new").length;

  return (
    <div>
      <PageHeader title="Quote Requests" description={`${quotes.length} total · ${newCount} new`} />

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Search name, email, vehicle…" value={search} onChange={(e) => setSearch(e.target.value)} className="sm:max-w-xs" />
        <Select value={filter} onChange={(e) => setFilter(e.target.value)} options={STATUS_OPTIONS} className="sm:max-w-[180px]" />
      </div>

      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-[#ff1a6c]" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Inbox} title="No quotes" description="Quote requests from customers will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Wrap Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((q) => (
                  <tr key={q.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{q.name}</p>
                      <p className="text-xs text-gray-400">{q.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{q.vehicle_info || "—"}</td>
                    <td className="px-4 py-3 text-gray-300">{q.wrap_type || "—"}</td>
                    <td className="px-4 py-3">
                      <Badge variant={quoteStatusColor(q.status)}>{q.status.replace("_", " ")}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{new Date(q.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openQuote(q)} className="rounded-lg p-2 text-gray-400 hover:bg-white/[0.05] hover:text-white" title="View details">
                          <Eye size={14} />
                        </button>
                        {STATUS_FLOW.indexOf(q.status) < STATUS_FLOW.length - 1 && (
                          <button
                            onClick={() => updateStatus(q.id, STATUS_FLOW[STATUS_FLOW.indexOf(q.status) + 1])}
                            className="rounded-lg p-2 text-[#ff1a6c] hover:bg-[#ff1a6c]/10"
                            title={`Move to ${STATUS_FLOW[STATUS_FLOW.indexOf(q.status) + 1]}`}
                          >
                            <ChevronUp size={14} />
                          </button>
                        )}
                        {STATUS_FLOW.indexOf(q.status) > 0 && (
                          <button
                            onClick={() => updateStatus(q.id, STATUS_FLOW[STATUS_FLOW.indexOf(q.status) - 1])}
                            className="rounded-lg p-2 text-gray-400 hover:bg-white/[0.05]"
                            title={`Move back to ${STATUS_FLOW[STATUS_FLOW.indexOf(q.status) - 1]}`}
                          >
                            <ChevronDown size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Quote detail modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0a0a0f] p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white">{viewing.name}</h2>
                <p className="text-sm text-gray-400">{viewing.email}{viewing.phone ? ` · ${viewing.phone}` : ""}</p>
              </div>
              <button onClick={() => setViewing(null)} className="rounded-lg p-2 text-gray-400 hover:text-white"><X size={20} /></button>
            </div>

            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
                <p className="mb-1 text-xs font-semibold uppercase text-gray-400">Vehicle</p>
                <p className="text-white">{viewing.vehicle_info || "Not specified"}</p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
                <p className="mb-1 text-xs font-semibold uppercase text-gray-400">Wrap Type</p>
                <p className="text-white">{viewing.wrap_type || "Not specified"}</p>
              </div>
            </div>

            {viewing.message && (
              <div className="mb-6 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
                <p className="mb-1 text-xs font-semibold uppercase text-gray-400">Message</p>
                <p className="whitespace-pre-wrap text-gray-300">{viewing.message}</p>
              </div>
            )}

            {viewing.reference_images && viewing.reference_images.length > 0 && (
              <div className="mb-6">
                <p className="mb-2 text-xs font-semibold uppercase text-gray-400">Reference Images</p>
                <div className="flex gap-2 overflow-x-auto">
                  {viewing.reference_images.map((url, i) => (
                    <img key={i} src={url} alt={`Reference ${i + 1}`} className="h-24 w-24 rounded-lg border border-white/10 object-cover" />
                  ))}
                </div>
              </div>
            )}

            {/* Status progress */}
            <div className="mb-6">
              <p className="mb-2 text-xs font-semibold uppercase text-gray-400">Status</p>
              <div className="flex flex-wrap gap-2">
                {STATUS_FLOW.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(viewing.id, s)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      viewing.status === s
                        ? "bg-[#ff1a6c] text-white"
                        : STATUS_FLOW.indexOf(s) < STATUS_FLOW.indexOf(viewing.status)
                        ? "bg-green-500/10 text-green-400"
                        : "bg-white/[0.05] text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {s.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Quoted price */}
            <Input
              label="Quoted Price ($)"
              type="number"
              value={quotedPrice}
              onChange={(e) => setQuotedPrice(e.target.value)}
              placeholder="0.00"
            />

            {/* Admin notes */}
            <div className="mt-4">
              <Textarea
                label="Admin Notes"
                rows={4}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Internal notes about this quote…"
              />
            </div>

            <div className="mt-6 flex justify-between">
              <Button variant="danger" onClick={() => deleteQuote(viewing.id)}>Delete</Button>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setViewing(null)}>Close</Button>
                <Button onClick={saveQuoteDetails} loading={saving}>
                  <MessageSquare size={14} /> Save Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
