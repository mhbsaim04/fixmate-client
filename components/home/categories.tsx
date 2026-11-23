import Link from "next/link";
import { CATEGORIES, CATEGORY_META } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Categories() {
  return (
    <section className="section-pad container">
      <h2 className="section-title">Pick what&apos;s broken</h2>
      <p className="section-lead">Seven repair categories. Tap one to see only the matching services.</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((name) => {
          const { icon: Icon, blurb, tone } = CATEGORY_META[name];
          return (
            <Link
              key={name}
              href={`/services?category=${encodeURIComponent(name)}`}
              className="group flex items-center gap-4 rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-secondary hover:shadow-[4px_4px_0_0_hsl(var(--secondary))] dark:hover:border-primary dark:hover:shadow-[4px_4px_0_0_hsl(var(--primary))]"
            >
              <span className={cn("grid size-14 shrink-0 place-items-center rounded-xl transition-transform group-hover:-rotate-6", tone)}>
                <Icon className="size-7" />
              </span>
              <span className="min-w-0">
                <span className="block font-bold">{name}</span>
                <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{blurb}</span>
              </span>
            </Link>
          );
        })}
        <Link
          href="/services"
          className="flex items-center justify-center rounded-2xl border-2 border-dashed p-5 text-sm font-bold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          See every service
        </Link>
      </div>
    </section>
  );
}
