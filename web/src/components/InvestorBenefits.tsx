import { INVESTOR, MANUAL_PAYMENT } from "@/lib/constants";

type InvestorBenefitsProps = {
  className?: string;
};

export function InvestorBenefits({ className = "" }: InvestorBenefitsProps) {
  const phoneHref = `tel:+1${MANUAL_PAYMENT.zellePhone.replace(/\D/g, "")}`;

  return (
    <div className={className}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-serif text-xl font-semibold text-soil">
          Investor benefits
        </h2>
        <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#7a5a1f]">
          Work in progress
        </span>
      </div>

      <ol className="mt-4 space-y-4">
        {INVESTOR.benefits.map((item, index) => (
          <li key={item.title} className="rounded-xl border border-gold/15 bg-cream/40 p-4">
            <p className="font-semibold text-soil">
              <span className="mr-2 text-green">{index + 1}.</span>
              {item.title}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-soil/75">
              {item.body}
            </p>
          </li>
        ))}
      </ol>

      <p className="mt-4 text-sm leading-relaxed text-soil/70">
        {INVESTOR.benefitsDraftNote}{" "}
        <a
          href={phoneHref}
          className="whitespace-nowrap font-semibold text-green hover:underline"
        >
          {MANUAL_PAYMENT.zellePhone}
        </a>
        .
      </p>
    </div>
  );
}
