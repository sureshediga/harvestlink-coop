import { INVESTOR, MANUAL_PAYMENT } from "@/lib/constants";

type OtherMembershipNoteProps = {
  className?: string;
  variant?: "light" | "dark";
};

export function OtherMembershipNote({
  className = "",
  variant = "light",
}: OtherMembershipNoteProps) {
  const phoneHref = `tel:+1${MANUAL_PAYMENT.zellePhone.replace(/\D/g, "")}`;
  const toneClass =
    variant === "dark"
      ? "text-cream/90 [&_a]:text-gold"
      : "text-soil/80 [&_a]:text-green";

  return (
    <p
      className={`text-base leading-relaxed sm:text-lg ${toneClass} ${className}`.trim()}
    >
      <span className="inline">
        Members investing USD {INVESTOR.minimumVotingAmount.toLocaleString()} or
        more receive voting rights and dividends proportional to their
        investment. To discuss investment, please call{" "}
        <a
          href={phoneHref}
          className="inline whitespace-nowrap font-semibold hover:underline"
        >
          {MANUAL_PAYMENT.zellePhone}
        </a>
        .
      </span>
    </p>
  );
}
