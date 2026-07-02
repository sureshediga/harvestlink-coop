"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";
import { MEMBERSHIP, NAV_LINKS } from "@/lib/constants";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gold/20 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo showSubtitle className="shrink-0" />

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-soil/80 transition hover:text-green"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/join"
            className="rounded-full bg-saffron px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-saffron/90"
          >
            Join — ${MEMBERSHIP.joiningFee}
          </Link>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/join"
            className="rounded-full bg-saffron px-3 py-2 text-xs font-semibold text-white sm:px-4 sm:text-sm"
          >
            Join — ${MEMBERSHIP.joiningFee}
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="rounded-lg border border-gold/30 p-2 text-soil"
          >
            <span className="block h-0.5 w-5 bg-soil" />
            <span className="mt-1 block h-0.5 w-5 bg-soil" />
            <span className="mt-1 block h-0.5 w-5 bg-soil" />
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-gold/20 bg-cream px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2 text-sm font-medium text-soil/80 hover:bg-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
