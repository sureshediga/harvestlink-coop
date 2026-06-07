import { CTABand } from "@/components/CTABand";
import { FarmerCard } from "@/components/FarmerCard";
import { InlineCTA, PageHero, Section } from "@/components/PageShell";
import { FARMER_PARTNERS, FPO_CRITERIA } from "@/lib/constants";

export const metadata = {
  title: "FPO Partners",
};

export default function FarmersPage() {
  return (
    <>
      <PageHero
        eyebrow="Institution-to-institution"
        title="Our FPO Partners"
        description="HarvestLink sources exclusively from registered Farmer Producer Organizations — not individual farmers or commodity traders. FPOs aggregate supply, enforce quality, handle documentation, and provide institutional accountability."
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
