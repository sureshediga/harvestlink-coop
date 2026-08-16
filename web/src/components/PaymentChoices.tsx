"use client";

import { useEffect, useState } from "react";

export type PaymentProviderChoice = "manual" | "paypal" | "stripe";

type PaymentMethods = {
  zelle: boolean;
  paypal: boolean;
  stripe: boolean;
};

type PaymentChoicesProps = {
  amountDollars: number;
  loading: boolean;
  loadingProvider: PaymentProviderChoice | null;
  onZelle: () => void;
  onPayPal: () => void;
  onStripe: () => void;
  zelleActionLabel: string;
  zelleNote?: string;
  paypalNote?: string;
  stripeNote?: string;
};

export function PaymentChoices({
  amountDollars,
  loading,
  loadingProvider,
  onZelle,
  onPayPal,
  onStripe,
  zelleActionLabel,
  zelleNote = "Submit your application to receive payment instructions and a reference number. We activate your record after confirming payment.",
  paypalNote = "Pay now with PayPal or a linked card. Your record activates as soon as PayPal confirms the payment.",
  stripeNote = "Pay now with a debit or credit card via Stripe. Your record activates after Stripe confirms the payment.",
}: PaymentChoicesProps) {
  const [methods, setMethods] = useState<PaymentMethods>({
    zelle: true,
    paypal: false,
    stripe: false,
  });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/payments/methods")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: PaymentMethods | null) => {
        if (!cancelled && data) {
          setMethods({
            zelle: true,
            paypal: Boolean(data.paypal),
            stripe: Boolean(data.stripe),
          });
        }
      })
      .catch(() => {
        // Zelle remains available if the methods endpoint is unreachable.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const amountLabel = `$${amountDollars.toFixed(0)}`;
  const hasOnline = methods.paypal || methods.stripe;

  return (
    <div className="mt-6 space-y-5">
      <div>
        <p className="text-sm font-semibold text-green">Pay with Zelle</p>
        <p className="mt-1 text-xs text-soil/50">{zelleNote}</p>
        <button
          type="button"
          disabled={loading}
          onClick={onZelle}
          className="mt-4 w-full rounded-full bg-saffron py-3.5 font-semibold text-white transition hover:bg-saffron/90 disabled:opacity-60"
        >
          {loadingProvider === "manual"
            ? "Submitting..."
            : zelleActionLabel}
        </button>
      </div>

      {hasOnline && (
        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center" aria-hidden>
            <div className="w-full border-t border-gold/20" />
          </div>
          <p className="relative mx-auto w-fit bg-white px-3 text-xs font-medium uppercase tracking-wider text-soil/45">
            or pay now
          </p>
        </div>
      )}

      {methods.paypal && (
        <div>
          <p className="text-sm font-semibold text-soil">Pay with PayPal</p>
          <p className="mt-1 text-xs text-soil/50">{paypalNote}</p>
          <button
            type="button"
            disabled={loading}
            onClick={onPayPal}
            className="mt-4 w-full rounded-full bg-[#0070ba] py-3.5 font-semibold text-white transition hover:bg-[#005ea6] disabled:opacity-60"
          >
            {loadingProvider === "paypal"
              ? "Redirecting to PayPal..."
              : `Pay ${amountLabel} with PayPal`}
          </button>
        </div>
      )}

      {methods.stripe && (
        <div>
          <p className="text-sm font-semibold text-soil">Pay with card</p>
          <p className="mt-1 text-xs text-soil/50">{stripeNote}</p>
          <button
            type="button"
            disabled={loading}
            onClick={onStripe}
            className="mt-4 w-full rounded-full border-2 border-green bg-white py-3.5 font-semibold text-green transition hover:bg-green/5 disabled:opacity-60"
          >
            {loadingProvider === "stripe"
              ? "Redirecting to card checkout..."
              : `Pay ${amountLabel} with card`}
          </button>
        </div>
      )}
    </div>
  );
}
