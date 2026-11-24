import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { cn } from "@/lib/utils";

const TONES = {
  blue: "bg-blue-50 text-blue-700 ring-blue-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  violet: "bg-violet-50 text-violet-700 ring-violet-100",
  rose: "bg-rose-50 text-rose-700 ring-rose-100",
};

export function StatsCard({
  label,
  value,
  icon: Icon,
  tone = "blue",
  hint,
  href,
  prefix,
  decimals,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  tone?: keyof typeof TONES;
  hint?: string;
  href?: string;
  prefix?: string;
  decimals?: number;
}) {
  const className =
    "group relative flex min-h-32 min-w-0 items-center gap-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

  const content = (
    <>
      <span className={cn("grid size-12 shrink-0 place-items-center rounded-2xl ring-1 transition-transform duration-200 group-hover:scale-105 sm:size-14", TONES[tone])}>
        <Icon className="size-6 sm:size-7" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 font-display text-3xl font-extrabold leading-tight tracking-tight">
          <AnimatedNumber value={value} prefix={prefix} decimals={decimals} />
        </p>
        {hint && <p className="truncate text-xs text-muted-foreground">{hint}</p>}
      </div>
      {href && <ArrowUpRight className="absolute right-4 top-4 size-4 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />}
    </>
  );

  return href ? (
    <Link href={href} className={className} aria-label={`${label}: ${prefix ?? ""}${value}. View details`}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}
