"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Search, ShieldCheck, Wallet, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = ["Requested", "Accepted", "In Progress", "Completed", "Paid"] as const;
const DOT = ["bg-blue-500", "bg-indigo-500", "bg-amber-500", "bg-emerald-500", "bg-emerald-600"];
const NOTE = [
  "Request sent. A technician will get back to you soon.",
  "Your repair is accepted and ready for the next step.",
  "Your repair is underway. Follow each update here.",
  "Repair complete. Review the final details.",
  "Payment complete. Your receipt is ready.",
];

function LiveJobTicket() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[480px]">
      <div className="absolute -inset-3 rotate-3 rounded-[2rem] bg-accent/75 blur-[1px]" aria-hidden />
      <div className="absolute -inset-x-8 inset-y-12 -z-10 rounded-full bg-primary/15 blur-3xl" aria-hidden />
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-card shadow-[0_28px_80px_-28px_hsl(var(--secondary)/0.42)]">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-accent to-emerald-400" aria-hidden />
        <div className="p-5 sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent/50 text-primary ring-1 ring-primary/10">
                <Wrench className="size-6" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Repair timeline</p>
                <h2 className="mt-1 text-base font-bold leading-snug sm:text-lg">iPhone 13 screen replacement</h2>
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-100 sm:text-xs">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span className="hidden sm:inline">Live</span>
            </span>
          </div>

          <div className="mt-8 rounded-2xl bg-muted/70 px-2 py-5 sm:px-4">
            <div className="relative flex justify-between">
              <div className="absolute left-3 right-3 top-3 h-1 rounded-full bg-border" aria-hidden />
              <motion.div
                className="absolute left-3 top-3 h-1 origin-left rounded-full bg-gradient-to-r from-primary to-emerald-500"
                style={{ right: 12 }}
                animate={{ scaleX: step / (STEPS.length - 1) }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                aria-hidden
              />
              {STEPS.map((label, i) => (
                <div key={label} className="relative z-10 flex min-w-0 flex-1 flex-col items-center gap-2">
                  <span
                    className={`grid size-7 place-items-center rounded-full border-2 border-card text-white shadow-sm transition-all duration-500 ${
                      i <= step ? DOT[i] : "bg-muted text-transparent"
                    }`}
                  >
                    <Check className="size-3.5" strokeWidth={3.5} />
                  </span>
                  <span className={`text-center text-[9px] font-semibold leading-tight sm:text-[10px] ${i === step ? "text-foreground" : "text-muted-foreground"}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <motion.p
            key={step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex min-h-14 items-center gap-3 rounded-2xl border border-primary/10 bg-primary/[0.04] px-4 py-3 text-sm leading-relaxed text-foreground/80"
            aria-live="polite"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white text-primary shadow-sm">
              <Check className="size-4" />
            </span>
            {NOTE[step]}
          </motion.p>

          <div className="mt-5 flex items-center justify-between gap-3 border-t border-border/70 pt-4">
            <p className="text-xs font-medium text-muted-foreground">Every repair update, all in one place</p>
            <span className="shrink-0 rounded-full bg-accent/35 px-3 py-1 text-xs font-bold text-foreground">{STEPS[step]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const router = useRouter();
  const [q, setQ] = useState("");

  return (
    <section className="bg-bench relative isolate overflow-hidden border-b">
      <div className="pointer-events-none absolute -left-32 -top-40 -z-10 size-[30rem] rounded-full bg-accent/35 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-48 right-[22%] -z-10 size-[28rem] rounded-full bg-primary/15 blur-3xl" aria-hidden />
      <div className="container grid items-center gap-12 py-12 sm:py-16 md:py-20 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-12 lg:py-24">
        <div className="min-w-0">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card/80 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-primary shadow-sm backdrop-blur">
            <ShieldCheck className="size-4" /> Repairs, without the guesswork
          </p>
          <h1 className="max-w-2xl font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
            Broken device?
            <span className="mt-1 block text-primary">Back to working.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Find a trusted technician, follow every repair update, and pay only after the work is done.
          </p>

          <form
            className="mt-8 flex max-w-xl flex-col gap-2 rounded-2xl border border-white/80 bg-card/95 p-2 shadow-[0_18px_50px_-24px_hsl(var(--secondary)/0.45)] backdrop-blur transition-all focus-within:border-primary/30 focus-within:ring-4 focus-within:ring-primary/10 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              router.push(q.trim() ? `/services?search=${encodeURIComponent(q.trim())}` : "/services");
            }}
          >
            <label className="relative flex-1">
              <span className="sr-only">What needs fixing?</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="What needs fixing? e.g. AC servicing"
                className="h-12 w-full rounded-xl bg-transparent pl-12 pr-3 text-base placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </label>
            <Button type="submit" size="lg" className="rounded-xl">
              Find a technician <ArrowRight />
            </Button>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold text-muted-foreground">Popular:</span>
            {["Smartphone", "AC", "Laptop & PC"].map((c) => (
              <span key={c}>
                <Link href={`/services?category=${encodeURIComponent(c)}`} className="inline-flex rounded-full border border-border/70 bg-card/70 px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-card hover:text-primary">
                  {c}
                </Link>
              </span>
            ))}
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-foreground/80 sm:text-sm">
            <li className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /> Admin-approved listings</li>
            <li className="flex items-center gap-2"><Check className="size-5 text-primary" /> Live job tracking</li>
            <li className="flex items-center gap-2"><Wallet className="size-5 text-primary" /> Pay after completion</li>
          </ul>
        </div>

        <LiveJobTicket />
      </div>
    </section>
  );
}
