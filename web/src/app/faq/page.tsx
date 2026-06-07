import { CTABand } from "@/components/CTABand";
import { PageHero, Section } from "@/components/PageShell";
import { FAQ_ITEMS } from "@/lib/constants";

export const metadata = {
  title: "FAQ",
};

export default function FAQPage() {
  return (
    <>
      <PageHero
        eyebrow="Questions"
        title="Frequently Asked Questions"
        description="Everything you need to know about membership, investment, and our Texas opening."
      />

      <Section>
        <div className="mx-auto max-w-3xl space-y-4">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-gold/20 bg-white p-6 shadow-sm"
            >
              <summary className="cursor-pointer list-none font-serif text-lg font-semibold text-soil marker:content-none">
                <span className="flex items-center justify-between gap-4">
                  {item.question}
                  <span className="text-green transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-soil/75">{item.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      <CTABand />
    </>
  );
}
