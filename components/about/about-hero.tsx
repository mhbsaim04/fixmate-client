"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const PILL_STATS = [
  { icon: Wallet, label: "100% Pay-After-Service", desc: "Zero advance charge" },
  { icon: CheckCircle2, label: "Live 5-Stage Tracker", desc: "Real-time repair log" },
  { icon: ShieldCheck, label: "Admin-Vetted Technicians", desc: "Identity & skills verified" },
  { icon: FileCheck2, label: "Stripe & PDF Invoices", desc: "Transparent tax receipts" },
];

export function AboutHero() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="bg-bench relative isolate overflow-hidden border-b">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute -left-32 -top-40 -z-10 size-[32rem] rounded-full bg-accent/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-48 right-[15%] -z-10 size-[30rem] rounded-full bg-primary/15 blur-3xl"
        aria-hidden
      />

      <div className="container py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary shadow-sm backdrop-blur"
          >
            <Sparkles className="size-3.5" /> Radical Transparency in Device Repair
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 font-display text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl md:text-6xl text-foreground"
          >
            A repair shop you can watch working, and{" "}
            <span className="text-primary underline decoration-accent/60 underline-offset-8">
              only pay once it&apos;s done.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Handing over a beloved device to a stranger with zero updates and demanding cash upfront is broken. FixMate
            replaces the uncertainty with a live tracked milestone workflow, admin-vetted pros, and secure Stripe checkout.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Button asChild size="lg" className="rounded-xl shadow-md">
              <Link href="/services">
                Browse Verified Services <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="rounded-xl bg-card/70 backdrop-blur"
              onClick={() => scrollTo("how-it-works-section")}
            >
              Test-Drive How It Works <ArrowDown className="size-4" />
            </Button>
          </motion.div>

          {/* Quick jump navigation pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-muted-foreground">
            <span className="text-muted-foreground/80">Quick Jump:</span>
            {[
              { id: "how-it-works-section", label: "Interactive Stepper" },
              { id: "estimator-section", label: "Repair Estimator" },
              { id: "guarantee-section", label: "FixMate vs Traditional" },
              { id: "roles-section", label: "Role Explorer" },
              { id: "faq-section", label: "FAQ" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollTo(item.id)}
                className="rounded-full border border-border/80 bg-background/80 px-3 py-1 transition hover:border-primary/40 hover:bg-card hover:text-foreground"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Guarantees grid */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILL_STATS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 + i * 0.08 }}
                className="flex items-center gap-3.5 rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm backdrop-blur transition hover:border-primary/30 hover:shadow-md"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-xs font-bold text-foreground sm:text-sm">{p.label}</h3>
                  <p className="text-[11px] text-muted-foreground">{p.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
