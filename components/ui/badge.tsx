import { cn } from "@/lib/utils";
import {
  APPROVAL_STATUS,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  ROLE_LABEL,
  ROLE_TONE,
} from "@/lib/constants";
import type { ApprovalStatus, BookingStatus, PaymentStatus, Role } from "@/lib/types";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-muted px-2.5 py-1 text-xs font-semibold",
        className,
      )}
      {...props}
    />
  );
}

export function StatusBadge({ status }: { status: BookingStatus }) {
  const meta = BOOKING_STATUS[status] ?? BOOKING_STATUS.requested;
  return (
    <Badge className={meta.tone}>
      <span className="size-1.5 rounded-full bg-current" />
      {meta.label}
    </Badge>
  );
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  const meta = PAYMENT_STATUS[status] ?? PAYMENT_STATUS.unpaid;
  return <Badge className={meta.tone}>{meta.label}</Badge>;
}

export function ApprovalBadge({ status }: { status: ApprovalStatus }) {
  const meta = APPROVAL_STATUS[status] ?? APPROVAL_STATUS.pending;
  return <Badge className={meta.tone}>{meta.label}</Badge>;
}

export function RoleBadge({ role }: { role: Role }) {
  return <Badge className={ROLE_TONE[role] ?? ROLE_TONE.customer}>{ROLE_LABEL[role] ?? "Customer"}</Badge>;
}
