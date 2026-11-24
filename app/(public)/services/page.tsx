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
      <section className="relative isolate overflow-hidden border-b bg-bench">
        <div className="pointer-events-none absolute -right-20 -top-32 -z-10 size-[28rem] rounded-full bg-accent/30 blur-3xl" aria-hidden />
        <div className="container py-12 md:py-16 lg:py-20">
          <h1 className="max-w-3xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Find a repair service
            <span className="mt-1 block text-primary">that fits your needs.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Search trusted local technicians, compare your options, and choose the right repair for your device or home.
          </p>
        </div>
      </section>

      <section id="services" className="container scroll-mt-24 py-10 md:py-14">
        <Suspense>
          <ServiceFilters />
        </Suspense>

        <div className="mb-6 mt-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Available services</p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight">
              {params.category ? `${params.category} repairs` : "Explore repair services"}
            </h2>
          </div>
          <p className="rounded-full border bg-card px-3.5 py-2 text-sm text-muted-foreground" aria-live="polite">
            Showing <span className="font-bold text-foreground">{services.length}</span> of{" "}
            <span className="font-bold text-foreground">{total}</span> services
          </p>
        </div>

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
