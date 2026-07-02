import { MANUAL_PAYMENT } from "@/lib/manual-payment";

type OtherMembershipNoteProps = {
  className?: string;
};

export function OtherMembershipNote({ className = "" }: OtherMembershipNoteProps) {
  const phoneHref = `tel:+1${MANUAL_PAYMENT.zellePhone.replace(/\D/g, "")}`;

  return (
    <p className={`text-sm leading-relaxed text-soil/70 ${className}`.trim()}>
      For other membership and investment opportunities, please call{" "}
      <a href={phoneHref} className="font-semibold text-green hover:underline">
        {MANUAL_PAYMENT.zellePhone}
      </a>
      .
    </p>
  );
}
