"use client";

import { useState } from "react";
import {
  AcknowledgementPanel,
  FormAcknowledgementRow,
} from "./AcknowledgementPanel";
import {
  PaymentChoices,
  type PaymentProviderChoice,
} from "./PaymentChoices";
import { StepIndicator } from "./StepIndicator";
import { InvestorBenefits } from "./InvestorBenefits";
import { INVESTOR, INVESTMENT_TERMS } from "@/lib/constants";
import { useScrollToTopOnChange } from "@/lib/use-scroll-to-top-on-change";
import {
  MEMBERSHIP_DISCLAIMERS,
  type DisclaimerId,
} from "@/lib/disclaimers";
import type {
  EnrollmentAcknowledgement,
  FormAcknowledgement,
} from "@/lib/schemas";

const STEPS = ["Why Invest", "Review & Sign"];
const DOLLAR_PRESETS = [100, 500, 1000, 2500, 5000, 10000];

function parseDollarAmount(raw: string): number | null {
  const cleaned = raw.replace(/[$,\s]/g, "");
  if (!cleaned) return null;
  const amount = Number(cleaned);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return Math.round(amount);
}

export function InvestForm() {
  const [step, setStep] = useState(1);
  const topRef = useScrollToTopOnChange(step);
  const [dollars, setDollars] = useState<number>(INVESTOR.minimumVotingAmount);
  const [customDollars, setCustomDollars] = useState("");
  const [memberNumber, setMemberNumber] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [complianceAck, setComplianceAck] = useState<FormAcknowledgement | null>(
    null
  );
  const [enrollmentAck, setEnrollmentAck] =
    useState<EnrollmentAcknowledgement | null>(null);
  const [openDisclaimer, setOpenDisclaimer] = useState<DisclaimerId | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] =
    useState<PaymentProviderChoice | null>(null);
  const [error, setError] = useState<string | null>(null);

  const investmentUnits = Math.round(dollars / INVESTOR.unitAmount);

  function applyPreset(amount: number) {
    setDollars(amount);
    setCustomDollars("");
    setError(null);
  }

  function validateAmount(amount: number | null): string | null {
    if (amount === null) {
      return `Enter a dollar amount of at least $${INVESTOR.unitAmount}.`;
    }
    if (amount < INVESTOR.unitAmount) {
      return `Minimum investment is $${INVESTOR.unitAmount}.`;
    }
    if (amount % INVESTOR.unitAmount !== 0) {
      return `Investment must be in $${INVESTOR.unitAmount} increments.`;
    }
    return null;
  }

  function applyCustomAmount() {
    if (!customDollars.trim()) {
      setError(null);
      return true;
    }
    const amount = parseDollarAmount(customDollars);
    const message = validateAmount(amount);
    if (message || amount === null) {
      setError(message ?? "Enter a valid dollar amount.");
      return false;
    }
    setDollars(amount);
    setError(null);
    return true;
  }

  function continueFromAmount() {
    if (applyCustomAmount()) {
      setStep(2);
    }
  }

  function handleAcknowledgement(
    disclaimerId: DisclaimerId,
    acknowledgement: FormAcknowledgement | EnrollmentAcknowledgement
  ) {
    if (disclaimerId === "compliance") {
      setComplianceAck(acknowledgement as FormAcknowledgement);
    } else {
      setEnrollmentAck(acknowledgement as EnrollmentAcknowledgement);
    }
    setOpenDisclaimer(null);
    setError(null);
  }

  function investmentPayload() {
    if (!complianceAck || !enrollmentAck) {
      return null;
    }
    return {
      investmentUnits,
      memberNumber: memberNumber.trim() || undefined,
      agreedToTerms: true as const,
      acknowledgements: {
        compliance: complianceAck,
        enrollmentDisclosure: enrollmentAck,
      },
    };
  }

  function ensureReadyToPay(): boolean {
    if (!complianceAck || !enrollmentAck) {
      setError(
        "Please read and sign both the Compliance & Acknowledgement Form and the Membership Enrollment & Disclosure Form."
      );
      return false;
    }
    if (!agreedToTerms) {
      setError("Please agree to the investment terms to continue.");
      return false;
    }
    return true;
  }

  async function submitManual() {
    if (!ensureReadyToPay()) return;
    setLoading(true);
    setLoadingProvider("manual");
    setError(null);
    try {
      const payload = investmentPayload();
      if (!payload) throw new Error("Application details are incomplete.");
      const response = await fetch("/api/invest/applications/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to submit");
      const tokenParam = data.accessToken
        ? `&t=${encodeURIComponent(data.accessToken)}`
        : "";
      window.location.href = `/invest/instructions?ref=${encodeURIComponent(data.referenceNumber)}${tokenParam}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
      setLoadingProvider(null);
    }
  }

  async function submitOnlineCheckout(provider: "paypal" | "stripe") {
    if (!ensureReadyToPay()) return;
    setLoading(true);
    setLoadingProvider(provider);
    setError(null);
    const path =
      provider === "paypal"
        ? "/api/invest/paypal/checkout"
        : "/api/invest/checkout";
    try {
      const payload = investmentPayload();
      if (!payload) throw new Error("Application details are incomplete.");
      const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to start checkout");
      if (!data.url) throw new Error("Checkout did not return a payment URL");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
      setLoadingProvider(null);
    }
  }

  return (
    <div
      ref={topRef}
      tabIndex={-1}
      className="mx-auto max-w-2xl px-4 py-10 sm:px-6 outline-none"
    >
      <StepIndicator currentStep={step} steps={STEPS} />

      {step === 1 && (
        <div className="rounded-2xl border border-gold/20 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="font-serif text-3xl font-semibold text-soil">
            Invest in HarvestLinx
          </h1>
          <p className="mt-3 text-soil/75">{INVESTOR.summary}</p>

          <InvestorBenefits className="mt-6" />

          <div className="mt-8">
            <p className="font-semibold text-soil">Enter investment amount</p>
            <p className="mt-1 text-sm text-soil/60">
              Amounts are in USD {INVESTOR.unitAmount} increments. Voting rights
              begin at USD {INVESTOR.minimumVotingAmount.toLocaleString()}.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {DOLLAR_PRESETS.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => applyPreset(amount)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    dollars === amount
                      ? "bg-green text-cream"
                      : "bg-white text-soil ring-1 ring-gold/30"
                  }`}
                >
                  ${amount.toLocaleString()}
                </button>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-soil/50">
                  $
                </span>
                <input
                  value={customDollars}
                  onChange={(e) => setCustomDollars(e.target.value)}
                  onBlur={applyCustomAmount}
                  inputMode="numeric"
                  placeholder="Or enter a different amount"
                  aria-label="Or enter a different investment amount in dollars"
                  aria-describedby="custom-amount-hint"
                  className={`${inputClass} pl-8`}
                />
              </div>
              <button
                type="button"
                onClick={applyCustomAmount}
                className="shrink-0 rounded-full bg-green px-4 py-2 text-sm font-semibold text-cream"
              >
                Apply
              </button>
            </div>
            <p id="custom-amount-hint" className="mt-2 text-sm text-soil/60">
              Need a different amount than the options above? Type it here in $
              {INVESTOR.unitAmount} increments.
            </p>
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={continueFromAmount}
            className="mt-8 w-full rounded-full bg-saffron py-3.5 font-semibold text-white hover:bg-saffron/90"
          >
            Continue — ${dollars.toLocaleString()} investment
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="rounded-2xl border border-gold/20 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-serif text-2xl font-semibold text-soil">
            Investment Review & Sign
          </h2>
          <p className="mt-2 text-sm text-soil/70">
            Complete both acknowledgement forms below. Your name, contact details,
            and address are collected in the Membership Enrollment & Disclosure
            Form.
          </p>

          <dl className="mt-6 space-y-3 border-b border-gold/20 pb-6">
            <div className="flex justify-between text-soil">
              <dt>
                Cooperative investment ({investmentUnits} × $
                {INVESTOR.unitAmount})
              </dt>
              <dd>${dollars.toFixed(2)}</dd>
            </div>
            <div className="text-sm text-soil/60">
              Voting rights for USD {INVESTOR.minimumVotingAmount.toLocaleString()}
              + invested members — one member, one vote. Dividends proportional
              to investment.
            </div>
            <div className="flex justify-between border-t border-gold/20 pt-3 text-lg font-semibold text-soil">
              <dt>Due today</dt>
              <dd>${dollars.toFixed(2)}</dd>
            </div>
          </dl>

          <label className="mt-6 block">
            <span className="mb-1.5 block text-sm font-medium text-soil">
              Member number (if already a member)
            </span>
            <input
              value={memberNumber}
              onChange={(e) => setMemberNumber(e.target.value)}
              placeholder="e.g. HL-2026-0001"
              className={inputClass}
            />
          </label>

          <div className="mt-6 space-y-3">
            <p className="text-sm font-semibold text-soil">
              Required acknowledgements
            </p>
            <div>
              <FormAcknowledgementRow
                label="I have read and signed the HarvestLinx Member Compliance & Acknowledgement Form."
                acknowledged={Boolean(complianceAck)}
                signedName={complianceAck?.signedName}
                signedDate={complianceAck?.signedDate}
                onOpen={() => setOpenDisclaimer("compliance")}
              />
              {openDisclaimer === "compliance" && (
                <AcknowledgementPanel
                  disclaimer={MEMBERSHIP_DISCLAIMERS.compliance}
                  defaultName={
                    enrollmentAck?.signedName ?? complianceAck?.signedName
                  }
                  existingAcknowledgement={complianceAck}
                  onCancel={() => setOpenDisclaimer(null)}
                  onAcknowledge={(acknowledgement) =>
                    handleAcknowledgement("compliance", acknowledgement)
                  }
                />
              )}
            </div>
            <div>
              <FormAcknowledgementRow
                label="I have read and signed the HarvestLinx Membership Enrollment & Disclosure Form (includes your application details)."
                acknowledged={Boolean(enrollmentAck)}
                signedName={enrollmentAck?.signedName}
                signedDate={enrollmentAck?.signedDate}
                onOpen={() => setOpenDisclaimer("enrollmentDisclosure")}
              />
              {openDisclaimer === "enrollmentDisclosure" && (
                <AcknowledgementPanel
                  disclaimer={MEMBERSHIP_DISCLAIMERS.enrollmentDisclosure}
                  collectApplicationInfo
                  defaultName={
                    enrollmentAck?.signedName ?? complianceAck?.signedName
                  }
                  existingAcknowledgement={enrollmentAck}
                  onCancel={() => setOpenDisclaimer(null)}
                  onAcknowledge={(acknowledgement) =>
                    handleAcknowledgement("enrollmentDisclosure", acknowledgement)
                  }
                />
              )}
            </div>
          </div>

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
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <PaymentChoices
            amountDollars={dollars}
            loading={loading}
            loadingProvider={loadingProvider}
            onZelle={submitManual}
            onPayPal={() => submitOnlineCheckout("paypal")}
            onStripe={() => submitOnlineCheckout("stripe")}
            zelleActionLabel={`Submit investment — pay $${dollars.toFixed(0)} via Zelle`}
            zelleNote="Submit your application to receive payment instructions and a reference number. Investment is recorded after we confirm payment."
            paypalNote="Pay now with PayPal or a linked card. Your investment is recorded as soon as PayPal confirms the payment."
            stripeNote="Pay now with a debit or credit card via Stripe. Your investment is recorded after Stripe confirms the payment."
          />

          <button
            type="button"
            onClick={() => setStep(1)}
            className="mt-6 text-sm font-medium text-soil/60 hover:text-soil"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-gold/25 bg-white px-4 py-3 text-soil outline-none ring-green focus:ring-2";
