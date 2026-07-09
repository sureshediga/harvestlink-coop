import Link from "next/link";
import { FoundingMemberBadge } from "@/components/FoundingMemberBadge";
import { OtherMembershipNote } from "@/components/OtherMembershipNote";
import {
  getMemberByPayPalOrderId,
  getMemberBySessionId,
} from "@/lib/members";

export const metadata = {
  title: "Welcome, Founding Member",
};

export default async function WelcomePage({
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
          Welcome to HarvestLink
        </h1>
        <p className="mt-4 text-soil/70">
          We couldn&apos;t find your membership confirmation. If you completed
          payment, please check your email.
        </p>
        <Link href="/" className="mt-8 inline-block text-green hover:underline">
          Return home
        </Link>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-serif text-3xl font-semibold text-soil">
          Processing your membership
        </h1>
        <p className="mt-4 text-soil/70">
          Your payment was received. We&apos;re finalizing your membership — please
          refresh in a moment or check your email for confirmation.
        </p>
      </div>
    );
  }

  const totalPaid = member.membershipAmount / 100;

  const paymentLabel =
    member.paymentProvider === "manual" ? "Zelle" : "Online payment";

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <FoundingMemberBadge memberNumber={member.memberNumber} />

      <h1 className="mt-8 font-serif text-4xl font-semibold text-soil">
        Welcome, Founding Member!
      </h1>
      <p className="mt-4 text-lg text-soil/75">
        Thank you, {member.fullName.split(" ")[0]}. You are now an owner of
        HarvestLink Cooperative.
      </p>

      <div className="mt-10 rounded-2xl border border-gold/20 bg-white p-6 text-left shadow-sm">
        <h2 className="font-serif text-xl font-semibold text-soil">
          Membership Summary
        </h2>
        <dl className="mt-4 space-y-2 text-sm text-soil/75">
          <div className="flex justify-between">
            <dt>Member number</dt>
            <dd className="font-semibold text-soil">{member.memberNumber}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Payment method</dt>
            <dd>{paymentLabel}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Joining fee</dt>
            <dd>${(member.membershipAmount / 100).toFixed(2)}</dd>
          </div>
          <div className="flex justify-between border-t border-gold/20 pt-2 font-semibold text-soil">
            <dt>Total paid</dt>
            <dd>${totalPaid.toFixed(2)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 rounded-2xl bg-green/10 p-6 text-left">
        <h2 className="font-serif text-lg font-semibold text-green">
          What happens next
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-soil/75">
          <li>A confirmation email has been sent to {member.email}</li>
          <li>You&apos;ll receive updates as our Texas store opening approaches</li>
          <li>As a member-owner, you have access to member pricing, products, and fulfillment</li>
          <li>Voting rights require a separate USD 1,000+ capital investment</li>
        </ul>
        <OtherMembershipNote className="mt-4" />
      </div>

      <div className="mt-8">
        <Link
          href="/"
          className="inline-block rounded-full bg-saffron px-8 py-3.5 text-sm font-semibold text-white hover:bg-saffron/90"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
