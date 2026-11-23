import { ServiceGridSkeleton } from "@/components/services/service-grid";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container py-16" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-10 w-80 max-w-full" />
      <Skeleton className="mt-4 h-5 w-96 max-w-full" />
      <div className="mt-10">
        <ServiceGridSkeleton />
      </div>
    </div>
  );
}
