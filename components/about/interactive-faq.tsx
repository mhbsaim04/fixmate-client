"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  HelpCircle,
  Mail,
  Phone,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
  q: string;
  a: string;
  category: "payments" | "booking" | "technicians";
  highlight?: string;
}

const FAQ_LIST: FaqItem[] = [
  {
    category: "payments",
    q: "When and how do I pay?",
    a: "You only pay after the technician completes the repair and tests the device. Once marked 'Completed', a secure 'Pay Now' button appears on your booking ticket. Payments are processed with 256-bit encryption through Stripe Checkout (cards, mobile wallets). No cash hostage, no advance deposits.",
    highlight: "100% Pay-After-Service",
  },
  {
    category: "payments",
    q: "What if the technician cannot fix my device?",
    a: "If a device cannot be repaired or replacement parts are unavailable, the technician marks the job as cancelled or unrepairable. Because payment only happens after completion, you are charged ৳ 0. You never pay for unsuccessful repairs.",
    highlight: "Zero financial risk",
  },
  {
    category: "payments",
    q: "Who sets the final price and can it change?",
    a: "The service listing displays a transparent starting rate. If your repair requires special replacement components (such as an OEM display or motherboard IC), the technician consults you and enters the confirmed final price upon job completion. You review and approve the final total before paying.",
    highlight: "Transparent billing",
  },
  {
    category: "booking",
    q: "Can I cancel a repair request?",
    a: "Yes. As long as the technician has not yet accepted or rejected the request, you can cancel it with one click from your dashboard without penalty or fee. Once accepted, the job moves through the milestone timeline step-by-step.",
    highlight: "Free cancellation",
  },
  {
    category: "booking",
    q: "Do technicians offer home visits or shop drop-off?",
    a: "Both! When browsing services, each listing displays whether the technician offers 'Home Visit', 'Shop Drop-off', or both. You choose your preferred mode when submitting your request.",
    highlight: "Convenient options",
  },
  {
    category: "booking",
    q: "Can I download an itemized PDF invoice for company reimbursement?",
    a: "Yes. As soon as you complete the Stripe checkout, an official itemized PDF invoice is generated with a timestamp, invoice number, technician details, and amount breakdown. You can download it directly from your booking details anytime.",
    highlight: "Instant PDF invoice",
  },
  {
    category: "technicians",
    q: "How are technicians vetted before being listed?",
    a: "Every new technician account and service listing must pass manual review by our platform administrators. We verify identity credentials, trade experience, and realistic pricing before any service appears in the public directory.",
    highlight: "Admin-verified",
  },
  {
    category: "technicians",
    q: "How and when do technicians receive their earnings?",
    a: "When a customer completes payment via Stripe, the payout is recorded to the technician's balance immediately. Platform service fees are flat and minimal (5%), and technicians receive payouts directly to their bank account.",
    highlight: "Fast direct payouts",
  },
];

export function InteractiveFaq() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filtered = FAQ_LIST.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesQuery =
      searchQuery.trim() === "" ||
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <section id="faq-section" className="section-pad border-t bg-card">
      <div className="container max-w-4xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold text-primary">
            <HelpCircle className="size-3.5" /> Clear Answers
          </div>
          <h2 className="section-title mt-3">Frequently Asked Questions</h2>
          <p className="section-lead mx-auto">
            Everything you need to know about how FixMate handles bookings, payments, and quality guarantees.
          </p>
        </div>

        {/* Search bar & Category filters */}
        <div className="mt-8 space-y-4">
          <div className="relative mx-auto max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions e.g. payment, cancellation, invoice..."
              className="h-11 w-full rounded-2xl border bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { key: "all", label: "All Questions" },
              { key: "payments", label: "Payments & Guarantee" },
              { key: "booking", label: "Booking & Tracking" },
              { key: "technicians", label: "Technicians & Vetting" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveCategory(tab.key)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-xs font-bold transition-all",
                  activeCategory === tab.key
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion list */}
        <div className="mt-8 space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              No matching questions found for &quot;{searchQuery}&quot;. Try another search keyword.
            </div>
          ) : (
            filtered.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={item.q}
                  className={cn(
                    "overflow-hidden rounded-2xl border transition-all duration-200",
                    isOpen ? "border-primary/50 bg-background shadow-md ring-1 ring-primary/20" : "border-border bg-background/60 hover:border-primary/30",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left font-bold text-sm sm:text-base text-foreground"
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-center gap-2.5">
                      <span>{item.q}</span>
                      {item.highlight && (
                        <span className="hidden rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 sm:inline-block">
                          {item.highlight}
                        </span>
                      )}
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-5 shrink-0 text-muted-foreground transition-transform duration-200",
                        isOpen && "rotate-180 text-primary",
                      )}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="border-t px-5 pb-5 pt-3 text-sm leading-relaxed text-muted-foreground">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* Direct Contact Support Box */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-3xl border border-primary/20 bg-muted/40 p-6 sm:flex-row sm:p-8">
          <div>
            <h3 className="text-base font-bold text-foreground">Have a specific question not covered here?</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Our Dhaka-based operations and technician support team is available Saturday to Thursday.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="mailto:support@fixmate.app"
              className="inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5 text-xs font-bold text-foreground shadow-sm transition hover:bg-muted"
            >
              <Mail className="size-3.5 text-primary" /> support@fixmate.app
            </a>
            <a
              href="tel:+8801700000000"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              <Phone className="size-3.5" /> +880 1700-000000
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
