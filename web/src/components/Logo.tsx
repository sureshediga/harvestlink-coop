"use client";

import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/constants";

type LogoProps = {
  showSubtitle?: boolean;
  className?: string;
};

export function Logo({ showSubtitle = false, className = "" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/logo.png"
        alt={`${SITE.legalName} logo`}
        width={48}
        height={48}
        className="h-10 w-10 rounded-full object-cover sm:h-12 sm:w-12"
        priority
      />
      <div className="leading-tight">
        <span className="font-serif text-lg font-semibold text-soil sm:text-xl">
          {SITE.name}
        </span>
        {showSubtitle && (
          <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-green">
            Cooperative
          </span>
        )}
      </div>
    </Link>
  );
}
