"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { PendingApplication } from "@/lib/applications";

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

export function AdminDashboard({ email }: { email: string }) {
  const [apps, setApps] = useState<PendingApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [kindFilter, setKindFilter] = useState<KindFilter>("membership");
  const [confirming, setConfirming] = useState<string | null>(null);

  const load = useCallback(async (status: StatusFilter, kind: KindFilter) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ format: "json" });
      if (status !== "all") params.set("status", status);
      if (kind !== "all") params.set("kind", kind);
      const res = await fetch(`/api/admin/applications?${params.toString()}`, {
        cache: "no-store",
      });
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
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
  }, []);

  useEffect(() => {
    // Initial load; filter changes are driven by the handlers below.
    /* eslint-disable react-hooks/set-state-in-effect */
    void load(statusFilter, kindFilter);
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleStatusChange(next: StatusFilter) {
    setStatusFilter(next);
    void load(next, kindFilter);
  }

  function handleKindChange(next: KindFilter) {
    setKindFilter(next);
    void load(statusFilter, next);
  }

  async function handleSignOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referenceNumber }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Confirm failed (${res.status}).`);
      }
      await load(statusFilter, kindFilter);
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
      const res = await fetch(`/api/admin/applications?${params.toString()}`, {
        cache: "no-store",
      });
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

  const total = apps.length;
  const pending = apps.filter((a) => a.status === "pending_payment").length;
  const confirmed = apps.filter((a) => a.status === "confirmed").length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-soil">
            Membership Signups
          </h1>
          <p className="mt-1 text-sm text-soil/60">
            Signed in as <span className="font-semibold">{email}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/admins"
            className="rounded-full border border-gold/40 bg-white px-5 py-2.5 text-sm font-semibold text-soil transition hover:bg-cream"
          >
            Manage admins
          </Link>
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
            <option value="membership">Membership</option>
            <option value="investment">Investment</option>
            <option value="all">All</option>
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
        <button
          type="button"
          onClick={() => load(statusFilter, kindFilter)}
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
            ) : apps.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-soil/50">
                  No signups match the current filters.
                </td>
              </tr>
            ) : (
              apps.map((a) => (
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
