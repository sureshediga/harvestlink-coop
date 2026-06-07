import Link from "next/link";
import { WaysToPay } from "@/components/WaysToPay";
import { getApplicationByReference } from "@/lib/applications";

export const metadata = {
  title: "Investment Payment Instructions",
};

export default async function InvestInstructionsPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const params = await searchParams;
  const application = params.ref
    ? await getApplicationByReference(params.ref)
    : null;

  if (!application || application.kind !== "investment") {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-serif text-3xl font-semibold text-soil">
          Application not found
        </h1>
        <Link href="/invest" className="mt-8 inline-block text-green hover:underline">
          Start investment application
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <span className="inline-block rounded-full bg-terracotta/10 px-4 py-1.5 text-sm font-semibold text-terracotta">
          Investment Application Submitted
        </span>
        <h1 className="mt-4 font-serif text-3xl font-semibold text-soil">
          Complete Your Investment Payment
        </h1>
        <p className="mt-3 text-soil/75">
          Reference <strong>{application.referenceNumber}</strong> — invest{" "}
          {application.investmentUnits} unit(s). We&apos;ll confirm within 1–2 business
          days after payment.
        </p>
      </div>

      <div className="mt-10">
        <WaysToPay
          referenceNumber={application.referenceNumber}
          totalDollars={application.totalAmount / 100}
        />
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-sm font-medium text-green hover:underline">
          Return to home
        </Link>
      </div>
    </div>
  );
}
