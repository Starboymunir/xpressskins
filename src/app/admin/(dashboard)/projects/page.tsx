"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/lib/types";
import {
  PageHeader, Card, Badge, Input, Select, Button, EmptyState, Textarea,
  projectStatusColor,
} from "@/components/admin/AdminUI";
import { FolderKanban, Plus, Pencil, Trash2, X, Eye } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "design", label: "Design" },
  { value: "revision", label: "Revision" },
  { value: "approved", label: "Approved" },
  { value: "printing", label: "Printing" },
  { value: "shipping", label: "Shipping" },
  { value: "installing", label: "Installing" },
  { value: "completed", label: "Completed" },
];

const STATUS_FLOW = ["design", "revision", "approved", "printing", "shipping", "installing", "completed"];

export default function ProjectsPage() {
  const supabase = createClient();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadProjects() {
    let query = supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter);
    const { data } = await query;
    setProjects((data as Project[]) ?? []);
  }

  useEffect(() => {
    loadProjects().then(() => setLoading(false));
  }, [filter]);

  async function saveProject() {
    if (!editing?.title || !editing?.customer_name) return;
    setSaving(true);
    if (editing.id) {
      await supabase.from("projects").update(editing).eq("id", editing.id);
    } else {
      await supabase.from("projects").insert(editing);
    }
    setSaving(false);
    setEditing(null);
    loadProjects();
  }

  async function deleteProject(id: string) {
    if (!confirm("Delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
    loadProjects();
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from("projects").update({ status }).eq("id", id);
    loadProjects();
  }

  function progressPercent(status: string) {
    const idx = STATUS_FLOW.indexOf(status);
    return idx < 0 ? 0 : Math.round(((idx + 1) / STATUS_FLOW.length) * 100);
  }

  const activeCount = projects.filter((p) => p.status !== "completed").length;

  return (
    <div>
      <PageHeader title="Project Tracking" description={`${projects.length} total · ${activeCount} active`}>
        <Button onClick={() => setEditing({
          title: "", customer_name: "", vehicle_info: "", wrap_type: "",
          status: "design", progress: 0, notes: "",
        })}>
          <Plus size={16} /> New Project
        </Button>
      </PageHeader>

      <div className="mb-6 flex gap-3">
        <Select value={filter} onChange={(e) => setFilter(e.target.value)} options={STATUS_OPTIONS} className="max-w-[180px]" />
      </div>

      {/* Kanban-style cards */}
      {loading ? (
        <Card>
          <div className="flex items-center justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-[#ff1a6c]" />
          </div>
        </Card>
      ) : projects.length === 0 ? (
        <Card><EmptyState icon={FolderKanban} title="No projects" description="Create your first project to start tracking builds." /></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((proj) => {
            const pct = progressPercent(proj.status);
            return (
              <div key={proj.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 transition-colors hover:border-white/10">
                {/* Header */}
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white">{proj.title}</h3>
                    <p className="text-xs text-gray-400">{proj.customer_name}</p>
                  </div>
                  <Badge variant={projectStatusColor(proj.status)}>{proj.status}</Badge>
                </div>

                {/* Vehicle info */}
                {proj.vehicle_info && (
                  <p className="mb-2 text-sm text-gray-300">🚗 {proj.vehicle_info}</p>
                )}
                {proj.wrap_type && (
                  <p className="mb-3 text-sm text-gray-400">{proj.wrap_type}</p>
                )}

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="mb-1 flex items-center justify-between text-xs text-gray-400">
                    <span>Progress</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        background: pct === 100 ? "#22c55e" : "linear-gradient(90deg, #ff1a6c, #a855f7)",
                      }}
                    />
                  </div>
                </div>

                {/* Status steps */}
                <div className="mb-4 flex gap-1">
                  {STATUS_FLOW.map((s, i) => (
                    <button
                      key={s}
                      title={s}
                      onClick={() => updateStatus(proj.id, s)}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        STATUS_FLOW.indexOf(proj.status) >= i
                          ? "bg-[#ff1a6c]"
                          : "bg-white/[0.06] hover:bg-white/10"
                      }`}
                    />
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button onClick={() => setEditing(proj)} className="flex-1 rounded-lg bg-white/[0.05] px-3 py-2 text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                    <Pencil size={12} className="mr-1 inline" /> Edit
                  </button>
                  <button onClick={() => deleteProject(proj.id)} className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>

                {/* Date */}
                <p className="mt-3 text-xs text-gray-500">
                  Created {new Date(proj.created_at).toLocaleDateString()}
                  {proj.estimated_completion && ` · Due ${new Date(proj.estimated_completion).toLocaleDateString()}`}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Create modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0a0a0f] p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-black text-white">{editing.id ? "Edit Project" : "New Project"}</h2>
              <button onClick={() => setEditing(null)} className="rounded-lg p-2 text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <Input label="Project Title" value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="Zero Two Mustang Full Wrap" />
              <Input label="Customer Name" value={editing.customer_name ?? ""} onChange={(e) => setEditing({ ...editing, customer_name: e.target.value })} placeholder="John Doe" />
              <Input label="Vehicle Info" value={editing.vehicle_info ?? ""} onChange={(e) => setEditing({ ...editing, vehicle_info: e.target.value })} placeholder="2024 Ford Mustang GT" />
              <Input label="Wrap Type" value={editing.wrap_type ?? ""} onChange={(e) => setEditing({ ...editing, wrap_type: e.target.value })} placeholder="Full Wrap - Itasha" />
              <Select label="Status" value={editing.status ?? "design"} onChange={(e) => setEditing({ ...editing, status: e.target.value as Project["status"] })} options={STATUS_FLOW.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))} />
              <Input label="Estimated Completion" type="date" value={editing.estimated_completion ?? ""} onChange={(e) => setEditing({ ...editing, estimated_completion: e.target.value })} />
              <Input label="Cover Image URL" value={editing.cover_image ?? ""} onChange={(e) => setEditing({ ...editing, cover_image: e.target.value })} placeholder="https://…" />
              <Textarea label="Notes" value={editing.notes ?? ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} rows={3} placeholder="Build notes…" />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={saveProject} loading={saving}>{editing.id ? "Update" : "Create Project"}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
