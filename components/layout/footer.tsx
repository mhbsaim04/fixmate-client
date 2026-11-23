import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { Logo } from "./logo";
import { FacebookIcon, InstagramIcon, LinkedinIcon, XLogo } from "./social-icons";

const SOCIALS = [
  { label: "X", href: "https://x.com", icon: XLogo },
  { label: "Facebook", href: "https://facebook.com", icon: FacebookIcon },
  { label: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
  { label: "LinkedIn", href: "https://linkedin.com", icon: LinkedinIcon },
];

export function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="hazard h-2.5" aria-hidden />
      <div className="container grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_1.2fr]">
        <div className="space-y-5">
          <Logo light />
          <p className="max-w-xs text-sm leading-relaxed text-white/70">
            Verified repair technicians for your phone, laptop and home appliances. Track every job and pay only
            after the work is done.
          </p>
          <div className="flex gap-2.5">
            {SOCIALS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid size-10 place-items-center rounded-full bg-white/10 transition hover:bg-accent hover:text-accent-foreground"
              >
                <Icon className="size-[18px]" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-base font-bold">Quick links</h3>
          <ul className="space-y-2.5 text-sm text-white/70">
            {[
              ["Home", "/"],
              ["Services", "/services"],
              ["About", "/about"],
              ["Sign In", "/sign-in"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="transition hover:text-accent">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-base font-bold">Popular categories</h3>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-white/70">
            {CATEGORIES.map((c) => (
              <li key={c}>
                <Link href={`/services?category=${encodeURIComponent(c)}`} className="transition hover:text-accent">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-base font-bold">Contact</h3>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-accent" /> support@fixmate.app
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-accent" /> +880 1700-000000
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" /> House 12, Road 5, Mirpur DOHS, Dhaka 1216
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} FixMate. All rights reserved.</p>
          <p>Built for people who just want their stuff working again.</p>
        </div>
      </div>
    </footer>
  );
}
