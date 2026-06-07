type PillarCardProps = {
  title: string;
  icon: string;
  description: string;
};

export function PillarCard({ title, icon, description }: PillarCardProps) {
  return (
    <article className="rounded-2xl border border-gold/20 bg-white p-6 shadow-sm">
      <div className="text-3xl" aria-hidden="true">
        {icon}
      </div>
      <h3 className="mt-4 font-serif text-xl font-semibold text-soil">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-soil/75">{description}</p>
    </article>
  );
}
