import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="bg-bench">
        <div className="container grid min-h-[70vh] place-items-center py-16">
          <div className="max-w-lg text-center">
            <svg viewBox="0 0 320 200" className="mx-auto w-72" role="img" aria-label="A wrench and gear lying next to a broken page">
              <rect x="20" y="168" width="280" height="10" rx="5" className="fill-border" />
              <g className="origin-center animate-[spin_14s_linear_infinite]" style={{ transformOrigin: "232px 96px" }}>
                <circle cx="232" cy="96" r="44" className="fill-accent" />
                {Array.from({ length: 8 }).map((_, i) => (
                  <rect key={i} x="224" y="40" width="16" height="22" rx="4" className="fill-accent" transform={`rotate(${i * 45} 232 96)`} />
                ))}
                <circle cx="232" cy="96" r="18" className="fill-background" />
              </g>
              <g transform="rotate(-28 110 100)">
                <rect x="98" y="56" width="24" height="110" rx="12" className="fill-secondary" />
                <path d="M84 24a28 28 0 0 1 52 0l-14 20h-24z" className="fill-secondary" />
                <circle cx="110" cy="30" r="9" className="fill-background" />
              </g>
              <text x="160" y="196" textAnchor="middle" className="fill-muted-foreground font-display text-[13px] font-bold">
                part not found
              </text>
            </svg>
            <h1 className="mt-6 font-display text-6xl font-extrabold">404</h1>
            <p className="mt-3 text-lg font-semibold">This page is out for repair.</p>
            <p className="mt-2 text-muted-foreground">
              The link may be broken, or the service you wanted is no longer available.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
