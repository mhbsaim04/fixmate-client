"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Scale,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonRow {
  category: "payment" | "tracking" | "pricing" | "trust";
  metric: string;
  fixmate: {
    status: "good";
    title: string;
    details: string;
  };
  traditional: {
    status: "bad";
    title: string;
    details: string;
  };
}

const COMPARISONS: ComparisonRow[] = [
  {
    category: "payment",
    metric: "Upfront Payment",
    fixmate: {
      status: "good",
      title: "৳ 0 Due Today (Pay After)",
      details: "No advance hostage deposit. You pay through Stripe only after the technician finishes the repair.",
    },
    traditional: {
      status: "bad",
      title: "50% to 100% Advance Deposit",
      details: "Most shops demand money before opening the device. If they can't fix it, refunds are notoriously difficult.",
    },
  },
  {
    category: "tracking",
    metric: "Repair Progress Updates",
    fixmate: {
      status: "good",
      title: "Live 5-Stage Digital Timeline",
      details: "Follow requested, accepted, in-progress, completed, and paid with real technician notes right in your dashboard.",
    },
    traditional: {
      status: "bad",
      title: "Zero Updates / Ghosting",
      details: "You are told 'we will call you.' Days pass with silence, forcing you to repeatedly phone or visit the shop.",
    },
  },
  {
    category: "pricing",
    metric: "Price Transparency",
    fixmate: {
      status: "good",
      title: "Starting Rate + Confirmed Final Bill",
      details: "Every service shows a verified starting price. The technician confirms parts & labor before completing the ticket.",
    },
    traditional: {
      status: "bad",
      title: "Surprise Charges at Counter",
      details: "Verbal estimates often balloon into double the price at pickup with mysterious unexplained 'part fees.'",
    },
  },
  {
    category: "trust",
    metric: "Technician Accountability",
    fixmate: {
      status: "good",
      title: "Admin-Vetted & Public Reviews",
      details: "Every service listing is manually reviewed and approved by admins. Authentic reviews cannot be faked.",
    },
    traditional: {
      status: "bad",
      title: "Anonymous & Unregulated",
      details: "No record of who touched your device, risk of part swapping, and no platform escalation if something breaks.",
    },
  },
  {
    category: "payment",
    metric: "Receipt & Documentation",
    fixmate: {
      status: "good",
      title: "Itemized PDF Tax Invoice",
      details: "Downloadable PDF invoice with timestamp, technician details, and itemized billing for easy expense reimbursement.",
    },
    traditional: {
      status: "bad",
      title: "Handwritten Slip or None",
      details: "Cash-only deals with scribble on scraps of paper that fade, offering zero legal protection or warranty proof.",
    },
  },
  {
    category: "trust",
    metric: "Cancellation Flexibility",
    fixmate: {
      status: "good",
      title: "Free 1-Click Cancellation",
      details: "Change your mind anytime while the request is waiting for technician response with zero penalty.",
    },
    traditional: {
      status: "bad",
      title: "Non-Refundable Diagnostic Fees",
      details: "Once handed over, shops often charge mandatory inspection fees even if you decline their expensive repair quote.",
    },
  },
];

export function FixmateGuarantee() {
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? COMPARISONS : COMPARISONS.filter((c) => c.category === filter);

  return (
    <section id="guarantee-section" className="section-pad container">
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold text-primary">
          <Scale className="size-3.5" /> The FixMate Difference
        </div>
        <h2 className="section-title mt-3">Why FixMate vs. Traditional Repair Shops?</h2>
        <p className="section-lead mx-auto">
          We built FixMate because getting a phone, laptop, or home appliance fixed was fraught with risk. See how our
          protocol protects you.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        {[
          { key: "all", label: "All Comparisons" },
          { key: "payment", label: "Payment & Invoicing" },
          { key: "tracking", label: "Real-time Tracking" },
          { key: "pricing", label: "Fair Pricing" },
          { key: "trust", label: "Trust & Safety" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs font-bold transition-all",
              filter === tab.key
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Comparison Cards Grid */}
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => (
            <motion.div
              layout
              key={item.metric}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:shadow-md"
            >
              <div className="border-b bg-muted/30 px-5 py-3">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{item.metric}</p>
              </div>

              <div className="grid divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                {/* FixMate Way */}
                <div className="p-5 bg-primary/[0.02]">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-4 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider">The FixMate Standard</span>
                  </div>
                  <h4 className="mt-2 text-sm font-bold text-foreground">{item.fixmate.title}</h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{item.fixmate.details}</p>
                </div>

                {/* Traditional Shop */}
                <div className="p-5 bg-destructive/[0.02]">
                  <div className="flex items-center gap-2 text-destructive">
                    <XCircle className="size-4 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider">Typical Local Shop</span>
                  </div>
                  <h4 className="mt-2 text-sm font-bold text-foreground">{item.traditional.title}</h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{item.traditional.details}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Trust Quote Banner */}
      <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center sm:p-8">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
          <ShieldCheck className="size-6" />
        </div>
        <h3 className="mt-4 text-lg font-bold">The Zero-Hostage Guarantee</h3>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          If a technician is unable to repair your device, you are not charged for the service. You retain full control
          over your money until the device is fixed and delivered back to you.
        </p>
      </div>
    </section>
  );
}
