import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Home, MapPin, ShieldCheck, Store, Wallet, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/ui/rating";
import { UserAvatar } from "@/components/ui/user-avatar";
import { RequestRepair } from "@/components/services/request-repair";
import { ServiceImage } from "@/components/services/service-image";
import { CATEGORY_META } from "@/lib/constants";
import { getService } from "@/lib/public-api";
import { cn, formatCurrency } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const service = await getService((await params).id);
  return { title: service?.title ?? "Service not found", description: service?.description.slice(0, 150) };
}

export default async function ServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await getService(id);
  if (!service || service.approvalStatus !== "approved" || !service.isAvailable) notFound();

  const ModeIcon = service.serviceMode === "Home Visit" ? Home : Store;
  const tech = service.technician ?? { name: service.technicianName, email: service.technicianEmail };
  const facts = [
    { icon: Clock, label: "Estimated time", value: service.estimatedDuration },
    { icon: ModeIcon, label: "Service mode", value: service.serviceMode },
    { icon: MapPin, label: "Area covered", value: service.serviceArea },
  ];

  return (
    <div className="container py-8 md:py-12">
      <Link href="/services" className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ChevronLeft className="size-4" /> All services
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <ServiceImage
            src={service.image}
            alt={service.title}
            category={service.category}
            priority
            sizes="(min-width:1024px) 60vw, 100vw"
            className="aspect-[16/10] w-full rounded-2xl border"
          />

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Badge className={cn(CATEGORY_META[service.category]?.tone)}>{service.category}</Badge>
            <RatingStars value={service.avgRating} count={service.reviewCount} />
          </div>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight md:text-4xl">{service.title}</h1>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 rounded-xl border bg-card p-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted">
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="truncate text-sm font-semibold">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="mt-10 text-2xl font-bold">What&apos;s included</h2>
          <p className="mt-3 max-w-2xl whitespace-pre-line leading-relaxed text-muted-foreground">{service.description}</p>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Starting price</p>
            <p className="font-display text-4xl font-extrabold">{formatCurrency(service.basePrice)}</p>
            <p className="mt-1 text-xs text-muted-foreground">The technician confirms the final amount when the job is done.</p>
            <div className="mt-5">
              <RequestRepair service={service} />
            </div>
            <ul className="mt-5 space-y-2.5 border-t pt-5 text-sm text-muted-foreground">
              <li className="flex gap-2.5"><Wallet className="size-4 shrink-0 text-primary" /> Pay only after completion</li>
              <li className="flex gap-2.5"><ShieldCheck className="size-4 shrink-0 text-primary" /> Admin-approved listing</li>
            </ul>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <p className="mb-4 text-sm font-semibold text-muted-foreground">Your technician</p>
            <div className="flex items-center gap-4">
              <UserAvatar src={tech.image} name={tech.name} className="size-14 text-lg" />
              <div className="min-w-0">
                <p className="truncate font-bold">{tech.name}</p>
                {tech.area && (
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="size-3.5" /> {tech.area}
                  </p>
                )}
              </div>
            </div>
            {tech.bio && <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{tech.bio}</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}
