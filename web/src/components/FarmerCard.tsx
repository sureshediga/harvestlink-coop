type FarmerCardProps = {
  name: string;
  region: string;
  crops: string;
  story: string;
};

export function FarmerCard({ name, region, crops, story }: FarmerCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-gold/20 bg-white shadow-sm">
      <div className="h-32 bg-gradient-to-br from-green/20 via-gold/20 to-terracotta/20" />
      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-green">
          {region}
        </p>
        <h3 className="mt-2 font-serif text-xl font-semibold text-soil">{name}</h3>
        <p className="mt-1 text-sm font-medium text-terracotta">{crops}</p>
        <p className="mt-3 text-sm leading-relaxed text-soil/75">{story}</p>
      </div>
    </article>
  );
}
