import Link from "next/link";
import { ArrowUpRight, Clock, Home, MapPin, ShieldCheck, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { RatingStars } from "@/components/ui/rating";
import { CATEGORY_META } from "@/lib/constants";
import { cn, formatCurrency } from "@/lib/utils";
import type { Service } from "@/lib/types";
import { ServiceImage } from "./service-image";

/** Fixed image ratio + flex column + mt-auto button = every card the same height and width. */
export function ServiceCard({ service }: { service: Service }) {
  const tone = CATEGORY_META[service.category]?.tone ?? "";
  const ModeIcon = service.serviceMode === "Home Visit" ? Home : Store;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl hover:shadow-secondary/10">
      <div className="relative isolate overflow-hidden">
        <ServiceImage src={service.image} alt={service.title} category={service.category} className="aspect-[4/3] w-full" />
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-t from-secondary/45 via-transparent to-secondary/10 opacity-70 transition-opacity duration-300 group-hover:opacity-100" aria-hidden />
        <Badge className={cn("absolute left-4 top-4 rounded-full px-3 py-1 shadow-sm", tone)}>{service.category}</Badge>
        <span className="absolute bottom-4 right-4 rounded-xl bg-accent px-3.5 py-2 font-display text-sm font-extrabold text-accent-foreground shadow-lg">
          From {formatCurrency(service.basePrice)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-5">
        <h3 className="line-clamp-2 min-h-[3.5rem] text-lg font-bold leading-snug tracking-tight">{service.title}</h3>

        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <ModeIcon className="size-4 shrink-0 text-primary" /> {service.serviceMode}
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-primary" />
            <span className="truncate">{service.serviceArea}</span>
          </li>
          <li className="flex items-center gap-2">
            <Clock className="size-4 shrink-0 text-primary" /> {service.estimatedDuration}
          </li>
        </ul>

        <div className="mt-4 flex items-center justify-between gap-3 border-t pt-4">
          <p className="flex min-w-0 items-center gap-1.5 truncate text-sm">
            <ShieldCheck className="size-4 shrink-0 text-emerald-600" aria-label="Admin-approved service" />
            <span className="truncate font-semibold">{service.technicianName}</span>
          </p>
          <RatingStars value={service.avgRating} count={service.reviewCount} />
        </div>

        <div className="mt-auto pt-5">
          <Link href={`/services/${service._id}`} className="uiverse-neon-button w-full">
            View details <ArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
