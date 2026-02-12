"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import type { Order, Project, Revision } from "@/lib/types";
import { AnimatedSection } from "@/components/AnimatedSection";
import {
  Package,
  CreditCard,
  Paintbrush,
  Clock,
  ChevronRight,
  LogOut,
  Plus,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Truck,
  Wrench,
  User,
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  pending: "text-yellow-400 bg-yellow-400/10",
  confirmed: "text-blue-400 bg-blue-400/10",
  deposit_paid: "text-green-400 bg-green-400/10",
  in_production: "text-purple-400 bg-purple-400/10",
  shipped: "text-cyan-400 bg-cyan-400/10",
  installing: "text-orange-400 bg-orange-400/10",
  completed: "text-green-400 bg-green-400/10",
  cancelled: "text-red-400 bg-red-400/10",
  design: "text-purple-400 bg-purple-400/10",
  revision: "text-yellow-400 bg-yellow-400/10",
  approved: "text-green-400 bg-green-400/10",
  printing: "text-cyan-400 bg-cyan-400/10",
  shipping: "text-blue-400 bg-blue-400/10",
  paid: "text-green-400 bg-green-400/10",
  partially_paid: "text-yellow-400 bg-yellow-400/10",
};

const STATUS_ICONS: Record<string, typeof Package> = {
  pending: Clock,
  confirmed: CheckCircle,
  deposit_paid: CreditCard,
  in_production: Paintbrush,
  shipped: Truck,
  installing: Wrench,
  completed: CheckCircle,
  design: Paintbrush,
  revision: MessageSquare,
  approved: CheckCircle,
  printing: Package,
};

type TabKey = "orders" | "projects" | "revisions";

interface Props {
  user: { email: string; name: string };
  orders: Order[];
  projects: Project[];
  revisions: Revision[];
}

export function PortalDashboard({ user, orders, projects, revisions }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("orders");
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const tabs: { key: TabKey; label: string; count: number; icon: typeof Package }[] = [
    { key: "orders", label: "Orders", count: orders.length, icon: CreditCard },
    { key: "projects", label: "Projects", count: projects.length, icon: Paintbrush },
    { key: "revisions", label: "Revisions", count: revisions.length, icon: MessageSquare },
  ];

  return (
    <>
      {/* Header */}
      <section className="relative pt-28 pb-6">
        <div className="absolute inset-0 bg-background" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <User size={20} />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white">
                    {user.name || "My Portal"}
                  </h1>
                  <p className="text-muted text-sm">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-muted-light border border-white/10 rounded-xl hover:bg-white/5 hover:text-white transition-colors"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats */}
      <section className="relative pb-4">
        <div className="absolute inset-0 bg-background" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Orders", value: orders.length, color: "text-accent" },
              { label: "Active Projects", value: projects.filter((p) => p.status !== "completed").length, color: "text-accent2" },
              { label: "Pending Revisions", value: revisions.filter((r) => r.status === "pending").length, color: "text-yellow-400" },
              {
                label: "Total Spent",
                value: `$${orders.reduce((s, o) => s + o.amount_paid, 0).toLocaleString()}`,
                color: "text-green-400",
              },
            ].map((s) => (
              <div key={s.label} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <p className="text-muted text-xs mb-1">{s.label}</p>
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs + Content */}
      <section className="relative pb-32">
        <div className="absolute inset-0 bg-background" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 mt-6">
          {/* Tab bar */}
          <div className="flex gap-2 mb-6">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  tab === t.key
                    ? "bg-accent/10 text-accent border border-accent/20"
                    : "text-muted-light border border-white/5 hover:text-white hover:border-white/10"
                }`}
              >
                <t.icon size={14} />
                {t.label}
                {t.count > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-white/5 text-xs">{t.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* Orders */}
          {tab === "orders" && (
            <div className="space-y-3">
              {orders.length === 0 ? (
                <EmptyState
                  title="No orders yet"
                  desc="Browse our shop and place your first order."
                  cta={{ label: "Browse Wraps", href: "/collections" }}
                />
              ) : (
                orders.map((order) => {
                  const Icon = STATUS_ICONS[order.status] ?? Package;
                  return (
                    <div
                      key={order.id}
                      className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-xl ${STATUS_COLORS[order.status] || "text-muted bg-white/5"}`}>
                            <Icon size={18} />
                          </div>
                          <div>
                            <p className="text-white font-bold text-sm">{order.order_number}</p>
                            <p className="text-muted text-xs mt-0.5">
                              {order.wrap_type} — {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-white font-bold text-sm">
                              ${order.total_price.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted">
                              Paid: ${order.amount_paid.toLocaleString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[order.status] || "text-muted"}`}>
                            {order.status.replace(/_/g, " ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Projects */}
          {tab === "projects" && (
            <div className="space-y-3">
              {projects.length === 0 ? (
                <EmptyState
                  title="No active projects"
                  desc="Your wrap projects will appear here once production starts."
                />
              ) : (
                projects.map((project) => {
                  const Icon = STATUS_ICONS[project.status] ?? Paintbrush;
                  const stages = ["design", "revision", "approved", "printing", "shipping", "installing", "completed"];
                  const stageIdx = stages.indexOf(project.status);
                  const progress = ((stageIdx + 1) / stages.length) * 100;

                  return (
                    <div
                      key={project.id}
                      className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-3">
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-xl ${STATUS_COLORS[project.status] || "text-muted bg-white/5"}`}>
                            <Icon size={18} />
                          </div>
                          <div>
                            <p className="text-white font-bold text-sm">{project.title}</p>
                            <p className="text-muted text-xs mt-0.5">
                              {project.vehicle_info} — {project.wrap_type}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[project.status] || "text-muted"}`}>
                          {project.status}
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-accent to-accent2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-2">
                        <p className="text-muted text-xs">
                          Started {new Date(project.start_date).toLocaleDateString()}
                        </p>
                        <p className="text-muted text-xs">
                          {project.estimated_completion
                            ? `Est. ${new Date(project.estimated_completion).toLocaleDateString()}`
                            : "TBD"}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Revisions */}
          {tab === "revisions" && (
            <div className="space-y-3">
              <Link
                href="/portal/revisions/new"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-accent to-accent2 rounded-xl hover:shadow-[0_0_20px_#ff2d7b44] hover:scale-[1.02] transition-all mb-2"
              >
                <Plus size={14} /> Request Revision
              </Link>

              {revisions.length === 0 ? (
                <EmptyState
                  title="No revisions"
                  desc="Need changes to your design? Submit a revision request."
                />
              ) : (
                revisions.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-xl ${STATUS_COLORS[rev.status] || "text-muted bg-white/5"}`}>
                          <MessageSquare size={18} />
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">Revision #{rev.revision_number}</p>
                          <p className="text-muted-light text-xs mt-0.5 line-clamp-2">{rev.description}</p>
                          {rev.admin_response && (
                            <p className="text-accent3 text-xs mt-1">
                              Response: {rev.admin_response}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${STATUS_COLORS[rev.status] || "text-muted"}`}>
                        {rev.status.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function EmptyState({ title, desc, cta }: { title: string; desc: string; cta?: { label: string; href: string } }) {
  return (
    <div className="text-center py-16">
      <AlertCircle size={32} className="mx-auto text-muted mb-3" />
      <p className="text-white font-bold">{title}</p>
      <p className="text-muted text-sm mt-1">{desc}</p>
      {cta && (
        <Link
          href={cta.href}
          className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-accent to-accent2 rounded-full hover:scale-105 transition-all"
        >
          {cta.label} <ChevronRight size={14} />
        </Link>
      )}
    </div>
  );
}
