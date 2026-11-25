"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Calendar,
  Check,
  CheckCircle2,
  CreditCard,
  Download,
  MapPin,
  Pause,
  Play,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  Wallet,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RoleMode = "customer" | "technician";

interface StepDetail {
  number: string;
  icon: typeof Search;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  badge: string;
}

const CUSTOMER_STEPS: StepDetail[] = [
  {
    number: "01",
    icon: Search,
    title: "Find a verified service",
    subtitle: "Admin-reviewed specialists near you",
    description:
      "Explore transparent listings categorized by device, starting price, and customer ratings. Every listing is verified by our admin team before appearing.",
    highlights: ["Admin-approved technicians", "Transparent starting rates", "Verified reviews & ratings"],
    badge: "Step 1: Discover",
  },
  {
    number: "02",
    icon: Send,
    title: "Send a request in 60s",
    subtitle: "Share your device issue with zero deposit",
    description:
      "Tell the technician what is broken, your preferred repair date, and whether you prefer home visit or shop drop-off. No credit card required upfront.",
    highlights: ["$0 upfront deposit", "Home visit or drop-off", "Free cancellation while waiting"],
    badge: "Step 2: Book",
  },
  {
    number: "03",
    icon: Wrench,
    title: "Track repair in real-time",
    subtitle: "Watch every stage unfold with live notes",
    description:
      "Follow your repair across 5 clear stages: Requested, Accepted, In Progress, Completed, and Paid. Receive transparent updates without calling or guessing.",
    highlights: ["5-stage live status tracker", "Direct technician updates", "Estimated completion time"],
    badge: "Step 3: Track",
  },
  {
    number: "04",
    icon: CreditCard,
    title: "Pay only after completion",
    subtitle: "Settle via Stripe once you inspect the fix",
    description:
      "You are charged only when the technician marks the job completed and you are satisfied. Settle the final amount securely via Stripe and download a PDF invoice.",
    highlights: ["Stripe secure checkout", "Itemized final amount", "Instant PDF tax invoice"],
    badge: "Step 4: Settle",
  },
];

const TECHNICIAN_STEPS: StepDetail[] = [
  {
    number: "01",
    icon: Tag,
    title: "List your repair services",
    subtitle: "Showcase skills with custom rates",
    description:
      "Create high-converting listings with cover images, category tags, starting prices, and service modes. Admins review and approve to maintain platform quality.",
    highlights: ["Admin quality stamp", "Flexible starting prices", "Home visit & shop options"],
    badge: "Step 1: List",
  },
  {
    number: "02",
    icon: CheckCircle2,
    title: "Accept or decline jobs",
    subtitle: "Choose requests that fit your schedule",
    description:
      "Review incoming customer requests with device details, location, and preferred dates. Accept jobs you want and decline those that don't fit with one click.",
    highlights: ["Customer issue details", "No forced commissions", "Direct schedule matching"],
    badge: "Step 2: Decide",
  },
  {
    number: "03",
    icon: Wrench,
    title: "Execute & advance status",
    subtitle: "Keep customers happy with clear updates",
    description:
      "Update status as you diagnose and fix the device. Set the transparent final amount reflecting parts and labor once the work is successfully done.",
    highlights: ["One-click milestone updates", "Set accurate final price", "Transparent repair log"],
    badge: "Step 3: Repair",
  },
  {
    number: "04",
    icon: Wallet,
    title: "Guaranteed direct payouts",
    subtitle: "Safe, frictionless settlement via Stripe",
    description:
      "Once the customer reviews and settles the invoice, your earnings are routed securely to your account. Collect 5-star ratings that bring more customers.",
    highlights: ["Zero chargeback anxiety", "Automated Stripe payouts", "Build verified reputation"],
    badge: "Step 4: Earn",
  },
];

export function HowItWorks({
  id = "how-it-works-section",
  className,
  defaultRole = "customer",
  showHeading = true,
}: {
  id?: string;
  className?: string;
  defaultRole?: RoleMode;
  showHeading?: boolean;
}) {
  const [role, setRole] = useState<RoleMode>(defaultRole);
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = role === "customer" ? CUSTOMER_STEPS : TECHNICIAN_STEPS;
  const current = steps[activeStep] ?? steps[0];

  // Auto-play stepper when isPlaying is enabled
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  return (
    <section id={id} className={cn("section-pad border-y bg-card relative overflow-hidden", className)}>
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute -left-40 top-1/4 -z-10 size-[32rem] rounded-full bg-accent/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-40 bottom-1/4 -z-10 size-[32rem] rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />

      <div className="container">
        {showHeading && (
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold text-primary">
                <Sparkles className="size-3.5" /> Interactive Workflow
              </div>
              <h2 className="section-title mt-3">How FixMate works</h2>
              <p className="section-lead">
                A modern repair workflow engineered for trust. Follow every stage from diagnostic to final payment.
              </p>
            </div>

            {/* Role switch pill */}
            <div className="flex items-center gap-1 rounded-2xl border bg-muted/60 p-1.5 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setRole("customer");
                  setActiveStep(0);
                }}
                className={cn(
                  "relative rounded-xl px-4 py-2 text-xs font-bold transition-all sm:text-sm",
                  role === "customer"
                    ? "bg-secondary text-secondary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                For Customers
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("technician");
                  setActiveStep(0);
                }}
                className={cn(
                  "relative rounded-xl px-4 py-2 text-xs font-bold transition-all sm:text-sm",
                  role === "technician"
                    ? "bg-secondary text-secondary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                For Technicians
              </button>
            </div>
          </div>
        )}

        {/* Step progression bar on mobile & tablet */}
        <div className="mt-8 flex items-center justify-between gap-2 border-b pb-4 sm:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Stage {activeStep + 1} of {steps.length}
          </span>
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveStep(i)}
                aria-label={`Go to step ${i + 1}`}
                className={cn(
                  "size-2.5 rounded-full transition-all",
                  i === activeStep ? "w-6 bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground",
                )}
              />
            ))}
          </div>
        </div>

        {/* Desktop interactive step cards grid */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === activeStep;
            return (
              <button
                key={s.title}
                type="button"
                onClick={() => {
                  setActiveStep(i);
                  setIsPlaying(false);
                }}
                className={cn(
                  "group relative flex flex-col items-start rounded-2xl border p-5 text-left transition-all duration-300",
                  isActive
                    ? "border-primary/50 bg-background shadow-lg shadow-primary/5 ring-2 ring-primary/20"
                    : "border-border/70 bg-card/60 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-card",
                )}
              >
                {/* Active indicator badge */}
                {isActive && (
                  <span className="absolute right-4 top-4 flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-primary" />
                  </span>
                )}

                <div className="flex w-full items-center justify-between gap-2">
                  <span
                    className={cn(
                      "grid size-12 place-items-center rounded-xl font-bold transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  <span className="font-display text-2xl font-black text-muted-foreground/30">{s.number}</span>
                </div>

                <h3 className={cn("mt-4 text-base font-bold transition-colors", isActive ? "text-primary" : "text-foreground")}>
                  {s.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{s.subtitle}</p>

                <div className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                  <span>{isActive ? "Active View" : "Click to inspect"}</span>
                  <ArrowRight className={cn("size-3 transition-transform", isActive ? "translate-x-1" : "group-hover:translate-x-0.5")} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Deep-Dive Preview Stage */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-border/80 bg-background shadow-xl">
          {/* Header controls bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-muted/30 px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                {current.badge}
              </span>
              <span className="text-xs font-medium text-muted-foreground hidden sm:inline">
                Interactive simulator preview
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
                title={isPlaying ? "Pause autoplay" : "Autoplay walkthrough"}
              >
                {isPlaying ? <Pause className="size-3.5 text-amber-500" /> : <Play className="size-3.5 text-emerald-500" />}
                <span>{isPlaying ? "Pause Tour" : "Autoplay"}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveStep((prev) => (prev - 1 + steps.length) % steps.length)}
                className="grid size-8 place-items-center rounded-lg border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Previous step"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                className="grid size-8 place-items-center rounded-lg border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Next step"
              >
                →
              </button>
            </div>
          </div>

          {/* Main stage body: Left details + Right live interactive simulation */}
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-12 lg:p-10">
            {/* Left side: In-depth step explanation */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <span>Phase {current.number}</span>
                <span>•</span>
                <span>{role === "customer" ? "Customer Experience" : "Technician Workflow"}</span>
              </div>

              <h3 className="mt-2 text-2xl font-extrabold sm:text-3xl">{current.title}</h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">{current.description}</p>

              <div className="mt-6 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-foreground/80">Key Guarantees & Features</p>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {current.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2.5 rounded-xl border bg-card/60 p-2.5 text-xs font-semibold">
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                {role === "customer" ? (
                  <>
                    <Button asChild size="default" className="rounded-xl">
                      <Link href="/services">
                        Find a Technician <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="default" className="rounded-xl">
                      <Link href="/sign-up">Create Free Account</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild size="default" className="rounded-xl">
                      <Link href="/sign-up">
                        Join as Technician <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="default" className="rounded-xl">
                      <Link href="/about">Learn Platform Terms</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Right side: Live Simulated UI Card for this exact step */}
            <div className="relative">
              <div className="absolute -inset-2 rotate-1 rounded-3xl bg-accent/30 blur-sm" aria-hidden />
              <div className="relative overflow-hidden rounded-2xl border border-white/80 bg-card p-5 shadow-2xl dark:border-white/10 sm:p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${role}-${activeStep}`}
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.98 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {role === "customer" ? (
                      <CustomerStepSimulation stepIndex={activeStep} />
                    ) : (
                      <TechnicianStepSimulation stepIndex={activeStep} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// Interactive UI Simulations for Customer Journey
// -------------------------------------------------------------

function CustomerStepSimulation({ stepIndex }: { stepIndex: number }) {
  if (stepIndex === 0) {
    // Step 1: Discover
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
              <Search className="size-4" />
            </span>
            <div>
              <p className="text-xs font-bold">Search Services</p>
              <p className="text-[10px] text-muted-foreground">Dhaka & Nearby • 120+ active pros</p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
            Admin Approved
          </span>
        </div>

        {/* Mini Service Card */}
        <div className="rounded-xl border bg-muted/40 p-4 transition hover:border-primary/40">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-xl bg-accent/60 font-bold text-primary">
                <Wrench className="size-5" />
              </div>
              <div>
                <p className="text-sm font-bold">iPhone Display & Battery Replacement</p>
                <p className="text-xs text-muted-foreground">by Rafiqul Islam • Certified Apple Tech</p>
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 font-bold text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
              <Star className="size-3 fill-amber-500 text-amber-500" /> 4.9 (84 reviews)
            </span>
            <span className="rounded-md bg-background px-2 py-0.5 text-muted-foreground border">
              Shop Drop-off & Home Visit
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between border-t pt-3">
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Starting from</p>
              <p className="font-display text-lg font-black text-foreground">৳ 1,200</p>
            </div>
            <span className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm">
              Request Repair →
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-primary/5 p-2.5 text-xs text-muted-foreground">
          <BadgeCheck className="size-4 shrink-0 text-primary" />
          <span>Every technician passes identity verification and background review.</span>
        </div>
      </div>
    );
  }

  if (stepIndex === 1) {
    // Step 2: Request
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
              <Send className="size-4" />
            </span>
            <div>
              <p className="text-xs font-bold">Booking Request</p>
              <p className="text-[10px] text-muted-foreground">Zero credit card charge today</p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-600">
            $0 Due Now
          </span>
        </div>

        <div className="space-y-3 rounded-xl border bg-muted/30 p-3.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Service:</span>
            <span className="font-bold">MacBook Pro Liquid Damage Diagnosis</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Preferred Date:</span>
            <span className="inline-flex items-center gap-1 font-semibold">
              <Calendar className="size-3.5 text-primary" /> Tomorrow, 2:00 PM
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Location Mode:</span>
            <span className="inline-flex items-center gap-1 font-semibold">
              <MapPin className="size-3.5 text-primary" /> Home Visit (Banani, Dhaka)
            </span>
          </div>
          <div className="rounded-lg bg-background p-2.5 border text-muted-foreground">
            <span className="font-semibold text-foreground">Issue:</span> &quot;Keyboard backlight flickers and trackpad doesn&apos;t click after coffee spill.&quot;
          </div>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
            Pay-After-Service Guarantee Active
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            You pay only after the device is returned, tested, and marked complete.
          </p>
        </div>
      </div>
    );
  }

  if (stepIndex === 2) {
    // Step 3: Track
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex size-3">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex size-3 rounded-full bg-amber-500" />
            </span>
            <div>
              <p className="text-xs font-bold">Live Status: In Progress</p>
              <p className="text-[10px] text-muted-foreground">Ticket #FX-8842 • iPhone 13</p>
            </div>
          </div>
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
            Step 3 of 5
          </span>
        </div>

        {/* Interactive mini timeline */}
        <div className="rounded-xl border bg-muted/30 p-4 space-y-3">
          {[
            { label: "Request Sent", done: true, time: "Yesterday, 10:15 AM" },
            { label: "Accepted by Technician", done: true, time: "Yesterday, 11:30 AM" },
            { label: "Repair In Progress", current: true, time: "Today, 9:45 AM" },
            { label: "Completed & Ready", done: false, time: "Pending final test" },
            { label: "Paid with Stripe", done: false, time: "Awaiting completion" },
          ].map((item, idx) => (
            <div key={item.label} className="flex items-start gap-3 text-xs">
              <span
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full text-[10px] font-bold",
                  item.done
                    ? "bg-emerald-500 text-white"
                    : item.current
                      ? "bg-amber-500 text-white animate-pulse"
                      : "bg-muted-foreground/20 text-muted-foreground",
                )}
              >
                {item.done ? "✓" : idx + 1}
              </span>
              <div className="flex-1">
                <p className={cn("font-bold", item.current && "text-amber-600 dark:text-amber-400")}>
                  {item.label}
                </p>
                <p className="text-[10px] text-muted-foreground">{item.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-card border p-3 text-xs">
          <p className="font-bold flex items-center gap-1.5 text-foreground">
            <Wrench className="size-3.5 text-primary" /> Technician Note:
          </p>
          <p className="mt-1 text-muted-foreground leading-relaxed">
            &quot;Original OLED display module calibrated. Running 30-minute burn-in diagnostics now.&quot;
          </p>
        </div>
      </div>
    );
  }

  // Step 4: Pay
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
            <CreditCard className="size-4" />
          </span>
          <div>
            <p className="text-xs font-bold">Repair Complete • Ready to Settle</p>
            <p className="text-[10px] text-muted-foreground">Stripe 256-bit encrypted checkout</p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
          Ready
        </span>
      </div>

      <div className="rounded-xl border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between border-b pb-2 text-xs">
          <span className="text-muted-foreground">Original starting quote:</span>
          <span>৳ 2,500</span>
        </div>
        <div className="flex items-center justify-between border-b pb-2 text-xs">
          <span className="text-muted-foreground">Parts (OEM Screen) + Labor:</span>
          <span>৳ 2,800</span>
        </div>
        <div className="flex items-center justify-between font-bold text-sm">
          <span>Final Approved Amount:</span>
          <span className="font-display text-lg text-emerald-600 dark:text-emerald-400">৳ 2,800</span>
        </div>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-md transition hover:bg-primary/90"
        >
          <CreditCard className="size-4" /> Pay with Stripe Checkout
        </button>
        <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
          <Download className="size-3 text-primary" />
          <span>Includes downloadable itemized PDF invoice</span>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Interactive UI Simulations for Technician Journey
// -------------------------------------------------------------

function TechnicianStepSimulation({ stepIndex }: { stepIndex: number }) {
  if (stepIndex === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
              <Tag className="size-4" />
            </span>
            <div>
              <p className="text-xs font-bold">Create Service Listing</p>
              <p className="text-[10px] text-muted-foreground">Set your terms and starting rate</p>
            </div>
          </div>
          <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-bold text-violet-800 dark:bg-violet-500/20 dark:text-violet-300">
            Technician Studio
          </span>
        </div>

        <div className="rounded-xl border bg-muted/40 p-4 space-y-3 text-xs">
          <div>
            <label className="text-[11px] font-bold text-muted-foreground">Service Title</label>
            <p className="font-bold text-foreground mt-0.5">Gaming Console & PS5 HDMI Port Repair</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-muted-foreground">Category</label>
              <p className="font-semibold text-foreground mt-0.5">Laptop & PC / Electronics</p>
            </div>
            <div>
              <label className="text-[11px] font-bold text-muted-foreground">Starting Price</label>
              <p className="font-display font-black text-foreground mt-0.5">৳ 3,000</p>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-bold text-muted-foreground">Service Options</label>
            <div className="mt-1 flex gap-2">
              <span className="rounded-md bg-background px-2 py-1 border text-[11px] font-semibold">
                ✓ Shop Drop-off
              </span>
              <span className="rounded-md bg-background px-2 py-1 border text-[11px] font-semibold">
                ✓ Home Visit
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-2.5 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
          <ShieldCheck className="size-4 shrink-0" />
          <span>Listing reviewed and approved by Admin within 2-4 hours.</span>
        </div>
      </div>
    );
  }

  if (stepIndex === 1) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
              <CheckCircle2 className="size-4" />
            </span>
            <div>
              <p className="text-xs font-bold">New Booking Request</p>
              <p className="text-[10px] text-muted-foreground">Received 12 mins ago</p>
            </div>
          </div>
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
            Pending Review
          </span>
        </div>

        <div className="rounded-xl border bg-card p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-foreground">Customer: Tanvir Hasan</span>
            <span className="text-muted-foreground">Dhanmondi, Dhaka</span>
          </div>
          <p className="rounded-lg bg-muted/50 p-2.5 text-muted-foreground">
            &quot;Inverter AC compressor not kicking in. Fan turns on but no cool air. Needs gas check and capacitor inspection.&quot;
          </p>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Requested slot:</span>
            <span className="font-bold text-foreground">Friday, 11:00 AM</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
          >
            Accept Request
          </button>
          <button
            type="button"
            className="rounded-xl border bg-card py-2.5 text-xs font-bold text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            Decline
          </button>
        </div>
      </div>
    );
  }

  if (stepIndex === 2) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
              <Wrench className="size-4" />
            </span>
            <div>
              <p className="text-xs font-bold">Active Repair Workbench</p>
              <p className="text-[10px] text-muted-foreground">Job #8842 • Tanvir Hasan</p>
            </div>
          </div>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
            In Progress
          </span>
        </div>

        <div className="rounded-xl border bg-muted/30 p-3.5 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Change Status:</span>
            <span className="rounded-lg bg-emerald-600 text-white font-bold px-2.5 py-1">
              Mark as Completed
            </span>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-muted-foreground">Set Final Bill Amount (৳)</label>
            <div className="flex items-center rounded-lg border bg-background px-3 py-1.5 font-display font-bold text-foreground">
              <span>৳ 3,200</span>
              <span className="ml-auto text-[10px] font-normal text-muted-foreground">(Parts + Gas + Labor)</span>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          Setting completion triggers the customer&apos;s secure payment button instantly.
        </p>
      </div>
    );
  }

  // Technician Step 4: Payout
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
            <Wallet className="size-4" />
          </span>
          <div>
            <p className="text-xs font-bold">Payment Settled</p>
            <p className="text-[10px] text-muted-foreground">Stripe Connect Transfer</p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
          Paid Out
        </span>
      </div>

      <div className="rounded-xl border bg-card p-4 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Total Customer Payment:</span>
          <span className="font-bold">৳ 3,200</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Platform Fee (5%):</span>
          <span className="text-muted-foreground">- ৳ 160</span>
        </div>
        <div className="flex items-center justify-between border-t pt-2 text-sm font-bold">
          <span>Net Payout to Your Bank:</span>
          <span className="font-display text-emerald-600 dark:text-emerald-400">৳ 3,040</span>
        </div>
      </div>

      <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs">
        <div className="flex items-center gap-1.5 text-amber-500 font-bold">
          <Star className="size-3.5 fill-amber-500 text-amber-500" />
          <Star className="size-3.5 fill-amber-500 text-amber-500" />
          <Star className="size-3.5 fill-amber-500 text-amber-500" />
          <Star className="size-3.5 fill-amber-500 text-amber-500" />
          <Star className="size-3.5 fill-amber-500 text-amber-500" />
          <span className="text-foreground ml-1 font-semibold">&quot;Super fast diagnosis and clean work!&quot;</span>
        </div>
      </div>
    </div>
  );
}
