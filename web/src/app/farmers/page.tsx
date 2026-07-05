import { CTABand } from "@/components/CTABand";
import { FarmerCard } from "@/components/FarmerCard";
import { InlineCTA, PageHero, Section } from "@/components/PageShell";
import { FARMER_PARTNERS, FPO_CRITERIA, SUPPLY_CHAIN } from "@/lib/constants";

export const metadata = {
  title: "FPO Partners",
};

export default function FarmersPage() {
  return (
    <>
      <PageHero
        eyebrow="Institution-to-institution"
        title="Our Farmer-Owned Partners"
        description={SUPPLY_CHAIN.summary}
      />

      <Section title="Partner Selection Criteria">
        <ul className="mx-auto mb-10 max-w-3xl space-y-2 text-sm text-soil/75">
          {FPO_CRITERIA.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FARMER_PARTNERS.map((farmer) => (
            <FarmerCard key={farmer.name} {...farmer} />
          ))}
        </div>
        <InlineCTA text="Join and support our FPO partners" />
      </Section>

      <CTABand
        title="Partner with purpose"
        description="Multi-year FPO supply agreements, transparent pricing, and export readiness support — not transactional sourcing."
      />
    </>
  );
}
