"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { AnimatedSection } from "@/components/AnimatedSection";
import { UserPlus, Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Sign up with Supabase Auth
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Also upsert into customers table via API
    try {
      await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });
    } catch {
      // Non-critical — customer row created by webhook or later
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-background" />
        <div className="relative z-10 max-w-md mx-auto px-6 text-center">
          <AnimatedSection>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-500/10 text-green-400 mb-4">
              <Mail size={24} />
            </div>
            <h1 className="text-2xl font-black text-white mb-2">Check Your Email</h1>
            <p className="text-muted-light text-sm mb-6">
              We sent a confirmation link to <strong className="text-white">{email}</strong>. Click it to activate your account.
            </p>
            <Link href="/login" className="text-accent text-sm font-semibold hover:underline">
              Go to Login →
            </Link>
          </AnimatedSection>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent2/[0.03] rounded-full blur-[120px]" />
      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent2/10 text-accent2 mb-4">
              <UserPlus size={24} />
            </div>
            <h1 className="text-3xl font-black text-white mb-2">Create Account</h1>
            <p className="text-muted-light text-sm">Join Xpress Skins to track your builds</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-muted-light mb-1.5">Full Name</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-surface-2 border border-white/5 text-sm text-white placeholder:text-muted focus:border-accent/30 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-light mb-1.5">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@email.com"
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-surface-2 border border-white/5 text-sm text-white placeholder:text-muted focus:border-accent/30 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-light mb-1.5">Phone (optional)</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(346) 555-0123"
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-surface-2 border border-white/5 text-sm text-white placeholder:text-muted focus:border-accent/30 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-light mb-1.5">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Min 6 characters"
                  className="w-full pl-9 pr-10 py-3 rounded-xl bg-surface-2 border border-white/5 text-sm text-white placeholder:text-muted focus:border-accent/30 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 text-sm font-bold text-white bg-gradient-to-r from-accent2 to-accent rounded-xl hover:shadow-[0_0_20px_#a855f744] hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {loading ? "Creating account…" : "Create Account"}
              <ArrowRight size={16} />
            </button>
          </form>

          <p className="text-center text-muted text-xs mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
