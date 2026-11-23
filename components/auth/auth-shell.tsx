import Link from "next/link";
import { BadgeCheck, ClipboardCheck, Wallet } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const POINTS = [
  { icon: BadgeCheck, text: "Every service is reviewed by an admin before it goes live" },
  { icon: ClipboardCheck, text: "See each job move from requested to completed" },
  { icon: Wallet, text: "You pay only after the technician finishes the work" },
];

export function AuthShell({
  title,
  subtitle,
  footer,
  children,
}: {
  title: string;
  subtitle: string;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
      <aside className="relative hidden overflow-hidden bg-secondary p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="bg-bench absolute inset-0 opacity-30 [mask-image:radial-gradient(circle_at_30%_30%,black,transparent_75%)]" aria-hidden />
        <div className="hazard absolute inset-x-0 bottom-0 h-3" aria-hidden />
        <div className="relative">
          <Logo light />
        </div>
        <div className="relative max-w-md">
          <h2 className="font-display text-4xl font-extrabold leading-tight">
            Your repair shop, without the guesswork.
          </h2>
          <ul className="mt-8 space-y-5">
            {POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex gap-4 text-white/80">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <Icon className="size-5" />
                </span>
                <span className="pt-2 text-sm leading-snug">{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-white/50">Use Stripe test card 4242 4242 4242 4242 when trying payments.</p>
      </aside>

      <section className="flex flex-col">
        <div className="flex items-center justify-between p-5 lg:justify-end">
          <div className="lg:hidden">
            <Logo />
          </div>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-5 pb-12">
          <div className="w-full max-w-md">
            <h1 className="font-display text-3xl font-extrabold">{title}</h1>
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
            <div className="mt-8">{children}</div>
            <p className="mt-8 text-center text-sm text-muted-foreground">{footer}</p>
            <p className="mt-6 text-center text-xs text-muted-foreground">
              <Link href="/" className="underline-offset-4 hover:underline">
                Back to home
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
