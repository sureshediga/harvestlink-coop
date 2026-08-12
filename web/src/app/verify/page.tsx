import Link from "next/link";
import { getApplicationByReference } from "@/lib/applications";
import { SITE } from "@/lib/constants";
import { decodeVerificationCode } from "@/lib/verify";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Verify Credential",
};

async function resolveStatus(reference: string): Promise<{
  label: string;
  isActive: boolean;
  onRecord: boolean;
} | null> {
  try {
    const app = await getApplicationByReference(reference);
    if (!app) return { label: "Not on record", isActive: false, onRecord: false };
    return {
      label: app.status === "confirmed" ? "Active member" : "Pending payment",
      isActive: app.status === "confirmed",
      onRecord: true,
    };
  } catch {
    return null;
  }
}

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const { c } = await searchParams;
  const payload = decodeVerificationCode(c);

  if (!payload) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 sm:px-6">
        <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-8 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-red-600">
            Could not verify
          </p>
          <h1 className="mt-3 font-serif text-2xl font-semibold text-soil">
            This credential could not be verified
          </h1>
          <p className="mt-3 text-sm text-soil/70">
            The verification code is missing, altered, or not issued by{" "}
            {SITE.legalName}. Do not treat this certificate or ID as valid.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block text-sm font-semibold text-green hover:underline"
          >
            Go to {SITE.name}
          </Link>
        </div>
      </div>
    );
  }

  const status = await resolveStatus(payload.r);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <div className="rounded-2xl border-2 border-green/30 bg-white p-8 shadow-sm">
        <p className="text-center text-sm font-bold uppercase tracking-widest text-green">
          ✓ Authentic credential
        </p>
        <h1 className="mt-2 text-center font-serif text-2xl font-semibold text-soil">
          Issued by {SITE.legalName}
        </h1>
        <p className="mt-2 text-center text-sm text-soil/60">
          This credential carries a valid digital signature.
        </p>

        <dl className="mt-8 space-y-4 border-t border-gold/20 pt-6">
          <div className="flex justify-between gap-4">
            <dt className="text-sm text-soil/60">Name</dt>
            <dd className="text-right font-semibold text-soil">{payload.n}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-sm text-soil/60">Member ID</dt>
            <dd className="text-right font-semibold text-green">{payload.m}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-sm text-soil/60">Type</dt>
            <dd className="text-right font-semibold text-soil">{payload.t}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-sm text-soil/60">Issued</dt>
            <dd className="text-right font-semibold text-soil">{payload.d}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-sm text-soil/60">Status</dt>
            <dd>
              {status ? (
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                    status.isActive
                      ? "bg-green/15 text-green"
                      : "bg-gold/20 text-[#7a5a1f]"
                  }`}
                >
                  {status.label}
                </span>
              ) : (
                <span className="text-sm text-soil/60">
                  Signature valid; live status unavailable
                </span>
              )}
            </dd>
          </div>
        </dl>

        {status && !status.isActive && status.onRecord && (
          <p className="mt-6 rounded-lg bg-gold/10 px-4 py-3 text-center text-xs text-soil/70">
            Membership activates after the joining-fee payment is confirmed.
          </p>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm font-semibold text-green hover:underline"
          >
            Go to {SITE.name}
          </Link>
        </div>
      </div>
    </div>
  );
}
