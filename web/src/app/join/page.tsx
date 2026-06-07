import { Suspense } from "react";
import { JoinForm } from "@/components/JoinForm";

export const metadata = {
  title: "Join the Movement",
};

export default function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ cancelled?: string }>;
}) {
  return (
    <>
      <CancelledNotice searchParams={searchParams} />
      <Suspense fallback={<JoinFormFallback />}>
        <JoinForm />
      </Suspense>
    </>
  );
}

function JoinFormFallback() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-center sm:px-6">
      <p className="text-soil/60">Loading membership application...</p>
    </div>
  );
}

async function CancelledNotice({
  searchParams,
}: {
  searchParams: Promise<{ cancelled?: string }>;
}) {
  const params = await searchParams;

  if (params.cancelled !== "true") {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pt-6 sm:px-6">
      <p className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-soil">
        Payment was cancelled. Your information has not been saved — you can try
        again when ready.
      </p>
    </div>
  );
}
