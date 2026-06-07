import Link from "next/link";
import { ReactNode } from "react";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="border-b border-gold/20 bg-white px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 font-serif text-4xl font-semibold text-soil sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-lg leading-relaxed text-soil/75">{description}</p>
        )}
        {children}
      </div>
    </section>
  );
}

type SectionProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Section({ title, children, className = "" }: SectionProps) {
  return (
    <section className={`px-4 py-14 sm:px-6 ${className}`}>
      <div className="mx-auto max-w-6xl">
        {title && (
          <h2 className="mb-8 font-serif text-3xl font-semibold text-soil">{title}</h2>
        )}
        {children}
      </div>
    </section>
  );
}

export function InlineCTA({ text = "Become a Founding Member" }: { text?: string }) {
  return (
    <div className="mt-10 text-center">
      <Link
        href="/join"
        className="inline-block rounded-full bg-saffron px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-saffron/90"
      >
        {text}
      </Link>
    </div>
  );
}
