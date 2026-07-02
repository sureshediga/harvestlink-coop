import Link from "next/link";
import { CTABand } from "@/components/CTABand";
import { OtherMembershipNote } from "@/components/OtherMembershipNote";
import { PageHero, Section } from "@/components/PageShell";
import { MEMBERSHIP } from "@/lib/constants";
import { MANUAL_PAYMENT } from "@/lib/manual-payment";

export const metadata = {
  title: "Other Membership & Investment Opportunities",
};

export default function InvestPage() {
  const phoneHref = `tel:+1${MANUAL_PAYMENT.zellePhone.replace(/\D/g, "")}`;

  return (
    <>
      <PageHero
        eyebrow="Contact us"
        title="Other Membership & Investment Opportunities"
        description={`Online signup is for the standard $${MEMBERSHIP.joiningFee} membership. For other options, please call us directly.`}
      />

      <Section>
        <div className="mx-auto max-w-xl rounded-2xl border border-gold/20 bg-white p-8 text-center shadow-sm">
          <OtherMembershipNote className="text-base text-soil/80" />
          <a
            href={phoneHref}
            className="mt-6 inline-block rounded-full bg-green px-8 py-3.5 text-sm font-semibold text-white hover:bg-green/90"
          >
            Call {MANUAL_PAYMENT.zellePhone}
          </a>
          <p className="mt-6 text-sm text-soil/60">
            Ready for standard membership?{" "}
            <Link href="/join" className="font-medium text-green hover:underline">
              Apply online — ${MEMBERSHIP.joiningFee}
            </Link>
          </p>
        </div>
      </Section>

      <CTABand />
    </>
  );
}
