"use client";

import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, Sparkles, Star, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AboutCta() {
  return (
    <section className="section-pad border-t bg-secondary text-white relative isolate overflow-hidden">
      {/* Decorative ambient gradient */}
      <div
        className="pointer-events-none absolute -left-20 -top-20 -z-10 size-[30rem] rounded-full bg-accent/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -right-20 -z-10 size-[30rem] rounded-full bg-primary/25 blur-3xl"
        aria-hidden
      />

      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent backdrop-blur">
            <Sparkles className="size-3.5" /> Start With Total Confidence
          </div>
          <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl md:text-5xl text-white">
            Ready to experience device repair without the anxiety?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/70 sm:text-lg">
            Join thousands of smart customers and verified technicians who choose transparency, milestone tracking,
            and pay-after-service security.
          </p>
        </div>

        {/* Dual Action Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Card 1: Customer */}
          <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur transition hover:bg-white/[0.08] hover:border-white/25">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-accent text-secondary font-bold shadow-md">
                <Wrench className="size-6" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-accent">For Device Owners</p>
                <h3 className="text-xl font-bold text-white">Need something fixed today?</h3>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Browse approved repair specialists for your smartphone, PC, AC, TV or appliance. Send a request with zero
              deposit and pay only when it&apos;s done.
            </p>

            <ul className="mt-6 space-y-2.5 text-xs font-semibold text-white/80">
              <li className="flex items-center gap-2">
                <Check className="size-4 text-accent" /> 100% Pay-After-Service Guarantee
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-accent" /> Live status updates at every stage
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-accent" /> Official itemized PDF invoice
              </li>
            </ul>

            <div className="mt-8">
              <Button asChild size="lg" className="w-full rounded-xl bg-accent text-secondary hover:bg-accent/90 shadow-md">
                <Link href="/services">
                  Browse Verified Services <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Card 2: Technician */}
          <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur transition hover:bg-white/[0.08] hover:border-white/25">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-white/15 text-accent font-bold shadow-md">
                <ShieldCheck className="size-6" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white/60">For Repair Specialists</p>
                <h3 className="text-xl font-bold text-white">Grow your repair business</h3>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Get booked by serious clients with zero haggling. Build your verified reputation and receive direct,
              guaranteed payouts through Stripe.
            </p>

            <ul className="mt-6 space-y-2.5 text-xs font-semibold text-white/80">
              <li className="flex items-center gap-2">
                <Check className="size-4 text-accent" /> Zero commission until customer pays
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-accent" /> Direct Stripe payouts with no chargebacks
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-accent" /> Admin-verified pro badge on your profile
              </li>
            </ul>

            <div className="mt-8">
              <Button asChild size="lg" variant="outline" className="w-full rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20">
                <Link href="/sign-up">
                  Register as a Technician <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Guarantee Trust Seals */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 border-t border-white/10 pt-8 text-xs text-white/60">
          <span className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-accent" /> Admin Verified Listings
          </span>
          <span className="flex items-center gap-2">
            <Star className="size-4 text-amber-400 fill-amber-400" /> 4.8/5 Platform Rating
          </span>
          <span className="flex items-center gap-2">
            <Check className="size-4 text-accent" /> 256-bit Encrypted Stripe Checkout
          </span>
        </div>
      </div>
    </section>
  );
}
