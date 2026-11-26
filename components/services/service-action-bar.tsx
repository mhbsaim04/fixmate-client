"use client";

import { useState } from "react";
import { Share2, Bookmark, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RequestRepair } from "@/components/services/request-repair";
import { formatCurrency } from "@/lib/utils";
import type { Service } from "@/lib/types";

export function ServiceActionBar({ service }: { service: Service }) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  async function handleShare() {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast.success("Link copied to clipboard!", { description: "You can now share this service with anyone." });
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      toast.error("Could not copy link to clipboard.");
    }
  }

  function toggleBookmark() {
    setBookmarked((prev) => {
      const next = !prev;
      if (next) {
        toast.success("Service saved to your bookmarks!");
      } else {
        toast.info("Removed from saved bookmarks.");
      }
      return next;
    });
  }

  return (
    <>
      {/* Top action buttons (Share, Bookmark) */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 rounded-xl text-xs font-semibold"
          onClick={handleShare}
        >
          {copied ? <Check className="size-3.5 text-emerald-600" /> : <Share2 className="size-3.5" />}
          {copied ? "Copied" : "Share"}
        </Button>

        <Button
          type="button"
          variant={bookmarked ? "secondary" : "outline"}
          size="sm"
          className="h-9 gap-1.5 rounded-xl text-xs font-semibold"
          onClick={toggleBookmark}
        >
          <Bookmark className={`size-3.5 ${bookmarked ? "fill-current text-primary" : ""}`} />
          {bookmarked ? "Saved" : "Save"}
        </Button>
      </div>

      {/* Floating mobile action bar (visible only on small screens) */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-border bg-background/95 px-4 py-3 backdrop-blur-md lg:hidden shadow-lg">
        <div>
          <p className="text-[11px] font-medium text-muted-foreground">Starting from</p>
          <p className="font-display text-lg font-extrabold text-foreground">{formatCurrency(service.basePrice)}</p>
        </div>
        <div className="w-1/2">
          <RequestRepair service={service} />
        </div>
      </div>
    </>
  );
}
