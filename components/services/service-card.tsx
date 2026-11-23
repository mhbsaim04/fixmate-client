import Link from "next/link";
import { Clock, MapPin, Store, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative">
        <ServiceImage src={service.image} alt={service.title} category={service.category} className="aspect-[4/3] w-full" />
        <Badge className={cn("absolute left-3 top-3 shadow-sm", tone)}>{service.category}</Badge>
        <span className="absolute bottom-3 right-3 rounded-lg bg-accent px-3 py-1.5 font-display text-sm font-extrabold text-accent-foreground shadow-md">
          From {formatCurrency(service.basePrice)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 min-h-[3.25rem] text-lg font-bold leading-snug">{service.title}</h3>

        <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <ModeIcon className="size-4 shrink-0" /> {service.serviceMode}
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" />
            <span className="truncate">{service.serviceArea}</span>
          </li>
          <li className="flex items-center gap-2">
            <Clock className="size-4 shrink-0" /> {service.estimatedDuration}
          </li>
        </ul>

        <div className="mt-4 flex items-center justify-between gap-3 border-t pt-4">
          <p className="min-w-0 truncate text-sm">
            <span className="text-muted-foreground">by </span>
            <span className="font-semibold">{service.technicianName}</span>
          </p>
          <RatingStars value={service.avgRating} count={service.reviewCount} />
        </div>

        <div className="mt-auto pt-5">
          <Button asChild variant="secondary" className="w-full">
            <Link href={`/services/${service._id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
