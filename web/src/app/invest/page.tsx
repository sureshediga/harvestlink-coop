import Link from "next/link";
import { CTABand } from "@/components/CTABand";
import { OtherMembershipNote } from "@/components/OtherMembershipNote";
import { PageHero, Section } from "@/components/PageShell";
import { INVESTOR, MEMBERSHIP } from "@/lib/constants";
import { MANUAL_PAYMENT } from "@/lib/manual-payment";

export const metadata = {
  title: "Other Investment Opportunities",
};

export default function InvestPage() {
  const phoneHref = `tel:+1${MANUAL_PAYMENT.zellePhone.replace(/\D/g, "")}`;

  return (
    <>
      <PageHero
        eyebrow="Contact us"
        title="Other Investment Opportunities"
        description={`Online signup is for the USD ${MEMBERSHIP.joiningFee} membership. Members who invest USD ${INVESTOR.minimumVotingAmount.toLocaleString()} or more receive voting rights and proportional dividends.`}
      />

      <Section>
        <div className="mx-auto max-w-xl rounded-2xl border border-gold/20 bg-white p-8 shadow-sm">
          <h2 className="font-serif text-xl font-semibold text-soil">
            {INVESTOR.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-soil/75">
            {INVESTOR.summary}
          </p>
          <ul className="mt-4 space-y-2 text-sm text-soil/75">
            {INVESTOR.details.slice(0, 4).map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-green">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <OtherMembershipNote className="mt-6 text-left" />
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
