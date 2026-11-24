import Link from "next/link";
import { AlertTriangle, Inbox, RefreshCw, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  ctaHref,
  ctaLabel,
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed bg-card px-6 py-14 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-accent/90 text-accent-foreground dark:bg-accent/20 dark:text-accent">
        <Icon className="size-8" />
      </span>
      <h3 className="mt-5 text-xl font-bold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {ctaHref && ctaLabel && (
        <Button asChild className="mt-6">
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      )}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center">
      <AlertTriangle className="size-9 text-destructive" />
      <h3 className="mt-4 text-lg font-bold">We couldn&apos;t load this</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" className="mt-5" onClick={onRetry}>
          <RefreshCw /> Try again
        </Button>
      )}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 rounded-2xl border bg-card p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="size-12 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function StatsSkeleton({ count = 3, columns = 4 }: { count?: number; columns?: 3 | 4 }) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${columns === 3 ? "xl:grid-cols-3" : "xl:grid-cols-4"}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-2xl" />
      ))}
    </div>
  );
}
