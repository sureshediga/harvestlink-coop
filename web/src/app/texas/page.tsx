import { CTABand } from "@/components/CTABand";
import { InlineCTA, PageHero, Section } from "@/components/PageShell";
import { MEMBERSHIP } from "@/lib/constants";

export const metadata = {
  title: "Opening in Texas",
};

const TIMELINE = [
  {
    status: "In progress",
    title: "Shipments in transit",
    description: "Authentic Indian groceries are on their way from our farmer partners.",
  },
  {
    status: "Next",
    title: "Texas store opening",
    description: "We expect to open our first store within the next three months.",
  },
  {
    status: "Future",
    title: "Nationwide expansion",
    description: "After Texas, we plan to expand to major U.S. cities.",
  },
];

export default function TexasPage() {
  return (
    <>
      <PageHero
        eyebrow="Opening Soon"
        title="Our First Store — Texas"
        description={`Shipments from India are in transit. Reserve your membership ($${MEMBERSHIP.joiningFee} joining fee) before we open.`}
      />

      <Section>
        <div className="mx-auto max-w-2xl">
          {TIMELINE.map((item, index) => (
            <div key={item.title} className="flex gap-4 pb-10 last:pb-0">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                    index === 0
                      ? "bg-green text-cream"
                      : "bg-gold/20 text-soil"
                  }`}
                >
                  {index + 1}
                </span>
                {index < TIMELINE.length - 1 && (
                  <span className="mt-2 h-full w-0.5 bg-gold/30" />
                )}
              </div>
              <div className="pb-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-green">
                  {item.status}
                </p>
                <h3 className="mt-1 font-serif text-xl font-semibold text-soil">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-soil/75">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <InlineCTA text={`Become a Member — $${MEMBERSHIP.joiningFee}`} />
      </Section>

      <CTABand
        title="Be a founding member in Texas"
        description={`Join for $${MEMBERSHIP.joiningFee} and receive updates as we approach our store opening. Optional patron investment is separate.`}
        buttonText={`Become a Member — $${MEMBERSHIP.joiningFee}`}
      />
    </>
  );
}
