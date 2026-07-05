import Link from "next/link";
import { CTABand } from "@/components/CTABand";
import { OtherMembershipNote } from "@/components/OtherMembershipNote";
import { PageHero, Section } from "@/components/PageShell";
import { WaysToPay } from "@/components/WaysToPay";
import { GOVERNANCE_SAFEGUARDS, INVESTOR, MEMBERSHIP } from "@/lib/constants";

export const metadata = {
  title: "Membership",
};

export default function MembershipPage() {
  return (
    <>
      <PageHero
        eyebrow="Membership"
        title={MEMBERSHIP.title}
        description={MEMBERSHIP.summary}
      />

      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <article className="rounded-2xl border-2 border-green/30 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-green">
              What you get
            </p>
            <h2 className="mt-2 font-serif text-2xl font-semibold text-soil">
              Member Benefits
            </h2>
            <ul className="mt-6 space-y-3 text-soil/75">
              {MEMBERSHIP.benefits.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-green">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-gold/20 bg-cream/50 p-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-terracotta">
              What it costs
            </p>
            <h2 className="mt-2 font-serif text-2xl font-semibold text-soil">
              Membership Fees
            </h2>
            <ul className="mt-6 space-y-3 text-soil/75">
              {MEMBERSHIP.obligations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-soil/60">{MEMBERSHIP.chapters}</p>
            <p className="mt-2 text-sm text-soil/60">{MEMBERSHIP.legalForm}</p>
          </article>
        </div>
      </Section>

      <Section title="Democratic Governance" className="bg-white">
        <ul className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2">
          {MEMBERSHIP.governance.map((item) => (
            <li
              key={item}
              className="rounded-xl border border-gold/15 bg-cream/40 px-4 py-3 text-sm text-soil/80"
            >
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Investment & Voting Rights" className="bg-white">
        <div className="mx-auto max-w-3xl rounded-2xl border border-gold/20 bg-cream/40 p-8">
          <p className="text-sm leading-relaxed text-soil/75">{INVESTOR.summary}</p>
          <ul className="mt-4 space-y-2 text-sm text-soil/75">
            {INVESTOR.details.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
          <OtherMembershipNote className="mt-6" />
        </div>
      </Section>

      <Section title="Governance Safeguards">
        <ul className="mx-auto max-w-3xl space-y-2 text-sm text-soil/75">
          {GOVERNANCE_SAFEGUARDS.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </Section>

      <Section title="Pay with Zelle" className="bg-white">
        <WaysToPay />
        <div className="mt-8 text-center">
          <Link
            href="/join"
            className="inline-block rounded-full bg-saffron px-8 py-3.5 text-sm font-semibold text-white hover:bg-saffron/90"
          >
            Start Membership Application — ${MEMBERSHIP.joiningFee}
          </Link>
          <OtherMembershipNote className="mx-auto mt-6 max-w-md text-center" />
        </div>
      </Section>

      <CTABand buttonText={`Become a Member — $${MEMBERSHIP.joiningFee}`} />
    </>
  );
}
