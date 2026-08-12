"use client";

import { useState } from "react";

export default function AdminSetupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [setupKey, setSetupKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, setupKey }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Setup failed.");
      }
      window.location.href = "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Setup failed");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <div className="rounded-2xl border border-gold/20 bg-white p-8 shadow-sm">
        <h1 className="font-serif text-2xl font-semibold text-soil">
          Create first admin
        </h1>
        <p className="mt-2 text-sm text-soil/70">
          One-time setup. Enter the admin setup key (your{" "}
          <code className="text-xs">ADMIN_EXPORT_KEY</code>) and the email +
          password for the first admin account.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="password"
            value={setupKey}
            onChange={(e) => setSetupKey(e.target.value)}
            placeholder="Setup key (ADMIN_EXPORT_KEY)"
            className="w-full rounded-lg border border-gold/40 px-4 py-3 text-soil focus:border-green focus:outline-none focus:ring-1 focus:ring-green"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin email"
            autoComplete="username"
            className="w-full rounded-lg border border-gold/40 px-4 py-3 text-soil focus:border-green focus:outline-none focus:ring-1 focus:ring-green"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 8 characters)"
            autoComplete="new-password"
            minLength={8}
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
            {loading ? "Creating…" : "Create admin & sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
