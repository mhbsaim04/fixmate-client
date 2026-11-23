"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, LogOut, Menu, UserCog, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { signOutUser } from "@/lib/auth-actions";
import { roleHome } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/ui/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "./logo";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "How It Works" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);

  const user = session?.user as
    | { name: string; email: string; image?: string | null; role?: string | null }
    | undefined;
  const role = (user?.role ?? "customer") as Role;

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const handleSignOut = () =>
    signOutUser(() => {
      setOpen(false);
      router.push("/");
      router.refresh();
    });

  return (
    <header className="sticky top-0 z-40 border-b bg-background/75 backdrop-blur-xl shadow-md">
      <div className="container flex h-[72px] items-center justify-between gap-4">
        <span className="rounded-xl bg-[#4b6584] p-2 shadow-md ring-1 ring-[#4b6584]/40">
          <Logo />
        </span>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "relative rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                isActive(l.href) ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {isActive(l.href) && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 -z-10 rounded-lg bg-accent/90 dark:bg-accent/20"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          {isPending ? (
            <Skeleton className="size-10 rounded-full" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full ring-2 ring-transparent transition hover:ring-primary/40" aria-label="Open account menu">
                <UserAvatar src={user.image} name={user.name} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="flex items-center gap-3 px-3 py-3">
                  <UserAvatar src={user.image} name={user.name} className="size-11" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    <div className="mt-1.5">
                      <RoleBadge role={role} />
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(roleHome(role))}>
                  <LayoutDashboard /> Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
                  <UserCog /> Update Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleSignOut} className="text-destructive focus:text-destructive [&_svg]:text-destructive">
                  <LogOut /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="!size-5" /> : <Menu className="!size-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t bg-background md:hidden"
          >
            <nav className="container flex flex-col gap-1 py-4" aria-label="Mobile">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-4 py-3 text-base font-semibold",
                    isActive(l.href) ? "bg-accent/90 text-accent-foreground dark:bg-accent/20 dark:text-foreground" : "hover:bg-muted",
                  )}
                >
                  {l.label}
                </Link>
              ))}
              {!user && !isPending && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button asChild variant="outline" onClick={() => setOpen(false)}>
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                  <Button asChild onClick={() => setOpen(false)}>
                    <Link href="/sign-up">Sign Up</Link>
                  </Button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
