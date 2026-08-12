"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { PublicAdmin } from "@/lib/admins";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "UTC",
    });
  } catch {
    return iso;
  }
}

export function AdminTeam() {
  const [admins, setAdmins] = useState<PublicAdmin[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/admin/admins", { cache: "no-store" });
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      if (!res.ok) throw new Error(`Request failed (${res.status}).`);
      const data = await res.json();
      setAdmins(data.admins ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load admins");
    }
  }, []);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    void load();
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [load]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Unable to add admin");
      setNotice(`Added ${body.admin?.email ?? email}.`);
      setEmail("");
      setPassword("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add admin");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold text-soil">Admins</h1>
        <Link
          href="/admin"
          className="text-sm font-semibold text-green hover:underline"
        >
          ← Back to signups
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-gold/20 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gold/20 bg-cream/60 text-xs uppercase tracking-wide text-soil/60">
            <tr>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Created</th>
              <th className="px-4 py-3 font-semibold">Last login</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {admins.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-soil/50">
                  Loading…
                </td>
              </tr>
            ) : (
              admins.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-3 font-semibold text-soil">{a.email}</td>
                  <td className="px-4 py-3 text-soil/70">
                    {formatDate(a.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-soil/70">
                    {formatDate(a.lastLoginAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 rounded-2xl border border-gold/20 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-lg font-semibold text-soil">
          Add an admin
        </h2>
        <form onSubmit={handleAdd} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="off"
            className="flex-1 rounded-lg border border-gold/40 px-4 py-2.5 text-soil focus:border-green focus:outline-none focus:ring-1 focus:ring-green"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Temp password (min 8)"
            autoComplete="new-password"
            minLength={8}
            className="flex-1 rounded-lg border border-gold/40 px-4 py-2.5 text-soil focus:border-green focus:outline-none focus:ring-1 focus:ring-green"
            required
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-saffron px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-saffron/90 disabled:opacity-60"
          >
            {saving ? "Adding…" : "Add admin"}
          </button>
        </form>
        {notice && <p className="mt-3 text-sm text-green">{notice}</p>}
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
