/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { cn, initials } from "@/lib/utils";

export function UserAvatar({
  src,
  name,
  className,
}: {
  src?: string | null;
  name?: string | null;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <span
      className={cn(
        "relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent text-sm font-bold text-accent-foreground",
        className,
      )}
    >
      {src && !failed ? (
        <img src={src} alt={name ?? "User"} className="size-full object-cover" onError={() => setFailed(true)} />
      ) : (
        initials(name)
      )}
    </span>
  );
}
