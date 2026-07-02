"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AcknowledgementModal,
  FormAcknowledgementRow,
} from "./AcknowledgementModal";
import { OtherMembershipNote } from "./OtherMembershipNote";
import { StepIndicator } from "./StepIndicator";
import { MEMBERSHIP, MEMBERSHIP_TERMS, PILLARS } from "@/lib/constants";
import {
  MEMBERSHIP_DISCLAIMERS,
  type DisclaimerId,
} from "@/lib/disclaimers";
import type { FormAcknowledgement } from "@/lib/schemas";
import { memberInfoSchema, type MemberInfo } from "@/lib/schemas";

const STEPS = ["Why Join", "Your Info", "Review & Pay"];

export function JoinForm() {
  const [step, setStep] = useState(1);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [complianceAck, setComplianceAck] = useState<FormAcknowledgement | null>(
    null
  );
  const [enrollmentAck, setEnrollmentAck] = useState<FormAcknowledgement | null>(
    null
  );
  const [openDisclaimer, setOpenDisclaimer] = useState<DisclaimerId | null>(
    null
  );
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

  const totalCents = MEMBERSHIP.joiningFee * 100;

  function handleAcknowledgement(
    disclaimerId: DisclaimerId,
    acknowledgement: FormAcknowledgement
  ) {
    if (disclaimerId === "compliance") {
      setComplianceAck(acknowledgement);
    } else {
      setEnrollmentAck(acknowledgement);
    }
    setOpenDisclaimer(null);
    setError(null);
  }

  async function submitManualApplication() {
    if (!complianceAck || !enrollmentAck) {
      setError(
        "Please read and sign both the Compliance & Acknowledgement Form and the Membership Enrollment & Disclosure Form."
      );
      return;
    }

    if (!agreedToTerms) {
      setError("Please agree to the membership terms to continue.");
      return;
    }

    setLoading(true);
    setLoadingProvider("manual");
    setError(null);

    try {
      const response = await fetch("/api/applications/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form.getValues(),
          agreedToTerms: true,
          acknowledgements: {
            compliance: complianceAck,
            enrollmentDisclosure: enrollmentAck,
          },
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to submit");
      window.location.href = `/join/instructions?ref=${encodeURIComponent(data.referenceNumber)}`;
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
            Become a Member
          </h1>
          <p className="mt-3 text-soil/75">{MEMBERSHIP.summary}</p>

          <div className="mt-8 space-y-4">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-xl border border-gold/15 bg-cream/50 p-4"
              >
                <p className="font-semibold text-soil">
                  {pillar.icon} {pillar.title}
                </p>
                <p className="mt-1 text-sm text-soil/70">{pillar.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl bg-green/10 p-4">
            <p className="font-semibold text-green">
              Joining fee — ${MEMBERSHIP.joiningFee}
            </p>
            <p className="mt-1 text-sm text-soil/70">
              Plus ${MEMBERSHIP.monthlyPurchaseCommitment}/month minimum purchase
              commitment once products launch. One member, one vote.
            </p>
          </div>

          <ul className="mt-6 space-y-2 text-sm text-soil/75">
            {MEMBERSHIP.benefits.slice(0, 4).map((item) => (
              <li key={item}>✓ {item}</li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setStep(2)}
            className="mt-8 w-full rounded-full bg-saffron py-3.5 font-semibold text-white transition hover:bg-saffron/90"
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <form
          onSubmit={form.handleSubmit(() => setStep(3))}
          className="rounded-2xl border border-gold/20 bg-white p-6 shadow-sm sm:p-8"
        >
          <h2 className="font-serif text-2xl font-semibold text-soil">
            Your Information
          </h2>
          <p className="mt-2 text-sm text-soil/70">
            Membership is one per household. We&apos;ll register your cooperative
            membership and send Texas chapter updates.
          </p>

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
            Membership Review & Pay
          </h2>

          <dl className="mt-6 space-y-3 border-b border-gold/20 pb-6">
            <div className="flex justify-between text-soil">
              <dt>Cooperative membership (joining fee)</dt>
              <dd>${MEMBERSHIP.joiningFee.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between text-sm text-soil/60">
              <dt>Ongoing commitment (once products launch)</dt>
              <dd>${MEMBERSHIP.monthlyPurchaseCommitment}/month min.</dd>
            </div>
            <div className="flex justify-between border-t border-gold/20 pt-3 text-lg font-semibold text-soil">
              <dt>Due today</dt>
              <dd>${(totalCents / 100).toFixed(2)}</dd>
            </div>
          </dl>

          <div className="mt-6 space-y-3">
            <p className="text-sm font-semibold text-soil">
              Required acknowledgements
            </p>
            <FormAcknowledgementRow
              label="I have read and signed the HarvestLinx Member Compliance & Acknowledgement Form."
              acknowledged={Boolean(complianceAck)}
              signedName={complianceAck?.signedName}
              signedDate={complianceAck?.signedDate}
              onOpen={() => setOpenDisclaimer("compliance")}
            />
            <FormAcknowledgementRow
              label="I have read and signed the HarvestLinx Membership Enrollment & Disclosure Form."
              acknowledged={Boolean(enrollmentAck)}
              signedName={enrollmentAck?.signedName}
              signedDate={enrollmentAck?.signedDate}
              onOpen={() => setOpenDisclaimer("enrollmentDisclosure")}
            />
          </div>

          <label className="mt-6 flex items-start gap-3">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gold/40 text-green focus:ring-green"
            />
            <span className="text-sm leading-relaxed text-soil/75">
              {MEMBERSHIP_TERMS}
            </span>
          </label>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
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
              onClick={submitManualApplication}
              className="mt-4 w-full rounded-full bg-saffron py-3.5 font-semibold text-white transition hover:bg-saffron/90 disabled:opacity-60"
            >
              {loadingProvider === "manual"
                ? "Submitting..."
                : `Submit application — pay $${(totalCents / 100).toFixed(0)} via Zelle`}
            </button>
          </div>

          <OtherMembershipNote className="mt-6 rounded-xl border border-gold/15 bg-cream/30 p-4" />

          <button type="button" onClick={() => setStep(2)} className="mt-6 text-sm font-medium text-soil/60 hover:text-soil">
            ← Back to your information
          </button>
        </div>
      )}

      {openDisclaimer && (
        <AcknowledgementModal
          disclaimer={MEMBERSHIP_DISCLAIMERS[openDisclaimer]}
          defaultName={form.getValues("fullName")}
          existingAcknowledgement={
            openDisclaimer === "compliance" ? complianceAck : enrollmentAck
          }
          onClose={() => setOpenDisclaimer(null)}
          onAcknowledge={(acknowledgement) =>
            handleAcknowledgement(openDisclaimer, acknowledgement)
          }
        />
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
