import { ServiceCard } from "./service-card";
import type { Service } from "@/lib/types";

export function ServiceGrid({ services }: { services: Service[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {services.map((s) => (
        <ServiceCard key={s._id} service={s} />
      ))}
    </div>
  );
}

export function ServiceGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border bg-card">
          <div className="skeleton-shimmer aspect-[4/3] animate-shimmer bg-muted" />
          <div className="space-y-3 p-5">
            <div className="skeleton-shimmer h-5 w-4/5 animate-shimmer rounded bg-muted" />
            <div className="skeleton-shimmer h-4 w-2/3 animate-shimmer rounded bg-muted" />
            <div className="skeleton-shimmer h-4 w-1/2 animate-shimmer rounded bg-muted" />
            <div className="skeleton-shimmer mt-6 h-11 animate-shimmer rounded-lg bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
