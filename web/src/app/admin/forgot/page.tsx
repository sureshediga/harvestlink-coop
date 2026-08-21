"use client";

import Link from "next/link";
import { useState } from "react";

const inputClass =
  "w-full rounded-lg border border-gold/40 px-4 py-3 text-soil focus:border-green focus:outline-none focus:ring-1 focus:ring-green";

export default function AdminForgotPage() {
  const [email, setEmail] = useState("");
  const [setupKey, setSetupKey] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingKey, setLoadingKey] = useState(false);

  async function sendResetLink(e: React.FormEvent) {
    e.preventDefault();
    setLoadingEmail(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Unable to send reset email.");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send reset email");
    } finally {
      setLoadingEmail(false);
    }
  }

  async function resetWithSetupKey(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    setLoadingKey(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, setupKey, password }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Unable to reset password.");
      window.location.href = "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reset password");
      setLoadingKey(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <div className="rounded-2xl border border-gold/20 bg-white p-8 shadow-sm">
        <h1 className="font-serif text-2xl font-semibold text-soil">
          Reset admin password
        </h1>
        <p className="mt-2 text-sm text-soil/70">
          Send a reset link to your admin email, or set a new password with your{" "}
          <code className="text-xs">ADMIN_EXPORT_KEY</code> (the setup key in
          Netlify).
        </p>

        <form onSubmit={sendResetLink} className="mt-6 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin email"
            autoComplete="username"
            className={inputClass}
            required
          />
          {sent && (
            <p className="rounded-lg bg-green/10 px-4 py-3 text-sm text-green">
              If that email is an admin account, a reset link is on its way.
              Check spam, and use the setup-key option below if mail does not
              arrive.
            </p>
          )}
          <button
            type="submit"
            disabled={loadingEmail}
            className="w-full rounded-full bg-saffron py-3 font-semibold text-white transition hover:bg-saffron/90 disabled:opacity-60"
          >
            {loadingEmail ? "Sending…" : "Email reset link"}
          </button>
        </form>

        <div className="my-8 border-t border-gold/20 pt-6">
          <h2 className="font-serif text-lg font-semibold text-soil">
            Or reset with setup key
          </h2>
          <p className="mt-1 text-sm text-soil/60">
            Use the same key you used to create the first admin.
          </p>
          <form onSubmit={resetWithSetupKey} className="mt-4 space-y-4">
            <input
              type="password"
              value={setupKey}
              onChange={(e) => setSetupKey(e.target.value)}
              placeholder="Setup key (ADMIN_EXPORT_KEY)"
              className={inputClass}
              required
            />
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
              disabled={loadingKey}
              className="w-full rounded-full border border-green/30 bg-white py-3 font-semibold text-green transition hover:bg-green/5 disabled:opacity-60"
            >
              {loadingKey ? "Saving…" : "Set new password & sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-soil/60">
          <Link href="/admin/login" className="font-semibold text-green hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
