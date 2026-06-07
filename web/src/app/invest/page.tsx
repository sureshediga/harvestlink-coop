import Link from "next/link";
import { Suspense } from "react";
import { InvestForm } from "@/components/InvestForm";
import { INVESTOR, MEMBERSHIP } from "@/lib/constants";

export const metadata = {
  title: "Invest & Earn",
};

export default function InvestPage({
  searchParams,
}: {
  searchParams: Promise<{ cancelled?: string }>;
}) {
  return (
    <>
      <CancelledNotice searchParams={searchParams} />
      <section className="border-b border-gold/20 bg-white px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-terracotta">
            Patron Capital
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-soil sm:text-4xl">
            {INVESTOR.title}
          </h1>
          <p className="mt-4 text-soil/75">{INVESTOR.summary}</p>
          <p className="mt-4 text-sm text-soil/60">
            Separate from the ${MEMBERSHIP.joiningFee} membership fee.{" "}
            <a href="/membership" className="font-medium text-green hover:underline">
              View membership details
            </a>
          </p>
        </div>
      </section>
      <Suspense fallback={<div className="py-20 text-center text-soil/60">Loading...</div>}>
        <InvestForm />
      </Suspense>
    </>
  );
}

async function CancelledNotice({
  searchParams,
}: {
  searchParams: Promise<{ cancelled?: string }>;
}) {
  const params = await searchParams;
  if (params.cancelled !== "true") return null;
  return (
    <div className="mx-auto max-w-2xl px-4 pt-6 sm:px-6">
      <p className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-soil">
        Investment payment was cancelled. You can try again when ready.
      </p>
    </div>
  );
}
