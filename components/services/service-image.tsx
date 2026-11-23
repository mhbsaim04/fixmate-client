"use client";

import Image from "next/image";
import { useState } from "react";
import { Wrench } from "lucide-react";
import { CATEGORY_META } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** next/image with a tidy fallback so a broken URL never leaves a hole in the grid. */
export function ServiceImage({
  src,
  alt,
  category,
  className,
  sizes = "(min-width:1280px) 25vw, (min-width:768px) 33vw, 100vw",
  priority,
}: {
  src?: string;
  alt: string;
  category?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const Icon = (category && CATEGORY_META[category]?.icon) || Wrench;

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {src && !failed ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="bg-bench grid size-full place-items-center">
          <Icon className="size-10 text-muted-foreground/60" />
        </div>
      )}
    </div>
  );
}
