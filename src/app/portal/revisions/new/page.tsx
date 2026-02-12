"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ArrowLeft, Send, MessageSquare } from "lucide-react";

export default function NewRevisionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [projectId, setProjectId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [projects, setProjects] = useState<{ id: string; title: string }[]>([]);
  const [orders, setOrders] = useState<{ id: string; order_number: string }[]>([]);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setEmail(user.email ?? "");

      // Fetch user's projects and orders for selection
      const [projRes, ordRes] = await Promise.all([
        fetch(`/api/portal/data?type=projects&email=${encodeURIComponent(user.email ?? "")}`),
        fetch(`/api/portal/data?type=orders&email=${encodeURIComponent(user.email ?? "")}`),
      ]);
      if (projRes.ok) setProjects(await projRes.json());
      if (ordRes.ok) setOrders(await ordRes.json());
    })();
  }, [router, supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!description.trim()) {
      setError("Please describe the changes you'd like.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/revisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_email: email,
          project_id: projectId || null,
          order_id: orderId || null,
          description: description.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit revision");
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-background" />
        <div className="relative z-10 max-w-md mx-auto px-6 text-center">
          <AnimatedSection>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-500/10 text-green-400 mb-4">
              <MessageSquare size={24} />
            </div>
            <h1 className="text-2xl font-black text-white mb-2">Revision Submitted!</h1>
            <p className="text-muted-light text-sm mb-6">
              Our team will review your request and respond within 24 hours.
            </p>
            <Link href="/portal" className="text-accent text-sm font-semibold hover:underline">
              ← Back to Portal
            </Link>
          </AnimatedSection>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="relative pt-28 pb-4">
        <div className="absolute inset-0 bg-background" />
        <div className="relative z-10 max-w-xl mx-auto px-6 lg:px-8">
          <Link href="/portal" className="inline-flex items-center gap-2 text-sm text-muted-light hover:text-white transition-colors">
            <ArrowLeft size={14} /> Back to Portal
          </Link>
        </div>
      </section>

      <section className="relative pb-32">
        <div className="absolute inset-0 bg-background" />
        <div className="relative z-10 max-w-xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <h1 className="text-3xl font-black text-white mb-2">Request Revision</h1>
            <p className="text-muted-light text-sm mb-8">
              Tell us what changes you&apos;d like to your design.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {projects.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-muted-light mb-1.5">
                    Related Project (optional)
                  </label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/5 text-sm text-white focus:border-accent/30 focus:outline-none transition-colors"
                  >
                    <option value="">Select a project…</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
              )}

              {orders.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-muted-light mb-1.5">
                    Related Order (optional)
                  </label>
                  <select
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/5 text-sm text-white focus:border-accent/30 focus:outline-none transition-colors"
                  >
                    <option value="">Select an order…</option>
                    {orders.map((o) => (
                      <option key={o.id} value={o.id}>{o.order_number}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-muted-light mb-1.5">
                  Describe Your Changes *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={6}
                  placeholder="Describe the changes you'd like — character poses, color adjustments, layout tweaks, etc."
                  className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/5 text-sm text-white placeholder:text-muted focus:border-accent/30 focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-3 text-sm font-bold text-white bg-gradient-to-r from-accent to-accent2 rounded-xl hover:shadow-[0_0_20px_#ff2d7b44] hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {loading ? "Submitting…" : "Submit Revision Request"}
                <Send size={16} />
              </button>
            </form>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
