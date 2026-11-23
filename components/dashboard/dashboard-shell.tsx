"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeftToLine, ArrowRightToLine, Home, LogOut, Menu, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { signOutUser } from "@/lib/auth-actions";
import { DASHBOARD_NAV } from "@/lib/nav";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";

interface Props {
  role: Role;
  initialUser: { name: string; image?: string | null };
  children: React.ReactNode;
}

export function DashboardShell({ role, initialUser, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // The live session wins so a profile update shows in the top bar instantly.
  const user = session?.user ?? initialUser;
  const nav = DASHBOARD_NAV[role];

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href));
  const handleSignOut = () =>
    signOutUser(() => {
      router.push("/");
      router.refresh();
    });

  return (
    <div className="flex min-h-screen bg-muted/50">
      {open && <div className="fixed inset-0 z-30 bg-secondary/60 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} aria-hidden />}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r bg-card transition-all duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
          collapsed && "lg:w-[88px]",
        )}
      >
        <div className={cn("flex h-[72px] items-center justify-between border-b px-5", collapsed && "lg:justify-center lg:px-0")}>
          <Logo compact={collapsed} className={collapsed ? "lg:[&>span:last-child]:hidden" : ""} />
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close sidebar">
            <X />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4" aria-label="Dashboard">
          {nav.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-colors",
                  active ? "bg-secondary text-secondary-foreground shadow-md" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "lg:justify-center lg:px-0",
                )}
              >
                <Icon className="size-5 shrink-0" />
                <span className={cn(collapsed && "lg:hidden")}>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t p-4">
          <Link
            href="/"
            title="Back to Home"
            className={cn("flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground", collapsed && "lg:justify-center lg:px-0")}
          >
            <Home className="size-5 shrink-0" /> <span className={cn(collapsed && "lg:hidden")}>Back to Home</span>
          </Link>
          <button
            onClick={handleSignOut}
            title="Sign Out"
            className={cn("flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-destructive hover:bg-destructive/10", collapsed && "lg:justify-center lg:px-0")}
          >
            <LogOut className="size-5 shrink-0" /> <span className={cn(collapsed && "lg:hidden")}>Sign Out</span>
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between gap-3 border-b bg-card/85 px-4 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open sidebar">
              <Menu />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:inline-flex"
              onClick={() => setCollapsed((v) => !v)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ArrowRightToLine /> : <ArrowLeftToLine />}
            </Button>
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/">
                <Home /> Home
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <div className="flex items-center gap-3 rounded-full border bg-background py-1 pl-1 pr-4">
              <UserAvatar src={user.image} name={user.name} />
              <div className="hidden leading-tight sm:block">
                <p className="max-w-[140px] truncate text-sm font-bold">{user.name}</p>
              </div>
              <RoleBadge role={role} />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
