"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const SERVICE_FAQS = [
  {
    q: "How does payment work for this repair?",
    a: "FixMate operates on a 100% pay-after-service policy. You do NOT pay any advance deposit. Once the technician completes the repair, tests the device in front of you, and marks it finished, you pay securely through your booking dashboard using Stripe Checkout.",
  },
  {
    q: "What if the device cannot be fixed?",
    a: "If your device is deemed non-repairable after diagnostic assessment, the job is marked as cancelled or unrepairable. Because payment only occurs after a successful job, you are charged ৳0. Zero financial risk for you.",
  },
  {
    q: "Is there a warranty provided on this repair?",
    a: "Yes! Every completed repair through FixMate comes with a 30-day workmanship warranty. If the exact same issue re-emerges within 30 days, the technician will inspect and resolve it at no extra service charge.",
  },
  {
    q: "Can I reschedule or cancel my request?",
    a: "You can cancel or reschedule your request at any time before the technician accepts it, directly from your Customer Bookings dashboard with zero cancellation fees.",
  },
  {
    q: "Are replacement parts included in the starting price?",
    a: "The starting price covers standard diagnostic and labor servicing. If specific replacement components (e.g. new battery, screen, or compressor parts) are needed, the technician discusses the exact component cost with you upfront before proceeding.",
  },
];

export function ServiceFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  function toggle(idx: number) {
    setOpenIndex(openIndex === idx ? null : idx);
  }

  return (
    <div className="mt-12 rounded-3xl border border-border/80 bg-card p-6 shadow-sm md:p-8">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        <HelpCircle className="size-4 text-primary" /> Got Questions?
      </div>
      <h3 className="mt-2 font-display text-xl font-bold tracking-tight md:text-2xl">
        Frequently Asked Questions
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Everything you need to know about booking and completing this repair.
      </p>

      <div className="mt-6 divide-y divide-border/60">
        {SERVICE_FAQS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="py-4 first:pt-0 last:pb-0">
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="flex w-full items-center justify-between gap-4 text-left font-semibold text-foreground transition-colors hover:text-primary"
              >
                <span className="text-sm md:text-base">{item.q}</span>
                <span className={cn("grid size-7 shrink-0 place-items-center rounded-full bg-muted transition-transform duration-200", isOpen && "rotate-180 bg-primary/10 text-primary")}>
                  <ChevronDown className="size-4" />
                </span>
              </button>
              {isOpen && (
                <div className="mt-2.5 text-sm leading-relaxed text-muted-foreground animate-in fade-in-50 duration-200">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
