import { CTABand } from "@/components/CTABand";
import { PageHero, Section } from "@/components/PageShell";
import { GOVERNANCE_SAFEGUARDS, ROADMAP } from "@/lib/constants";

export const metadata = {
  title: "Our Vision",
};

export default function VisionPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Vision"
        title="A Nationwide, Member-Owned FPO Linkage"
        description="Building a durable export market for safe, differentiated food — generating cooperative savings for members and income stability for farmer institutions across India."
      />

      <Section className="bg-white">
        <div className="mx-auto max-w-3xl space-y-8">
          {ROADMAP.map((phase) => (
            <article
              key={phase.phase}
              className="rounded-2xl border border-gold/20 p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-green">
                {phase.timeline}
              </p>
              <h2 className="mt-2 font-serif text-xl font-semibold text-soil">
                {phase.phase}
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-soil/75">
                {phase.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Governance Safeguards">
        <ul className="mx-auto max-w-3xl space-y-3">
          {GOVERNANCE_SAFEGUARDS.map((item) => (
            <li
              key={item}
              className="rounded-xl border border-gold/15 bg-cream/40 px-4 py-3 text-sm text-soil/80"
            >
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <CTABand />
    </>
  );
}
