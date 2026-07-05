"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { StepIndicator } from "./StepIndicator";
import { INVESTMENT_TERMS, INVESTOR } from "@/lib/constants";
import { memberInfoSchema, type MemberInfo } from "@/lib/schemas";

const STEPS = ["Why Invest", "Your Info", "Review & Pay"];

export function InvestForm() {
  const [step, setStep] = useState(1);
  const [investmentUnits, setInvestmentUnits] = useState(1);
  const [customUnits, setCustomUnits] = useState("1");
  const [memberNumber, setMemberNumber] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<"manual" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<MemberInfo>({
    resolver: zodResolver(memberInfoSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      zip: "",
    },
  });

  const totalCents = investmentUnits * INVESTOR.unitAmount * 100;

  function applyPreset(units: number) {
    setInvestmentUnits(units);
    setCustomUnits(String(units));
    setError(null);
  }

  function applyCustom() {
    const units = parseInt(customUnits, 10);
    if (Number.isNaN(units) || units < 1) {
      setError("Minimum investment is 1 unit ($100).");
      return;
    }
    setInvestmentUnits(units);
    setError(null);
  }

  async function submitManual() {
    if (!agreedToTerms) {
      setError("Please agree to the investment terms to continue.");
      return;
    }
    setLoading(true);
    setLoadingProvider("manual");
    setError(null);
    try {
      const response = await fetch("/api/invest/applications/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form.getValues(),
          investmentUnits,
          memberNumber: memberNumber || undefined,
          agreedToTerms: true,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to submit");
      window.location.href = `/invest/instructions?ref=${encodeURIComponent(data.referenceNumber)}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
      setLoadingProvider(null);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <StepIndicator currentStep={step} steps={STEPS} />

      {step === 1 && (
        <div className="rounded-2xl border border-gold/20 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="font-serif text-3xl font-semibold text-soil">
            Invest in HarvestLink
          </h1>
          <p className="mt-3 text-soil/75">{INVESTOR.summary}</p>

          <div className="mt-6 rounded-xl border border-terracotta/30 bg-cream/50 p-4">
            <p className="text-sm text-soil/70">
              {INVESTOR.note}{" "}
              <Link href="/join" className="font-semibold text-green hover:underline">
                Join as a member first →
              </Link>
            </p>
          </div>

          <ul className="mt-6 space-y-2 text-sm text-soil/75">
            {INVESTOR.benefits.map((item) => (
              <li key={item}>✓ {item}</li>
            ))}
          </ul>

          <div className="mt-8">
            <p className="font-semibold text-soil">Choose investment amount</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[1, 2, 5, 10].map((units) => (
                <button
                  key={units}
                  type="button"
                  onClick={() => applyPreset(units)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    investmentUnits === units
                      ? "bg-green text-cream"
                      : "bg-white text-soil ring-1 ring-gold/30"
                  }`}
                >
                  ${units * INVESTOR.unitAmount}
                </button>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                value={customUnits}
                onChange={(e) => setCustomUnits(e.target.value)}
                placeholder="Custom units (× $100)"
                className={inputClass}
              />
              <button
                type="button"
                onClick={applyCustom}
                className="shrink-0 rounded-full bg-green px-4 py-2 text-sm font-semibold text-cream"
              >
                Apply
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            className="mt-8 w-full rounded-full bg-saffron py-3.5 font-semibold text-white hover:bg-saffron/90"
          >
            Continue — ${investmentUnits * INVESTOR.unitAmount} investment
          </button>
        </div>
      )}

      {step === 2 && (
        <form
          onSubmit={form.handleSubmit(() => setStep(3))}
          className="rounded-2xl border border-gold/20 bg-white p-6 shadow-sm sm:p-8"
        >
          <h2 className="font-serif text-2xl font-semibold text-soil">
            Investor Information
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" error={form.formState.errors.fullName?.message} className="sm:col-span-2">
              <input {...form.register("fullName")} className={inputClass} />
            </Field>
            <Field label="Email" error={form.formState.errors.email?.message}>
              <input {...form.register("email")} type="email" className={inputClass} />
            </Field>
            <Field label="Phone" error={form.formState.errors.phone?.message}>
              <input {...form.register("phone")} type="tel" className={inputClass} />
            </Field>
            <Field label="Member number (if already a member)" className="sm:col-span-2">
              <input
                value={memberNumber}
                onChange={(e) => setMemberNumber(e.target.value)}
                placeholder="e.g. HL-2026-0001"
                className={inputClass}
              />
            </Field>
            <Field label="Street address" error={form.formState.errors.street?.message} className="sm:col-span-2">
              <input {...form.register("street")} className={inputClass} />
            </Field>
            <Field label="City" error={form.formState.errors.city?.message}>
              <input {...form.register("city")} className={inputClass} />
            </Field>
            <Field label="State" error={form.formState.errors.state?.message}>
              <input {...form.register("state")} className={inputClass} />
            </Field>
            <Field label="ZIP code" error={form.formState.errors.zip?.message}>
              <input {...form.register("zip")} className={inputClass} />
            </Field>
          </div>

          <div className="mt-8 flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="rounded-full border border-gold/30 px-6 py-3 text-sm font-semibold text-soil">
              Back
            </button>
            <button type="submit" className="flex-1 rounded-full bg-saffron py-3 font-semibold text-white hover:bg-saffron/90">
              Continue to Review
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="rounded-2xl border border-gold/20 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-serif text-2xl font-semibold text-soil">
            Investment Review & Pay
          </h2>

          <dl className="mt-6 space-y-3 border-b border-gold/20 pb-6">
            <div className="flex justify-between text-soil">
              <dt>Cooperative investment ({investmentUnits} × ${INVESTOR.unitAmount})</dt>
              <dd>${(totalCents / 100).toFixed(2)}</dd>
            </div>
            <div className="text-sm text-soil/60">
              Voting rights for USD 1,000+ invested members — one member, one vote. Dividends proportional to investment.
            </div>
            <div className="flex justify-between border-t border-gold/20 pt-3 text-lg font-semibold text-soil">
              <dt>Due today</dt>
              <dd>${(totalCents / 100).toFixed(2)}</dd>
            </div>
          </dl>

          <label className="mt-6 flex items-start gap-3">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gold/40 text-green focus:ring-green"
            />
            <span className="text-sm leading-relaxed text-soil/75">
              {INVESTMENT_TERMS}
            </span>
          </label>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          <div className="mt-6">
            <p className="text-sm font-semibold text-green">Pay with Zelle</p>
            <p className="mt-1 text-xs text-soil/50">
              Submit your application to receive payment instructions and a
              reference number.
            </p>
            <button
              type="button"
              disabled={loading}
              onClick={submitManual}
              className="mt-4 w-full rounded-full bg-saffron py-3.5 font-semibold text-white transition hover:bg-saffron/90 disabled:opacity-60"
            >
              {loadingProvider === "manual"
                ? "Submitting..."
                : `Submit investment — pay $${(totalCents / 100).toFixed(0)} via Zelle`}
            </button>
          </div>

          <button type="button" onClick={() => setStep(2)} className="mt-6 text-sm font-medium text-soil/60 hover:text-soil">
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-gold/25 bg-white px-4 py-3 text-soil outline-none ring-green focus:ring-2";

function Field({
  label,
  error,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-soil">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
