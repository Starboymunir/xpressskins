"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  Package,
  Image as ImageIcon,
  Video,
  MessageSquare,
  Users,
  FolderKanban,
  TrendingUp,
  ArrowRight,
  Clock,
} from "lucide-react";

interface Stats {
  products: number;
  images: number;
  videos: number;
  quotes: number;
  newQuotes: number;
  customers: number;
  projects: number;
  activeProjects: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    products: 0, images: 0, videos: 0, quotes: 0,
    newQuotes: 0, customers: 0, projects: 0, activeProjects: 0,
  });
  const [recentQuotes, setRecentQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const [products, images, videos, quotes, newQuotes, customers, projects, activeProjects, recent] =
        await Promise.all([
          supabase.from("products").select("id", { count: "exact", head: true }),
          supabase.from("portfolio_images").select("id", { count: "exact", head: true }),
          supabase.from("portfolio_videos").select("id", { count: "exact", head: true }),
          supabase.from("quotes").select("id", { count: "exact", head: true }),
          supabase.from("quotes").select("id", { count: "exact", head: true }).eq("status", "new"),
          supabase.from("customers").select("id", { count: "exact", head: true }),
          supabase.from("projects").select("id", { count: "exact", head: true }),
          supabase.from("projects").select("id", { count: "exact", head: true }).neq("status", "completed"),
          supabase.from("quotes").select("*").order("created_at", { ascending: false }).limit(5),
        ]);

      setStats({
        products: products.count ?? 0,
        images: images.count ?? 0,
        videos: videos.count ?? 0,
        quotes: quotes.count ?? 0,
        newQuotes: newQuotes.count ?? 0,
        customers: customers.count ?? 0,
        projects: projects.count ?? 0,
        activeProjects: activeProjects.count ?? 0,
      });
      setRecentQuotes(recent.data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const statCards = [
    { label: "Products", value: stats.products, icon: Package, href: "/admin/products", color: "text-[#ff1a6c]", bg: "bg-[#ff1a6c]/10" },
    { label: "Portfolio Images", value: stats.images, icon: ImageIcon, href: "/admin/portfolio", color: "text-[#a855f7]", bg: "bg-[#a855f7]/10" },
    { label: "Videos", value: stats.videos, icon: Video, href: "/admin/portfolio", color: "text-[#06b6d4]", bg: "bg-[#06b6d4]/10" },
    { label: "Quotes", value: stats.quotes, icon: MessageSquare, href: "/admin/quotes", color: "text-amber-400", bg: "bg-amber-400/10", badge: stats.newQuotes > 0 ? `${stats.newQuotes} new` : undefined },
    { label: "Customers", value: stats.customers, icon: Users, href: "/admin/customers", color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Active Projects", value: stats.activeProjects, icon: FolderKanban, href: "/admin/projects", color: "text-blue-400", bg: "bg-blue-400/10" },
  ];

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      new: "bg-green-500/10 text-green-400 border-green-500/20",
      contacted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      quoted: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      in_progress: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      completed: "bg-gray-500/10 text-gray-400 border-gray-500/20",
      cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return colors[status] ?? "bg-gray-500/10 text-gray-400 border-gray-500/20";
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">
          Welcome back — here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      {/* Stat cards */}
      <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:border-white/10 hover:bg-white/[0.04]"
          >
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${card.bg}`}>
              <card.icon size={18} className={card.color} />
            </div>
            <div className="text-2xl font-black text-white">
              {loading ? "—" : card.value}
            </div>
            <div className="text-xs text-gray-400">{card.label}</div>
            {card.badge && (
              <span className="absolute right-3 top-3 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-bold text-green-400 border border-green-500/20">
                {card.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Recent quotes */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/10">
              <MessageSquare size={16} className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Recent Quotes</h2>
              <p className="text-xs text-gray-500">Latest customer requests</p>
            </div>
          </div>
          <Link
            href="/admin/quotes"
            className="flex items-center gap-1 text-xs font-semibold text-[#ff1a6c] transition-colors hover:text-[#ff1a6c]/80"
          >
            View All <ArrowRight size={12} />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-[#ff1a6c]" />
          </div>
        ) : recentQuotes.length === 0 ? (
          <div className="py-12 text-center">
            <MessageSquare size={32} className="mx-auto mb-3 text-gray-600" />
            <p className="text-sm text-gray-400">No quotes yet</p>
            <p className="mt-1 text-xs text-gray-500">
              Quotes will appear here when customers submit requests.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {recentQuotes.map((q) => (
              <Link
                key={q.id}
                href={`/admin/quotes`}
                className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-sm font-bold text-white">
                  {q.customer_name?.charAt(0)?.toUpperCase() ?? "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white truncate">
                      {q.customer_name}
                    </span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${statusBadge(q.status)}`}>
                      {q.status?.replace("_", " ")}
                    </span>
                  </div>
                  <p className="truncate text-xs text-gray-400">
                    {q.vehicle_year} {q.vehicle_make} {q.vehicle_model} — {q.wrap_type}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock size={12} />
                  {new Date(q.created_at).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Add Product", href: "/admin/products", icon: Package, desc: "Create a new wrap product" },
          { label: "Upload Media", href: "/admin/portfolio", icon: ImageIcon, desc: "Add portfolio images or videos" },
          { label: "Edit Content", href: "/admin/content", icon: TrendingUp, desc: "Update homepage text & CTAs" },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:border-[#ff1a6c]/20 hover:bg-white/[0.04]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ff1a6c]/10">
              <action.icon size={18} className="text-[#ff1a6c]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-[#ff1a6c]">
                {action.label}
              </h3>
              <p className="text-xs text-gray-500">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
