import Link from "next/link";
import { Logo } from "./Logo";
import { OtherMembershipNote } from "./OtherMembershipNote";
import { MEMBERSHIP, NAV_LINKS, SITE } from "@/lib/constants";
import { MANUAL_PAYMENT } from "@/lib/manual-payment";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gold/20 bg-soil text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <Logo className="[&_span]:text-cream" />
          <p className="mt-4 text-sm leading-relaxed text-cream/80">
            {SITE.tagline}
          </p>
          <p className="mt-2 text-sm text-cream/60">
            Registered cooperative in Ohio, USA
          </p>
        </div>

        <div>
          <h3 className="font-serif text-lg font-semibold">Explore</h3>
          <ul className="mt-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-cream/80 transition hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/vision"
                className="text-sm text-cream/80 transition hover:text-gold"
              >
                Our Vision
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-lg font-semibold">Contact</h3>
          <p className="mt-4 text-sm text-cream/80">
            Email:{" "}
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="text-gold hover:underline"
            >
              {SITE.contactEmail}
            </a>
          </p>
          <p className="mt-4 text-sm text-cream/80">
            Phone:{" "}
            <a
              href={`tel:+1${MANUAL_PAYMENT.zellePhone.replace(/\D/g, "")}`}
              className="text-gold hover:underline"
            >
              {MANUAL_PAYMENT.zellePhone}
            </a>
          </p>
          <div className="mt-6">
            <Link
              href="/join"
              className="inline-block rounded-full bg-saffron px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-saffron/90"
            >
              Join — ${MEMBERSHIP.joiningFee}
            </Link>
            <OtherMembershipNote variant="dark" className="mt-4" />
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10 py-4 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
      </div>
    </footer>
  );
}
