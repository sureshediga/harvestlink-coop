import Link from "next/link";
import { FoundingMemberBadge } from "@/components/FoundingMemberBadge";
import {
  getMemberByPayPalOrderId,
  getMemberBySessionId,
} from "@/lib/members";

export const metadata = {
  title: "Investment Confirmed",
};

export default async function InvestWelcomePage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; paypal_order_id?: string }>;
}) {
  const params = await searchParams;
  const member = params.paypal_order_id
    ? await getMemberByPayPalOrderId(params.paypal_order_id)
    : params.session_id
      ? await getMemberBySessionId(params.session_id)
      : null;

  if (!params.session_id && !params.paypal_order_id) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-serif text-3xl font-semibold text-soil">
          Investment Confirmation
        </h1>
        <p className="mt-4 text-soil/70">
          We couldn&apos;t find your investment confirmation. Please check your email.
        </p>
        <Link href="/invest" className="mt-8 inline-block text-green hover:underline">
          Return to invest
        </Link>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-serif text-3xl font-semibold text-soil">
          Processing your investment
        </h1>
        <p className="mt-4 text-soil/70">
          Payment received — we&apos;re finalizing your investment record. Please refresh
          shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <FoundingMemberBadge memberNumber={member.memberNumber} />

      <h1 className="mt-8 font-serif text-4xl font-semibold text-soil">
        Thank You, Investor!
      </h1>
      <p className="mt-4 text-lg text-soil/75">
        Your cooperative investment of $
        {(member.investmentAmount / 100).toFixed(2)} ({member.investmentUnits} units) has
        been recorded.
      </p>

      <div className="mt-10 rounded-2xl border border-gold/20 bg-white p-6 text-left shadow-sm">
        <dl className="space-y-2 text-sm text-soil/75">
          <div className="flex justify-between">
            <dt>Reference</dt>
            <dd className="font-semibold text-soil">{member.memberNumber}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Investment units</dt>
            <dd>{member.investmentUnits}</dd>
          </div>
          <div className="flex justify-between font-semibold text-soil">
            <dt>Total invested</dt>
            <dd>${(member.investmentAmount / 100).toFixed(2)}</dd>
          </div>
        </dl>
      </div>

      <Link href="/" className="mt-10 inline-block rounded-full bg-saffron px-8 py-3.5 text-sm font-semibold text-white">
        Back to Home
      </Link>
    </div>
  );
}
