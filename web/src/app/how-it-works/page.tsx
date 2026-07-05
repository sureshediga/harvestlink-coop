import { CTABand } from "@/components/CTABand";
import { InlineCTA, PageHero, Section } from "@/components/PageShell";
import {
  FPO_CRITERIA,
  FRAMING_NOTE,
  LOGISTICS_STAGES,
  MEMBER_VALUE_PROPS,
  SUPPLY_CHAIN,
} from "@/lib/constants";

export const metadata = {
  title: "How It Works",
};

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="Indo-US cooperative linkage"
        title="How HarvestLink Works"
        description="A member-governed institution on the demand side, matched with farmer-owned organisations on the supply side."
      />

      <section className="border-b border-gold/20 bg-cream/40 px-4 py-8 sm:px-6">
        <p className="mx-auto max-w-3xl text-center text-sm italic text-soil/70">
          {FRAMING_NOTE}
        </p>
        <p className="mx-auto mt-4 max-w-3xl text-center text-sm text-soil/70">
          {SUPPLY_CHAIN.farmerReturns}
        </p>
      </section>

      <Section title="Four-Stage Supply Chain">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {LOGISTICS_STAGES.map((item) => (
            <article key={item.stage} className="rounded-2xl border border-gold/20 bg-white p-6">
              <span className="text-2xl font-bold text-green">{item.stage}</span>
              <h3 className="mt-3 font-serif text-lg font-semibold text-soil">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-soil/70">{item.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="FPO Partner Criteria" className="bg-white">
        <ul className="mx-auto max-w-3xl space-y-3">
          {FPO_CRITERIA.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-xl border border-gold/15 bg-cream/40 p-4 text-sm text-soil/80"
            >
              <span className="text-green">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Value for Members">
        <div className="grid gap-6 md:grid-cols-2">
          {MEMBER_VALUE_PROPS.map((item) => (
            <article key={item.title} className="rounded-2xl border border-gold/20 p-6">
              <h3 className="font-serif text-xl font-semibold text-soil">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-soil/75">{item.text}</p>
            </article>
          ))}
        </div>
        <InlineCTA text="Become a Member" />
      </Section>

      <CTABand />
    </>
  );
}
