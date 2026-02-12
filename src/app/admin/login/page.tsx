"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050508] p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Image
            src="/New Xpressskins Logo cut only2 Large.png"
            alt="Xpress Skins"
            width={180}
            height={54}
            className="mx-auto mb-4 h-12 w-auto"
          />
          <h1 className="text-2xl font-black text-white">Admin Panel</h1>
          <p className="mt-1 text-sm text-gray-400">
            Sign in to manage your store
          </p>
        </div>

        {/* Login form */}
        <form
          onSubmit={handleLogin}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm"
        >
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#ff1a6c]/50 focus:ring-1 focus:ring-[#ff1a6c]/30"
              placeholder="info@xpressskins.com"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#ff1a6c]/50 focus:ring-1 focus:ring-[#ff1a6c]/30"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#ff1a6c] px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#ff1a6c]/90 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          Xpress Skins Inc. — Admin Access Only
        </p>
      </div>
    </div>
  );
}
