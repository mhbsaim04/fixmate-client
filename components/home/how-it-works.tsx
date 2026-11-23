import { CreditCard, Search, Send, Wrench } from "lucide-react";

const STEPS = [
  { icon: Search, title: "Find a service", text: "Search approved repair services by device, area and price." },
  { icon: Send, title: "Send a request", text: "Share your phone, address, date and what went wrong." },
  { icon: Wrench, title: "Technician fixes it", text: "Follow the job from accepted to in progress to completed." },
  { icon: CreditCard, title: "Pay after completion", text: "Settle the final amount securely with Stripe, only when it's done." },
];

export function HowItWorks() {
  return (
    <section className="section-pad border-y bg-card">
      <div className="container">
        <h2 className="section-title">How FixMate works</h2>
        <p className="section-lead">Four steps from a broken device to a working one.</p>

        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="relative">
              {i < STEPS.length - 1 && (
                <span aria-hidden className="absolute left-14 right-[-1.5rem] top-7 hidden border-t-2 border-dashed border-input lg:block" />
              )}
              <div className="relative flex items-center gap-4">
                <span className="grid size-14 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
                  <Icon className="size-6" />
                </span>
                <span className="font-display text-3xl font-extrabold text-accent [-webkit-text-stroke:1.5px_hsl(var(--secondary))] dark:[-webkit-text-stroke:0]">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
