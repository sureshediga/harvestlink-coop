import Link from "next/link";
import { MemberIdCard } from "@/components/MemberIdCard";
import { MembershipCertificate } from "@/components/MembershipCertificate";
import { WaysToPay } from "@/components/WaysToPay";
import { getApplicationByReference } from "@/lib/applications";
import { buildCredentialView } from "@/lib/credential";
import { verifyAccessToken } from "@/lib/verify";

export const metadata = {
  title: "Investment Payment Instructions",
};

function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
      <h1 className="font-serif text-3xl font-semibold text-soil">
        Application not found
      </h1>
      <p className="mt-4 text-soil/70">
        We couldn&apos;t find your application. Please use the link from your
        submission, or start the investment process again.
      </p>
      <Link href="/invest" className="mt-8 inline-block text-green hover:underline">
        Start investment application
      </Link>
    </div>
  );
}

export default async function InvestInstructionsPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; t?: string }>;
}) {
  const params = await searchParams;
  const referenceNumber = params.ref;

  if (!referenceNumber || !verifyAccessToken(referenceNumber, params.t)) {
    return <NotFound />;
  }

  const application = await getApplicationByReference(referenceNumber);

  if (!application || application.kind !== "investment") {
    return <NotFound />;
  }

  const credential = await buildCredentialView(application);

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

      <div className="mx-auto mt-10 max-w-xl">
        <h2 className="text-center font-serif text-lg font-semibold text-soil">
          Your Cooperative Certificate
        </h2>
        <div className="mt-4">
          <MembershipCertificate
            name={credential.name}
            referenceNumber={application.referenceNumber}
            issueDate={credential.issueDate}
            standingLabel={credential.standingLabel}
            statusLabel={credential.statusLabel}
            isActive={credential.isActive}
            qrDataUrl={credential.qrDataUrl}
            verifyUrl={credential.verifyUrl}
          />
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-xl">
        <h2 className="text-center font-serif text-lg font-semibold text-soil">
          Your Member ID Card
        </h2>
        <div className="mt-4">
          <MemberIdCard
            name={credential.name}
            memberId={credential.memberId}
            memberSince={credential.memberSince}
            type={credential.type}
            statusLabel={credential.statusLabel}
            isActive={credential.isActive}
            qrDataUrl={credential.qrDataUrl}
            verifyUrl={credential.verifyUrl}
          />
        </div>
      </div>

      <div className="mt-12">
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
