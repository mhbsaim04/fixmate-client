import { BadgeCheck, ClipboardCheck, Quote, Wallet } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/animated-number";

const POINTS = [
  { icon: BadgeCheck, title: "Verified technicians", text: "Every service listing is reviewed by an admin before customers can see it." },
  { icon: ClipboardCheck, title: "A status for every step", text: "No more wondering. Requested, accepted, in progress, completed, paid." },
  { icon: Wallet, title: "Pay after service", text: "You are charged only once the job is marked completed, and only the final amount." },
];

const STATS = [
  { value: 120, suffix: "+", label: "verified technicians" },
  { value: 3400, suffix: "+", label: "jobs completed" },
  { value: 4.8, label: "average rating", decimals: 1 },
];

const QUOTES = [
  { name: "Nusrat Jahan", where: "Dhanmondi", text: "My laptop was back in two days and I paid only after I tested it. That alone won me over." },
  { name: "Imran Kabir", where: "Uttara", text: "The AC technician updated the job status as he went. I always knew what was happening." },
  { name: "Farzana Akter", where: "Mirpur", text: "Clear price, clear timeline, and the invoice downloaded as a PDF. Very professional." },
];

export function WhyChooseUs() {
  return (
    <section className="section-pad bg-secondary text-white">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <h2 className="font-display text-3xl font-extrabold leading-tight md:text-4xl">Why people choose FixMate</h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-white/70">
              Repairs feel risky because you hand over a device and hope. We designed the opposite.
            </p>
            <ul className="mt-8 space-y-6">
              {POINTS.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                    <Icon className="size-6" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/70">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <dl className="grid grid-cols-3 divide-x divide-white/15 rounded-2xl border border-white/15 bg-white/5 text-center">
              {STATS.map((s) => (
                <div key={s.label} className="px-3 py-6">
                  <dt className="order-2 mt-1 text-xs text-white/60">{s.label}</dt>
                  <dd className="font-display text-3xl font-extrabold text-accent md:text-4xl">
                    <AnimatedNumber value={s.value} suffix={s.suffix} decimals={s.decimals} />
                  </dd>
                </div>
              ))}
            </dl>

            <div className="grid gap-4 sm:grid-cols-2">
              {QUOTES.slice(0, 2).map((q) => (
                <figure key={q.name} className="rounded-2xl bg-white p-5 text-secondary">
                  <Quote className="size-6 text-primary" />
                  <blockquote className="mt-3 text-sm leading-relaxed">{q.text}</blockquote>
                  <figcaption className="mt-4 text-sm font-bold">
                    {q.name} <span className="font-normal text-secondary/60">from {q.where}</span>
                  </figcaption>
                </figure>
              ))}
              <figure className="rounded-2xl bg-white p-5 text-secondary sm:col-span-2">
                <Quote className="size-6 text-primary" />
                <blockquote className="mt-3 text-sm leading-relaxed">{QUOTES[2].text}</blockquote>
                <figcaption className="mt-4 text-sm font-bold">
                  {QUOTES[2].name} <span className="font-normal text-secondary/60">from {QUOTES[2].where}</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
