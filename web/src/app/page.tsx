import Link from "next/link";
import { CTABand } from "@/components/CTABand";
import { FarmerCard } from "@/components/FarmerCard";
import { OtherMembershipNote } from "@/components/OtherMembershipNote";
import { PillarCard } from "@/components/PillarCard";
import {
  FARMER_PARTNERS,
  FRAMING_NOTE,
  LOGISTICS_STAGES,
  MEMBERSHIP,
  PILLARS,
  PRODUCT_LINES,
} from "@/lib/constants";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,168,83,0.15),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(45,106,79,0.12),transparent_50%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full bg-green/10 px-4 py-1.5 text-sm font-semibold text-green">
            Opening Soon in Texas
          </span>
          <h1 className="mt-6 font-serif text-4xl font-semibold leading-tight text-soil sm:text-6xl">
            Member-Owned. FPO-Connected. Middlemen-Free.
          </h1>
          <p className="mt-6 text-xl text-soil/75">
            A consumer cooperative linking Indian diaspora households directly with
            Farmer Producer Organizations in India — for safe, traceable, culturally
            authentic food.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4">
            <Link
              href="/join"
              className="inline-block rounded-full bg-saffron px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-saffron/90"
            >
              Become a Member — ${MEMBERSHIP.joiningFee}
            </Link>
          </div>
          <p className="mt-4 text-sm text-soil/60">
            ${MEMBERSHIP.joiningFee} one-time joining fee · One member, one vote
          </p>
          <OtherMembershipNote className="mx-auto mt-3 max-w-md text-center" />
        </div>
      </section>

      <section className="border-b border-gold/20 bg-white px-4 py-8 sm:px-6">
        <p className="mx-auto max-w-4xl text-center text-sm leading-relaxed text-soil/70 italic">
          {FRAMING_NOTE}
        </p>
      </section>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {PILLARS.map((pillar) => (
            <PillarCard key={pillar.title} {...pillar} />
          ))}
        </div>
      </section>

      <section className="border-y border-gold/20 bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-3xl font-semibold text-soil">
            From FPO to Your Table
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {LOGISTICS_STAGES.map((item) => (
              <div key={item.stage} className="rounded-2xl border border-gold/15 bg-cream/40 p-5">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green text-sm font-bold text-cream">
                  {item.stage}
                </span>
                <h3 className="mt-4 font-serif text-lg font-semibold text-soil">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-soil/70">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-3xl font-semibold text-soil">
            Phase 1 Product Lines
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCT_LINES.map((product) => (
              <article
                key={product.name}
                className="rounded-xl border border-gold/20 bg-white p-5 shadow-sm"
              >
                <h3 className="font-semibold text-soil">{product.name}</h3>
                <p className="mt-1 text-xs font-medium text-green">{product.region}</p>
                <p className="mt-2 text-sm text-terracotta">{product.price}</p>
                <p className="mt-1 text-xs text-soil/60">{product.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border-2 border-green/30 p-8">
            <h2 className="font-serif text-2xl font-semibold text-soil">
              Membership — ${MEMBERSHIP.joiningFee}
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-soil/75">
              {MEMBERSHIP.benefits.slice(0, 4).map((b) => (
                <li key={b}>✓ {b}</li>
              ))}
            </ul>
            <Link href="/membership" className="mt-6 inline-block text-sm font-semibold text-green hover:underline">
              Full membership details →
            </Link>
            <Link
              href="/join"
              className="mt-4 block rounded-full bg-saffron px-6 py-3 text-center text-sm font-semibold text-white hover:bg-saffron/90"
            >
              Join Now
            </Link>
            <OtherMembershipNote className="mt-6 border-t border-gold/15 pt-6" />
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-3xl font-semibold text-soil">
            FPO Partners
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {FARMER_PARTNERS.map((farmer) => (
              <FarmerCard key={farmer.name} {...farmer} />
            ))}
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
