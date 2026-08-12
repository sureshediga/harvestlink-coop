"use client";

import { useCallback, useEffect, useState } from "react";
import type { PendingApplication } from "@/lib/applications";

const KEY_STORAGE = "hl-admin-key";

type StatusFilter = "all" | "pending_payment" | "confirmed";
type KindFilter = "all" | "membership" | "investment";

function formatDate(iso: string): string {
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

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState<string>("");
  const [keyInput, setKeyInput] = useState<string>("");
  const [authed, setAuthed] = useState(false);
  const [apps, setApps] = useState<PendingApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [kindFilter, setKindFilter] = useState<KindFilter>("all");
  const [query, setQuery] = useState("");
  const [confirming, setConfirming] = useState<string | null>(null);

  const load = useCallback(
    async (key: string, status: StatusFilter, kind: KindFilter) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ format: "json" });
        if (status !== "all") params.set("status", status);
        if (kind !== "all") params.set("kind", kind);
        const res = await fetch(`/api/admin/applications?${params.toString()}`, {
          headers: { Authorization: `Bearer ${key}` },
          cache: "no-store",
        });
        if (res.status === 401) {
          sessionStorage.removeItem(KEY_STORAGE);
          setAuthed(false);
          setAdminKey("");
          throw new Error("Invalid admin key.");
        }
        if (!res.ok) throw new Error(`Request failed (${res.status}).`);
        const data = await res.json();
        setApps(data.applications ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setApps([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Bootstrap from a previously-entered key (session only). The fetch is
  // triggered here and from each handler, so no filter-driven effect is needed.
  useEffect(() => {
    const stored = sessionStorage.getItem(KEY_STORAGE);
    if (stored) {
      // Reading sessionStorage must happen after mount (SSR-safe); this is the
      // canonical bootstrap pattern the rule over-flags.
      /* eslint-disable react-hooks/set-state-in-effect */
      setAdminKey(stored);
      setAuthed(true);
      void load(stored, statusFilter, kindFilter);
      /* eslint-enable react-hooks/set-state-in-effect */
    }
    // Run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    const key = keyInput.trim();
    if (!key) return;
    sessionStorage.setItem(KEY_STORAGE, key);
    setAdminKey(key);
    setAuthed(true);
    setKeyInput("");
    void load(key, statusFilter, kindFilter);
  }

  function handleStatusChange(next: StatusFilter) {
    setStatusFilter(next);
    void load(adminKey, next, kindFilter);
  }

  function handleKindChange(next: KindFilter) {
    setKindFilter(next);
    void load(adminKey, statusFilter, next);
  }

  function handleSignOut() {
    sessionStorage.removeItem(KEY_STORAGE);
    setAdminKey("");
    setAuthed(false);
    setApps([]);
  }

  async function handleConfirm(referenceNumber: string) {
    if (!confirm(`Mark ${referenceNumber} as paid and activate membership?`)) {
      return;
    }
    setConfirming(referenceNumber);
    setError(null);
    try {
      const res = await fetch("/api/admin/applications", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ referenceNumber }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Confirm failed (${res.status}).`);
      }
      await load(adminKey, statusFilter, kindFilter);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to confirm");
    } finally {
      setConfirming(null);
    }
  }

  async function handleDownloadCsv() {
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (kindFilter !== "all") params.set("kind", kindFilter);
      const res = await fetch(
        `/api/admin/applications?${params.toString()}`,
        { headers: { Authorization: `Bearer ${adminKey}` }, cache: "no-store" }
      );
      if (!res.ok) throw new Error(`Download failed (${res.status}).`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "harvestlinx-signups.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to download");
    }
  }

  if (!authed) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
        <div className="rounded-2xl border border-gold/20 bg-white p-8 shadow-sm">
          <h1 className="font-serif text-2xl font-semibold text-soil">
            Admin sign in
          </h1>
          <p className="mt-2 text-sm text-soil/70">
            Enter the admin key to view membership signups.
          </p>
          <form onSubmit={handleSignIn} className="mt-6 space-y-4">
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Admin key"
              className="w-full rounded-lg border border-gold/40 px-4 py-3 text-soil focus:border-green focus:outline-none focus:ring-1 focus:ring-green"
              autoFocus
            />
            <button
              type="submit"
              className="w-full rounded-full bg-saffron py-3 font-semibold text-white transition hover:bg-saffron/90"
            >
              View signups
            </button>
          </form>
        </div>
      </div>
    );
  }

  const normalizedQuery = query.trim().toLowerCase();
  const visibleApps = normalizedQuery
    ? apps.filter((a) => {
        const haystack = [
          a.fullName,
          a.email,
          a.phone,
          a.referenceNumber,
          a.city,
          a.state,
          a.zip,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : apps;
  const total = visibleApps.length;
  const pending = visibleApps.filter((a) => a.status === "pending_payment").length;
  const confirmed = visibleApps.filter((a) => a.status === "confirmed").length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-soil">
            All Signups
          </h1>
          <p className="mt-1 text-sm text-soil/60">
            Membership and investment applications submitted through the site.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadCsv}
            className="rounded-full border border-green/40 bg-white px-5 py-2.5 text-sm font-semibold text-green transition hover:bg-green/5"
          >
            Download CSV
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-full px-4 py-2.5 text-sm font-medium text-soil/60 hover:text-soil"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-gold/20 bg-white p-4 text-center">
          <p className="font-serif text-3xl font-bold text-soil">{total}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-soil/50">
            Shown
          </p>
        </div>
        <div className="rounded-xl border border-gold/20 bg-white p-4 text-center">
          <p className="font-serif text-3xl font-bold text-[#b7791f]">{pending}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-soil/50">
            Pending payment
          </p>
        </div>
        <div className="rounded-xl border border-gold/20 bg-white p-4 text-center">
          <p className="font-serif text-3xl font-bold text-green">{confirmed}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-soil/50">
            Confirmed
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label className="text-sm text-soil/70">
          Type
          <select
            value={kindFilter}
            onChange={(e) => handleKindChange(e.target.value as KindFilter)}
            className="ml-2 rounded-lg border border-gold/40 px-3 py-2 text-sm text-soil"
          >
            <option value="all">All</option>
            <option value="membership">Membership</option>
            <option value="investment">Investment</option>
          </select>
        </label>
        <label className="text-sm text-soil/70">
          Status
          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value as StatusFilter)}
            className="ml-2 rounded-lg border border-gold/40 px-3 py-2 text-sm text-soil"
          >
            <option value="all">All</option>
            <option value="pending_payment">Pending payment</option>
            <option value="confirmed">Confirmed</option>
          </select>
        </label>
        <label className="min-w-[220px] flex-1 text-sm text-soil/70">
          Search
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, email, phone, or reference"
            className="ml-2 w-[calc(100%-4rem)] min-w-[180px] rounded-lg border border-gold/40 px-3 py-2 text-sm text-soil"
          />
        </label>
        <button
          type="button"
          onClick={() => load(adminKey, statusFilter, kindFilter)}
          className="rounded-lg border border-gold/40 px-3 py-2 text-sm font-medium text-soil/70 hover:bg-white"
        >
          Refresh
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-gold/20 bg-white shadow-sm">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-gold/20 bg-cream/60 text-xs uppercase tracking-wide text-soil/60">
            <tr>
              <th className="px-4 py-3 font-semibold">Submitted</th>
              <th className="px-4 py-3 font-semibold">Reference</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Contact</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Amount</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-soil/50">
                  Loading…
                </td>
              </tr>
            ) : visibleApps.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-soil/50">
                  No signups match the current filters.
                </td>
              </tr>
            ) : (
              visibleApps.map((a) => (
                <tr key={a.id} className="align-top">
                  <td className="px-4 py-3 text-soil/70">
                    {formatDate(a.createdAt)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-soil">
                    {a.referenceNumber}
                  </td>
                  <td className="px-4 py-3 font-semibold text-soil">
                    {a.fullName}
                  </td>
                  <td className="px-4 py-3 text-soil/70">
                    <div>{a.email}</div>
                    <div className="text-xs text-soil/50">{a.phone}</div>
                    <div className="text-xs text-soil/50">
                      {a.city}, {a.state} {a.zip}
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-soil/70">{a.kind}</td>
                  <td className="px-4 py-3 text-soil/70">
                    ${(a.totalAmount / 100).toFixed(2)}
                    {a.kind === "investment" && a.investmentUnits > 0 && (
                      <div className="text-xs text-soil/50">
                        {a.investmentUnits} unit(s)
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${
                        a.status === "confirmed"
                          ? "bg-green/15 text-green"
                          : "bg-gold/20 text-[#7a5a1f]"
                      }`}
                    >
                      {a.status === "confirmed" ? "Confirmed" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {a.status === "pending_payment" ? (
                      <button
                        type="button"
                        disabled={confirming === a.referenceNumber}
                        onClick={() => handleConfirm(a.referenceNumber)}
                        className="rounded-full bg-green px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green/90 disabled:opacity-60"
                      >
                        {confirming === a.referenceNumber
                          ? "Marking…"
                          : "Mark as paid"}
                      </button>
                    ) : (
                      <span className="text-xs text-soil/40">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
