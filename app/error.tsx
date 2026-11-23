"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="grid min-h-[70vh] place-items-center px-5 py-16">
      <div className="max-w-md text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="size-8" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-extrabold">Something broke on our side</h1>
        <p className="mt-3 text-muted-foreground">
          An unexpected error stopped this page from loading. Try again, or head back home.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button onClick={reset}>
            <RefreshCw /> Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
