type FoundingMemberBadgeProps = {
  memberNumber: string;
};

export function FoundingMemberBadge({ memberNumber }: FoundingMemberBadgeProps) {
  return (
    <div className="inline-flex flex-col items-center rounded-2xl border-2 border-gold bg-white px-8 py-6 shadow-md">
      <span className="text-4xl" aria-hidden="true">
        🌾
      </span>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-green">
        Founding Member
      </p>
      <p className="mt-2 font-serif text-2xl font-semibold text-soil">
        {memberNumber}
      </p>
    </div>
  );
}
