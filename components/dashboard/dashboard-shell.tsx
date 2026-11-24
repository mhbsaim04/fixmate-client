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
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href));
  const handleSignOut = () =>
    signOutUser(() => {
      router.push("/");
      router.refresh();
    });

  return (
    <div className="flex min-h-screen bg-slate-50">
      {open && <div className="fixed inset-0 z-30 bg-secondary/60 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} aria-hidden />}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/10 bg-secondary text-white shadow-sm transition-all duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
          collapsed && "lg:w-[88px]",
        )}
      >
        <div className={cn("flex h-20 items-center justify-between border-b border-white/10 px-5", collapsed && "lg:justify-center lg:px-0")}>
          <Logo compact={collapsed} className={collapsed ? "lg:[&>span:last-child]:hidden" : ""} />
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close sidebar">
            <X />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Dashboard">
          <p className={cn("px-3 pb-3 pt-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/60", collapsed && "lg:hidden")}>
            {roleLabel} workspace
          </p>
          {nav.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
                  active
                    ? "bg-accent/90 text-accent-foreground shadow-md shadow-black/10"
                    : "text-white/85 hover:bg-white/10 hover:text-white",
                  collapsed && "lg:justify-center lg:px-0",
                )}
              >
                <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", active ? "bg-white/15" : "bg-transparent group-hover:bg-white/10")}>
                  <Icon className="size-[18px]" />
                </span>
                <span className={cn(collapsed && "lg:hidden")}>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-white/10 bg-black/10 p-3">
          <Link
            href="/"
            title="Back to Home"
            className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/85 transition-colors hover:bg-white/10 hover:text-white", collapsed && "lg:justify-center lg:px-0")}
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-lg"><Home className="size-[18px]" /></span>
            <span className={cn(collapsed && "lg:hidden")}>Back to Home</span>
          </Link>
          <button
            onClick={handleSignOut}
            title="Sign Out"
            className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-300 transition-colors hover:bg-rose-500/15", collapsed && "lg:justify-center lg:px-0")}
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-lg"><LogOut className="size-[18px]" /></span>
            <span className={cn(collapsed && "lg:hidden")}>Sign Out</span>
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between gap-3 border-b border-border bg-background px-4 backdrop-blur-xl sm:px-6 lg:px-8">
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
            <span className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:flex">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              {roleLabel} workspace
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex min-w-0 items-center gap-2 rounded-2xl border border-slate-200/80 bg-white py-1 pl-1 pr-2 shadow-sm sm:gap-3 sm:pr-3">
              <UserAvatar src={user.image} name={user.name} />
              <div className="hidden min-w-0 leading-tight sm:block">
                <p className="max-w-[140px] truncate text-sm font-bold">{user.name}</p>
                <p className="text-[11px] text-muted-foreground">{roleLabel}</p>
              </div>
              <div className="hidden sm:block"><RoleBadge role={role} /></div>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1600px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
