import { MANUAL_PAYMENT, MEMBERSHIP, SITE } from "@/lib/constants";

type WaysToPayProps = {
  referenceNumber?: string;
  totalDollars?: number;
  compact?: boolean;
};

export function WaysToPay({
  referenceNumber,
  totalDollars,
  compact = false,
}: WaysToPayProps) {
  const amount =
    totalDollars?.toFixed(2) ?? MEMBERSHIP.joiningFee.toFixed(2);

  return (
    <div className={compact ? "space-y-4" : "space-y-6"}>
      {!compact && (
        <div>
          <h3 className="font-serif text-xl font-semibold text-soil">
            Pay with Zelle
          </h3>
          <p className="mt-2 text-sm text-soil/70">
            Send payment from your bank app. Membership is activated within 1–2
            business days after payment is received.
          </p>
        </div>
      )}

      <article className="rounded-2xl border border-green/30 bg-green/5 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-green">
          Zelle
        </p>
        <p className="mt-3 font-serif text-2xl font-semibold text-soil">
          {MANUAL_PAYMENT.zellePhone}
        </p>
        <p className="mt-2 text-sm text-soil/75">
          Open your bank app, choose Zelle, and send to this number.
        </p>
      </article>

      {(referenceNumber || totalDollars) && (
        <div className="rounded-2xl border-2 border-gold/30 bg-cream/50 p-5">
          <p className="text-sm font-semibold text-soil">Your application</p>
          {referenceNumber && (
            <p className="mt-2 font-serif text-2xl font-semibold text-green">
              {referenceNumber}
            </p>
          )}
          {totalDollars !== undefined && (
            <p className="mt-1 text-sm text-soil/75">
              Amount due: <strong>${totalDollars.toFixed(2)}</strong>
            </p>
          )}
          <p className="mt-3 text-sm text-soil/70">
            {MANUAL_PAYMENT.confirmationNote}
          </p>
        </div>
      )}

      <article className="rounded-xl border border-gold/15 bg-white p-5">
        <h4 className="font-semibold text-soil">How to pay</h4>
        <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm text-soil/75">
          <li>
            Open your bank app and send ${amount} via Zelle to{" "}
            <strong>{MANUAL_PAYMENT.zellePhone}</strong>.
          </li>
          <li>
            {referenceNumber
              ? `Include memo: ${referenceNumber}.`
              : "Include your application reference number in the memo."}
          </li>
          <li>
            Email {SITE.contactEmail} once sent so we can confirm receipt.
          </li>
        </ol>
      </article>
    </div>
  );
}
