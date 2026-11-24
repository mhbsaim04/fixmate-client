export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-5 sm:mb-10">
      <div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">Your workspace</p>
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>}
      </div>
      {action}
    </div>
  );
}
