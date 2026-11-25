"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  BriefcaseBusiness,
  CheckCheck,
  CreditCard,
  Wrench,
} from "lucide-react";
import { api } from "@/lib/api";
import type { Notification, Role } from "@/lib/types";
import { cn } from "@/lib/utils";

interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
}

interface Props {
  role: Role;
}

const iconByType = {
  booking: BriefcaseBusiness,
  payment: CreditCard,
  service: Wrench,
} as const;

export function NotificationBell({ role }: Props) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const result = await api.get<NotificationResponse>("/api/notifications/my");
      setNotifications(result.notifications);
      setUnreadCount(result.unreadCount);
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (role === "admin") return;
    const initialLoad = window.setTimeout(() => void loadNotifications(), 0);
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void loadNotifications(true);
    }, 30_000);
    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(interval);
    };
  }, [loadNotifications, role]);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  if (role === "admin") return null;

  const markRead = async (notification: Notification): Promise<boolean> => {
    if (notification.readAt) return true;
    try {
      await api.patch(`/api/notifications/${notification._id}/read`);
      setNotifications((current) =>
        current.map((item) =>
          item._id === notification._id
            ? { ...item, readAt: new Date().toISOString() }
            : item,
        ),
      );
      setUnreadCount((count) => Math.max(0, count - 1));
      return true;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not update notification.");
      return false;
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch("/api/notifications/read-all");
      const readAt = new Date().toISOString();
      setNotifications((current) => current.map((item) => ({ ...item, readAt })));
      setUnreadCount(0);
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not update notifications.");
    }
  };

  const openNotification = async (notification: Notification) => {
    if (!(await markRead(notification))) return;
    setOpen(false);
    router.push(notification.href);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => {
          setOpen((value) => !value);
          if (!open) void loadNotifications(true);
        }}
        className="relative grid size-10 place-items-center rounded-full text-current transition hover:bg-current/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute right-0.5 top-0.5 grid min-h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <section
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <h2 className="text-sm font-bold">Notifications</h2>
              <p className="text-xs text-slate-500">
                {unreadCount ? `${unreadCount} unread` : "You're all caught up"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-primary transition hover:bg-primary/10"
              >
                <CheckCheck className="size-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {error && (
            <div className="px-4 py-3 text-sm text-destructive">
              <p>{error}</p>
              <button
                type="button"
                onClick={() => void loadNotifications()}
                className="mt-1 font-semibold underline underline-offset-2"
              >
                Try again
              </button>
            </div>
          )}

          {loading && notifications.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-slate-500">Loading notifications...</p>
          )}

          {!loading && !error && notifications.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-slate-500">No notifications yet.</p>
          )}

          {notifications.length > 0 && (
            <ul className="max-h-[min(24rem,65vh)] overflow-y-auto py-1">
              {notifications.map((notification) => {
                const Icon = iconByType[notification.type];
                return (
                  <li key={notification._id}>
                    <button
                      type="button"
                      onClick={() => void openNotification(notification)}
                      className={cn(
                        "flex w-full gap-3 px-4 py-3 text-left transition hover:bg-slate-50",
                        !notification.readAt && "bg-primary/[0.04]",
                      )}
                    >
                      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-2">
                          <span className="text-sm font-semibold leading-5">{notification.title}</span>
                          {!notification.readAt && (
                            <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                          )}
                        </span>
                        <span className="mt-0.5 block text-xs leading-5 text-slate-600">
                          {notification.message}
                        </span>
                        <time
                          dateTime={notification.createdAt}
                          className="mt-1 block text-[11px] text-slate-400"
                        >
                          {new Intl.DateTimeFormat(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }).format(new Date(notification.createdAt))}
                        </time>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
