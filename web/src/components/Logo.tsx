"use client";

import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/constants";

const LOGO_WIDTH = 1235;
const LOGO_HEIGHT = 1194;

type LogoProps = {
  className?: string;
  size?: "header" | "footer";
};

export function Logo({ className = "", size = "header" }: LogoProps) {
  const heightClass =
    size === "footer" ? "h-18 w-auto sm:h-22" : "h-10 w-auto sm:h-12";

  return (
    <Link
      href="/"
      className={`block shrink-0 leading-none transition-opacity hover:opacity-90 ${className}`}
    >
      <Image
        src="/logo.png"
        alt={`${SITE.legalName} logo`}
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        className={`block ${heightClass}`}
        style={{ width: "auto", height: "auto" }}
        priority={size === "header"}
        sizes={size === "footer" ? "260px" : "(max-width: 640px) 140px, 180px"}
      />
    </Link>
  );
}
