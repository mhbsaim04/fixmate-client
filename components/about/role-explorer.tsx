"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Clock,
  CreditCard,
  FileText,
  LayoutDashboard,
  Shield,
  ShieldCheck,
  Star,
  UserCheck,
  Users,
  Wallet,
  Wrench,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RoleContent {
  id: "customer" | "technician" | "admin";
  title: string;
  badge: string;
  subtitle: string;
  description: string;
  perks: { title: string; desc: string; icon: typeof Shield }[];
  mockup: {
    heading: string;
    sub: string;
    bullets: string[];
    stat: { label: string; value: string };
  };
  cta: { label: string; href: string };
}

const ROLES_DATA: RoleContent[] = [
  {
    id: "customer",
    title: "Customers",
    badge: "Device Owners",
    subtitle: "Get devices repaired with 100% peace of mind and zero advance risk.",
    description:
      "Whether it is an iPhone screen shattered before a flight, an AC blowing hot air in summer, or a dead work laptop, FixMate connects you with verified pros you can trust.",
    perks: [
      {
        title: "Pay strictly after completion",
        desc: "Your credit card is only billed via Stripe once the repair is tested and you confirm satisfaction.",
        icon: Wallet,
      },
      {
        title: "Live milestone tracking",
        desc: "Watch the repair progress through 5 verified checkpoints right on your personal dashboard.",
        icon: Clock,
      },
      {
        title: "Instant PDF invoices & receipts",
        desc: "One-click download of itemized invoices for company reimbursement or personal records.",
        icon: FileText,
      },
      {
        title: "Authentic reviews & ratings",
        desc: "Read unfiltered feedback left only by verified customers who booked and paid through FixMate.",
        icon: Star,
      },
    ],
    mockup: {
      heading: "Customer Dashboard Preview",
      sub: "Active Repair: MacBook Pro M1 14”",
      bullets: [
        "Stage: In Progress (Technician replacing MagSafe port)",
        "Service Mode: Shop Drop-off (Banani Center)",
        "Price Estimate: ৳ 2,400 (Starting rate confirmed)",
        "Current Status: Testing power delivery & battery cycle",
      ],
      stat: { label: "Security Status", value: "Pay Button Locked Until Done" },
    },
    cta: { label: "Find a Technician Now", href: "/services" },
  },
  {
    id: "technician",
    title: "Technicians",
    badge: "Skilled Specialists",
    subtitle: "Focus entirely on repairs while FixMate brings serious paying clients to your door.",
    description:
      "Say goodbye to customer haggling, chasing unpaid bills, or dealing with no-shows. Build a verified digital reputation that turns your repair craftsmanship into a thriving business.",
    perks: [
      {
        title: "Guaranteed Stripe payouts",
        desc: "No counterfeit cash or awkward bargaining. Once the job is completed, funds flow directly into your account.",
        icon: CreditCard,
      },
      {
        title: "Freedom to accept or decline",
        desc: "Full autonomy over which requests you accept, your working hours, and whether you offer home visits.",
        icon: Zap,
      },
      {
        title: "Fair final price adjustments",
        desc: "Set the transparent final amount based on actual parts required after opening the device.",
        icon: Wrench,
      },
      {
        title: "Admin-verified badge status",
        desc: "Stand out with an official platform badge that proves your credentials and builds instant customer trust.",
        icon: BadgeCheck,
      },
    ],
    mockup: {
      heading: "Technician Workbench Preview",
      sub: "Incoming Job: Sony Bravia 55” LED TV",
      bullets: [
        "Issue: Vertical backlight distortion on HDMI 1",
        "Customer Location: Uttara Sector 4 (Home Visit)",
        "Action: [Accept Request] or [Decline]",
        "Workbench: Update status & set final itemized bill",
      ],
      stat: { label: "Platform Commission", value: "Flat Fair 5% (Stripe settled)" },
    },
    cta: { label: "Register as a FixMate Technician", href: "/sign-up" },
  },
  {
    id: "admin",
    title: "Platform Admins",
    badge: "Platform Guardians",
    subtitle: "Guarding ecosystem integrity, reviewing listings, and protecting every transaction.",
    description:
      "FixMate is not an open wild-west directory. Our dedicated admin team reviews every technician listing, validates service credentials, monitors bookings, and oversees disputes.",
    perks: [
      {
        title: "Manual service listing approval",
        desc: "Every new or edited service listing is inspected before it goes live to ensure accurate pricing and honest scopes.",
        icon: ShieldCheck,
      },
      {
        title: "User & role management",
        desc: "Promote verified technicians, moderate reviews, and ban malicious or delinquent actors swiftly.",
        icon: UserCheck,
      },
      {
        title: "Real-time booking oversight",
        desc: "Monitor booking health across Dhaka to ensure technicians respond promptly and complete jobs properly.",
        icon: LayoutDashboard,
      },
      {
        title: "Financial transparency audit",
        desc: "Live tracking of all Stripe checkout transactions, platform revenue, and payout balances.",
        icon: Shield,
      },
    ],
    mockup: {
      heading: "Admin Command Center Preview",
      sub: "Platform Health & Verification Queue",
      bullets: [
        "Pending Services: 4 listings awaiting quality review",
        "Live Bookings: 89 jobs currently in progress",
        "Dispute Rate: < 0.2% across 3,400+ completed repairs",
        "Audit Log: Automatic logging of every status transition",
      ],
      stat: { label: "Approval Requirement", value: "100% Pre-Screened Services" },
    },
    cta: { label: "Learn Platform Standards", href: "/about#faq-section" },
  },
];

export function RoleExplorer() {
  const [selectedRole, setSelectedRole] = useState<"customer" | "technician" | "admin">("customer");

  const active = ROLES_DATA.find((r) => r.id === selectedRole) ?? ROLES_DATA[0];

  return (
    <section id="roles-section" className="section-pad container">
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold text-primary">
          <Users className="size-3.5" /> Built For The Complete Ecosystem
        </div>
        <h2 className="section-title mt-3">Three roles. One cohesive platform.</h2>
        <p className="section-lead mx-auto">
          FixMate aligns the incentives of customers, technicians, and platform administrators so everyone wins.
        </p>
      </div>

      {/* Role Navigation Pills */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        {ROLES_DATA.map((r) => {
          const isSelected = r.id === selectedRole;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelectedRole(r.id)}
              className={cn(
                "rounded-2xl border px-6 py-3 text-sm font-bold transition-all shadow-sm",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground shadow-md"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              <span>{r.title}</span>
              <span
                className={cn(
                  "ml-2 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider font-extrabold",
                  isSelected ? "bg-white/20 text-white" : "bg-muted text-muted-foreground",
                )}
              >
                {r.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Role Showcase Display */}
      <div className="mt-8 overflow-hidden rounded-3xl border bg-card shadow-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:items-center"
          >
            {/* Left side: Role highlights */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">{active.badge} Spotlight</span>
              <h3 className="mt-1 font-display text-2xl font-bold sm:text-3xl text-foreground">{active.subtitle}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{active.description}</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {active.perks.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div key={p.title} className="rounded-xl border bg-muted/30 p-3.5 transition hover:border-primary/30">
                      <div className="flex items-center gap-2 text-foreground font-bold text-xs sm:text-sm">
                        <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="size-3.5" />
                        </span>
                        <span>{p.title}</span>
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center gap-3">
                <Button asChild size="lg" className="rounded-xl">
                  <Link href={active.cta.href}>
                    {active.cta.label} <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right side: Mockup Card */}
            <div className="relative">
              <div className="absolute -inset-2 rotate-1 rounded-3xl bg-primary/10 blur-sm" aria-hidden />
              <div className="relative overflow-hidden rounded-2xl border border-white/80 bg-background p-6 shadow-xl dark:border-white/10">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-primary">{active.mockup.heading}</h4>
                    <p className="text-sm font-bold text-foreground mt-0.5">{active.mockup.sub}</p>
                  </div>
                  <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                </div>

                <div className="mt-4 space-y-2.5">
                  {active.mockup.bullets.map((b) => (
                    <div key={b} className="flex items-start gap-2.5 rounded-lg border bg-card/60 p-2.5 text-xs">
                      <span className="grid size-4 shrink-0 place-items-center rounded-full bg-primary/10 text-[10px] font-bold text-primary mt-0.5">
                        ✓
                      </span>
                      <span className="text-foreground/90">{b}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-3 text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">{active.mockup.stat.label}</p>
                  <p className="font-display text-sm font-bold text-primary mt-0.5">{active.mockup.stat.value}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
