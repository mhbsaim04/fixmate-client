import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/dashboard/states";
import { Pagination } from "@/components/services/pagination";
import { ServiceFilters } from "@/components/services/service-filters";
import { ServiceGrid } from "@/components/services/service-grid";
import { getServices } from "@/lib/public-api";

export const metadata: Metadata = {
  title: "Browse Services",
  description: "Search approved repair services by category, service mode and price.",
};

type SP = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function ServicesPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const params = {
    search: first(sp.search),
    category: first(sp.category),
    mode: first(sp.mode),
    sort: first(sp.sort),
  };
  const page = Math.max(1, Number(first(sp.page)) || 1);
  const { services, total, totalPages } = await getServices({ ...params, sort: params.sort ?? "newest", page, limit: 12 });

  return (
    <>
      <section className="bg-bench border-b">
        <div className="container py-12 md:py-16">
          <h1 className="section-title">Find a technician for what&apos;s broken</h1>
          <p className="section-lead">
            Every listing below has been approved by our admins. Search, filter and sort, then send a repair request.
          </p>
        </div>
      </section>

      <section className="container py-10">
        <Suspense>
          <ServiceFilters />
        </Suspense>

        <p className="mb-6 mt-8 text-sm text-muted-foreground" aria-live="polite">
          {total > 0 ? (
            <>
              Showing <span className="font-semibold text-foreground">{services.length}</span> of{" "}
              <span className="font-semibold text-foreground">{total}</span> services
              {params.category ? <> in {params.category}</> : null}
            </>
          ) : null}
        </p>

        {services.length > 0 ? (
          <>
            <ServiceGrid services={services} />
            <Pagination
              page={page}
              totalPages={totalPages}
              searchParams={{ ...params, sort: params.sort === "newest" ? undefined : params.sort }}
            />
          </>
        ) : (
          <EmptyState
            icon={SearchX}
            title="No services match yet"
            description="Try a different keyword, clear a filter, or check back soon as technicians add new listings."
            ctaHref="/services"
            ctaLabel="Clear all filters"
          />
        )}
      </section>
    </>
  );
}
