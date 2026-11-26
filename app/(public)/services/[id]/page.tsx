import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  Home,
  MapPin,
  ShieldCheck,
  Store,
  Wallet,
  ChevronRight,
  Star,
  Wrench,
  Sparkles,
  Zap,
  Award,
  Check,
  CalendarCheck,
  FileText,
  BadgeCheck,
  Headphones,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { RequestRepair } from "@/components/services/request-repair";
import { ServiceImage } from "@/components/services/service-image";
import { ServiceCard } from "@/components/services/service-card";
import { ServiceDetailsReviews } from "@/components/services/service-details-reviews";
import { ServiceActionBar } from "@/components/services/service-action-bar";
import { ServiceFaq } from "@/components/services/service-faq";
import { CATEGORY_META } from "@/lib/constants";
import { getService, getServices } from "@/lib/public-api";
import { cn, formatCurrency } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const service = await getService((await params).id);
  return {
    title: service ? `${service.title} | FixMate Repair Services` : "Service not found",
    description: service?.description.slice(0, 160) ?? "Professional doorstep repair and servicing with FixMate.",
  };
}

export default async function ServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await getService(id);
  if (!service || service.approvalStatus !== "approved" || !service.isAvailable) notFound();

  // Fetch related services in the same category
  const relatedResp = await getServices({ category: service.category, limit: 4 });
  const relatedServices = (relatedResp.services || []).filter((s) => s._id !== service._id).slice(0, 3);

  const ModeIcon = service.serviceMode === "Home Visit" ? Home : Store;
  const CategoryIcon = CATEGORY_META[service.category]?.icon ?? Wrench;
  const tech = service.technician ?? { name: service.technicianName, email: service.technicianEmail };

  const keyFacts = [
    {
      icon: Clock,
      label: "Estimated duration",
      value: service.estimatedDuration,
      subtext: "Standard turnaround time",
    },
    {
      icon: ModeIcon,
      label: "Service mode",
      value: service.serviceMode,
      subtext: service.serviceMode === "Home Visit" ? "At your doorstep" : "Visit partner center",
    },
    {
      icon: MapPin,
      label: "Service coverage",
      value: service.serviceArea,
      subtext: "Technician active zone",
    },
    {
      icon: ShieldCheck,
      label: "FixMate warranty",
      value: "30-Day Guarantee",
      subtext: "100% free fix if issue recurs",
    },
  ];

  const serviceFeatures = [
    {
      title: "Comprehensive Initial Diagnostics",
      description: "Thorough pre-repair testing to isolate the root problem before touching any parts.",
    },
    {
      title: "Tested & Genuine Spare Parts",
      description: "Only high-grade, compatible components with manufacturer durability standards.",
    },
    {
      title: "Live Post-Repair Testing Demo",
      description: "The specialist operates and validates the unit in front of you before marking it complete.",
    },
    {
      title: "30-Day Free Workmanship Warranty",
      description: "If the exact same problem reappears within 30 days, follow-up labor is completely free.",
    },
    {
      title: "Digital Itemized Receipt & PDF Invoice",
      description: "Instant official invoice download for personal tracking or reimbursement.",
    },
  ];

  const repairSteps = [
    {
      step: "01",
      title: "Submit Repair Request",
      desc: "Pick your preferred date, address, and describe your device issue in seconds.",
    },
    {
      step: "02",
      title: "Diagnostic & Estimate",
      desc: "Technician accepts your request and confirms the scope with transparent pricing.",
    },
    {
      step: "03",
      title: "Precision Servicing",
      desc: "Repaired safely with specialized tools, genuine components, and expert skill.",
    },
    {
      step: "04",
      title: "Demo & Pay Later",
      desc: "Verify your repaired device first. Pay only after you are 100% satisfied.",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top Breadcrumb & Action Navigation */}
      <div className="border-b border-border/60 bg-muted/20">
        <div className="container flex flex-wrap items-center justify-between gap-3 py-3.5">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="size-3.5" />
            <Link href="/services" className="hover:text-foreground">Services</Link>
            <ChevronRight className="size-3.5" />
            <Link
              href={`/services?category=${encodeURIComponent(service.category)}`}
              className="text-foreground hover:underline"
            >
              {service.category}
            </Link>
          </nav>

          <ServiceActionBar service={service} />
        </div>
      </div>

      <div className="container py-8 md:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
          {/* Main Content Column */}
          <main className="min-w-0">
            {/* Hero Image Showcase */}
            <div className="relative isolate overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm">
              <ServiceImage
                src={service.image}
                alt={service.title}
                category={service.category}
                priority
                sizes="(min-width:1024px) 65vw, 100vw"
                className="aspect-[16/10] w-full object-cover transition-transform duration-500 hover:scale-[1.01]"
              />

              {/* Floating Media Badges */}
              <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
                <Badge className={cn("shadow-sm font-semibold backdrop-blur-md", CATEGORY_META[service.category]?.tone)}>
                  <CategoryIcon className="size-3.5" /> {service.category}
                </Badge>
                <Badge className="bg-emerald-600/90 text-white shadow-sm backdrop-blur-md">
                  <ShieldCheck className="size-3.5" /> Admin Verified
                </Badge>
              </div>

              <div className="absolute bottom-4 right-4 hidden sm:flex items-center gap-1.5 rounded-full bg-background/90 px-3.5 py-1.5 text-xs font-bold text-foreground shadow-lg backdrop-blur-md">
                <Sparkles className="size-3.5 text-primary" /> 100% Satisfaction Guarantee
              </div>
            </div>

            {/* Service Header Info */}
            <div className="mt-6">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#reviews-section"
                  className="group inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-700 transition-colors hover:bg-amber-500/20 dark:text-amber-400"
                >
                  <Star className="size-3.5 fill-amber-500 text-amber-500" />
                  <span>{service.avgRating ? service.avgRating.toFixed(1) : "5.0"}</span>
                  <span className="font-normal text-muted-foreground group-hover:underline">
                    ({service.reviewCount || 3} reviews)
                  </span>
                </a>

                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  Available for booking
                </span>

                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3.5 text-primary" /> {service.serviceArea}
                </span>
              </div>

              <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
                {service.title}
              </h1>

              {/* Technician Snippet */}
              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-muted/40 p-3.5 sm:w-fit">
                <UserAvatar src={tech.image} name={tech.name} className="size-10" />
                <div className="text-xs">
                  <p className="font-semibold text-foreground">
                    Serviced by <span className="text-primary font-bold">{tech.name}</span>
                  </p>
                  <p className="text-muted-foreground">FixMate Certified Specialist • Quick response</p>
                </div>
              </div>
            </div>

            {/* Quick Key Facts Grid */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {keyFacts.map(({ icon: Icon, label, value, subtext }) => (
                <div
                  key={label}
                  className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm"
                >
                  <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <div className="mt-3">
                    <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
                    <p className="mt-0.5 truncate text-sm font-bold text-foreground">{value}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground/80">{subtext}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Service Scope & Description */}
            <div className="mt-10">
              <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl">
                Service Overview & Description
              </h2>
              <div className="prose prose-neutral mt-4 max-w-none text-muted-foreground dark:prose-invert">
                <p className="whitespace-pre-line leading-relaxed text-sm md:text-base">
                  {service.description}
                </p>
              </div>
            </div>

            {/* What's Included Card */}
            <div className="mt-10 rounded-3xl border border-border/80 bg-gradient-to-b from-card to-muted/20 p-6 md:p-8">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Award className="size-4" />
                </span>
                <h3 className="font-display text-xl font-bold tracking-tight">
                  What&apos;s Included With This Repair
                </h3>
              </div>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                Every repair completed on FixMate adheres to strict quality and transparency criteria.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {serviceFeatures.map((feat) => (
                  <div key={feat.title} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card/80 p-4">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                      <Check className="size-3 stroke-[3]" />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{feat.title}</h4>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{feat.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How Repair Works (4-Step Timeline) */}
            <div className="mt-12">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Zap className="size-4 text-primary" /> Simple & Transparent
              </div>
              <h3 className="mt-1.5 font-display text-xl font-bold tracking-tight md:text-2xl">
                How Your Repair Works
              </h3>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {repairSteps.map((s) => (
                  <div
                    key={s.step}
                    className="relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-4 transition-all hover:border-primary/30"
                  >
                    <div>
                      <span className="font-display text-2xl font-extrabold text-primary/40">{s.step}</span>
                      <h4 className="mt-2 text-sm font-bold text-foreground">{s.title}</h4>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comprehensive Technician Spotlight */}
            <div className="mt-12 rounded-3xl border border-border/80 bg-card p-6 shadow-sm md:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <UserAvatar src={tech.image} name={tech.name} className="size-16 text-xl shadow-md" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg font-bold sm:text-xl">{tech.name}</h3>
                      <Badge className="bg-primary/10 text-primary">
                        <BadgeCheck className="size-3.5" /> Verified Pro
                      </Badge>
                    </div>
                    {tech.area && (
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3.5 text-primary" /> Active in {tech.area}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">FixMate technician partner • Identity & background checked</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-2xl bg-muted/60 p-3 text-xs">
                  <div className="text-center px-3">
                    <p className="font-display text-lg font-extrabold text-foreground">100%</p>
                    <p className="text-[10px] text-muted-foreground">Job Verified</p>
                  </div>
                  <div className="h-8 w-px bg-border/60" />
                  <div className="text-center px-3">
                    <p className="font-display text-lg font-extrabold text-foreground">&lt; 15m</p>
                    <p className="text-[10px] text-muted-foreground">Avg Response</p>
                  </div>
                </div>
              </div>

              {tech.bio ? (
                <div className="mt-5 border-t border-border/60 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">About the Technician</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{tech.bio}</p>
                </div>
              ) : (
                <p className="mt-4 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                  {tech.name} is a certified repair specialist on FixMate dedicated to safe, high-quality, and transparent device repairs.
                </p>
              )}
            </div>

            {/* Customer Ratings & Comments Component */}
            <ServiceDetailsReviews service={service} />

            {/* Interactive FAQs Component */}
            <ServiceFaq />
          </main>

          {/* Sticky Booking Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
            {/* Main Booking Card */}
            <div className="overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-md transition-shadow hover:shadow-lg">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Starting from</span>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                  Pay After Fix
                </span>
              </div>

              <div className="mt-2 flex items-baseline gap-2">
                <p className="font-display text-4xl font-extrabold text-foreground">
                  {formatCurrency(service.basePrice)}
                </p>
                <span className="text-xs text-muted-foreground">estimated base</span>
              </div>

              <div className="mt-2 rounded-xl bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">
                <p className="font-medium text-foreground">Zero advance deposit required.</p>
                <p className="mt-0.5">The technician confirms final cost after on-site diagnostic. You pay only after successful completion.</p>
              </div>

              {/* Booking CTA Button */}
              <div className="mt-6">
                <RequestRepair service={service} />
              </div>

              {/* Confidence Checklist */}
              <div className="mt-6 space-y-3 border-t border-border/60 pt-5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-5 place-items-center rounded-full bg-primary/10 text-primary">
                    <Wallet className="size-3.5" />
                  </span>
                  <span>100% Secure payment via Stripe Checkout</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="grid size-5 place-items-center rounded-full bg-primary/10 text-primary">
                    <ShieldCheck className="size-3.5" />
                  </span>
                  <span>30-Day FixMate workmanship warranty</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="grid size-5 place-items-center rounded-full bg-primary/10 text-primary">
                    <CalendarCheck className="size-3.5" />
                  </span>
                  <span>Free cancellation before technician accepts</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="grid size-5 place-items-center rounded-full bg-primary/10 text-primary">
                    <FileText className="size-3.5" />
                  </span>
                  <span>Instant official downloadable PDF invoice</span>
                </div>
              </div>
            </div>

            {/* Need Assistance Card */}
            <div className="rounded-3xl border border-border/80 bg-muted/30 p-5 text-xs">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Headphones className="size-4 text-primary" /> Need assistance with this service?
              </div>
              <p className="mt-1 text-muted-foreground">
                Have questions before requesting? Our customer support is available 24/7 to help you book the right specialist.
              </p>
              <Button asChild variant="outline" size="sm" className="mt-3 w-full rounded-xl text-xs">
                <Link href="/about">Learn How FixMate Works</Link>
              </Button>
            </div>
          </aside>
        </div>

        {/* Related Services in Same Category */}
        {relatedServices.length > 0 && (
          <section className="mt-16 border-t border-border/70 pt-12">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Explore More</span>
                <h3 className="mt-1 font-display text-2xl font-bold tracking-tight">
                  More {service.category} Services
                </h3>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-xl">
                <Link href={`/services?category=${encodeURIComponent(service.category)}`}>
                  View all {service.category} <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedServices.map((item) => (
                <ServiceCard key={item._id} service={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
