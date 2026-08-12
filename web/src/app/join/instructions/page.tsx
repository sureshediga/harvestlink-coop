import Link from "next/link";
import { MemberIdCard } from "@/components/MemberIdCard";
import { MembershipCertificate } from "@/components/MembershipCertificate";
import { WaysToPay } from "@/components/WaysToPay";
import { getApplicationByReference } from "@/lib/applications";
import { buildCredentialView } from "@/lib/credential";
import { verifyAccessToken } from "@/lib/verify";

export const metadata = {
  title: "Payment Instructions",
};

function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
      <h1 className="font-serif text-3xl font-semibold text-soil">
        Application not found
      </h1>
      <p className="mt-4 text-soil/70">
        We couldn&apos;t find your application. Please use the link from your
        submission, or start the join process again.
      </p>
      <Link href="/join" className="mt-8 inline-block text-green hover:underline">
        Start membership application
      </Link>
    </div>
  );
}

export default async function InstructionsPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; t?: string }>;
}) {
  const params = await searchParams;
  const referenceNumber = params.ref;

  // Require the unguessable access token so the (sequential) reference number
  // can't be enumerated to view other applicants' details.
  if (!referenceNumber || !verifyAccessToken(referenceNumber, params.t)) {
    return <NotFound />;
  }

  const application = await getApplicationByReference(referenceNumber);

  if (!application || application.kind !== "membership") {
    return <NotFound />;
  }

  const totalDollars = application.totalAmount / 100;
  const credential = await buildCredentialView(application);

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
          within 1–2 business days after payment is received.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-xl">
        <h2 className="text-center font-serif text-lg font-semibold text-soil">
          Your Founding Membership Certificate
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
