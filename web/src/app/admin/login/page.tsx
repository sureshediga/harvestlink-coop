"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    fetch("/api/admin/setup", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setNeedsSetup(Boolean(d.needsSetup)))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Unable to sign in.");
      }
      window.location.href = "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <div className="rounded-2xl border border-gold/20 bg-white p-8 shadow-sm">
        <h1 className="font-serif text-2xl font-semibold text-soil">
          Admin sign in
        </h1>
        <p className="mt-2 text-sm text-soil/70">
          Sign in with your admin account to manage signups.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="username"
            className="w-full rounded-lg border border-gold/40 px-4 py-3 text-soil focus:border-green focus:outline-none focus:ring-1 focus:ring-green"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            className="w-full rounded-lg border border-gold/40 px-4 py-3 text-soil focus:border-green focus:outline-none focus:ring-1 focus:ring-green"
            required
          />
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-saffron py-3 font-semibold text-white transition hover:bg-saffron/90 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {needsSetup && (
          <p className="mt-6 rounded-lg bg-gold/10 px-4 py-3 text-center text-sm text-soil/70">
            No admin accounts yet.{" "}
            <Link href="/admin/setup" className="font-semibold text-green hover:underline">
              Create the first admin →
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
