import Link from "next/link";
import { MEMBERSHIP } from "@/lib/constants";

type CTABandProps = {
  title?: string;
  description?: string;
  buttonText?: string;
  href?: string;
};

export function CTABand({
  title = "Join the Movement",
  description = "Be part of a cooperative that puts farmers first, consumers first, and community first.",
  buttonText = `Become a Member — $${MEMBERSHIP.joiningFee}`,
  href = "/join",
}: CTABandProps) {
  return (
    <section className="bg-green px-4 py-16 text-cream sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-serif text-3xl font-semibold sm:text-4xl">{title}</h2>
        <p className="mt-4 text-lg text-cream/90">{description}</p>
        <Link
          href={href}
          className="mt-8 inline-block rounded-full bg-saffron px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-saffron/90"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
}
