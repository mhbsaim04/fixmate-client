import Link from "next/link";
import { cn } from "@/lib/utils";

/** Same mark, same size, on every page. `light` is for dark surfaces (footer). */
export function Logo({ light = false, compact = false, className }: { light?: boolean; compact?: boolean; className?: string }) {
  return (
    <Link href="/" aria-label="FixMate home" className={cn("inline-flex items-center", className)}>
      <img
        src="/images/FixMate Tech Repair Logo.png"
        alt="FixMate"
        className={cn("h-12 w-auto object-contain", compact && "h-10", light && "brightness-0 invert")}
      />
    </Link>
  );
}