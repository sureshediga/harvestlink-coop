import Link from "next/link";
import { WaysToPay } from "@/components/WaysToPay";
import { getApplicationByReference } from "@/lib/applications";

export const metadata = {
  title: "Payment Instructions",
};

export default async function InstructionsPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const params = await searchParams;
  const referenceNumber = params.ref;

  if (!referenceNumber) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-serif text-3xl font-semibold text-soil">
          Application not found
        </h1>
        <p className="mt-4 text-soil/70">
          We couldn&apos;t find your application reference. Please start the join
          process again.
        </p>
        <Link href="/join" className="mt-8 inline-block text-green hover:underline">
          Start membership application
        </Link>
      </div>
    );
  }

  const application = await getApplicationByReference(referenceNumber);

  if (!application || application.kind !== "membership") {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-serif text-3xl font-semibold text-soil">
          Application not found
        </h1>
        <p className="mt-4 text-soil/70">
          No application matches reference{" "}
          <strong>{referenceNumber}</strong>.
        </p>
        <Link href="/join" className="mt-8 inline-block text-green hover:underline">
          Start membership application
        </Link>
      </div>
    );
  }

  const totalDollars = application.totalAmount / 100;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <span className="inline-block rounded-full bg-green/10 px-4 py-1.5 text-sm font-semibold text-green">
          Application Submitted
        </span>
        <h1 className="mt-4 font-serif text-3xl font-semibold text-soil sm:text-4xl">
          Complete Your Payment
        </h1>
        <p className="mt-3 text-soil/75">
          Thank you, {application.fullName.split(" ")[0]}. Use the instructions
          below to pay via Zelle. We&apos;ll activate your founding membership
          membership within 1–2 business days after payment is received.
        </p>
      </div>

      <div className="mt-10">
        <WaysToPay
          referenceNumber={application.referenceNumber}
          totalDollars={totalDollars}
        />
      </div>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gold/20">
        <h2 className="font-serif text-lg font-semibold text-soil">
          What happens next
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-soil/75">
          <li>Send payment using your reference number in the memo</li>
          <li>We&apos;ll email {application.email} when your membership is active</li>
          <li>You&apos;ll receive updates as our Texas store opening approaches</li>
        </ul>
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-sm font-medium text-green hover:underline">
          Return to home
        </Link>
      </div>
    </div>
  );
}
