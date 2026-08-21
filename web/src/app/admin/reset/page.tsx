"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

const inputClass =
  "w-full rounded-lg border border-gold/40 px-4 py-3 text-soil focus:border-green focus:outline-none focus:ring-1 focus:ring-green";

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("t") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Unable to reset password.");
      window.location.href = "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reset password");
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <p className="text-sm text-soil/70">
        This reset link is missing.{" "}
        <Link href="/admin/forgot" className="font-semibold text-green hover:underline">
          Request a new one
        </Link>
        .
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New password (min 8 characters)"
        autoComplete="new-password"
        minLength={8}
        className={inputClass}
        required
      />
      <input
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="Confirm new password"
        autoComplete="new-password"
        minLength={8}
        className={inputClass}
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
        {loading ? "Saving…" : "Set new password & sign in"}
      </button>
    </form>
  );
}

export default function AdminResetPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <div className="rounded-2xl border border-gold/20 bg-white p-8 shadow-sm">
        <h1 className="font-serif text-2xl font-semibold text-soil">
          Choose a new password
        </h1>
        <Suspense fallback={<p className="mt-6 text-sm text-soil/60">Loading…</p>}>
          <ResetForm />
        </Suspense>
        <p className="mt-6 text-center text-sm text-soil/60">
          <Link href="/admin/login" className="font-semibold text-green hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
