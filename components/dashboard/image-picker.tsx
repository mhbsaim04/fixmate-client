/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { validateImage } from "@/lib/upload";
import { cn } from "@/lib/utils";

/** File input with a live preview. The file is uploaded to ImgBB on submit, not here. */
export function ImagePicker({
  existingUrl,
  file,
  onChange,
  shape = "rect",
  label = "Choose an image",
}: {
  existingUrl?: string | null;
  file: File | null;
  onChange: (f: File | null) => void;
  shape?: "rect" | "round";
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const src = preview ?? existingUrl ?? null;

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className={cn(
        "group relative grid place-items-center overflow-hidden border-2 border-dashed border-input bg-muted/60 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary",
        shape === "round" ? "size-28 rounded-full" : "aspect-[16/9] w-full rounded-xl",
      )}
    >
      {src ? (
        <img src={src} alt="Selected preview" className="absolute inset-0 size-full object-cover" />
      ) : (
        <span className="flex flex-col items-center gap-2 px-4 text-center">
          <ImagePlus className="size-7" />
          {label}
        </span>
      )}
      {src && (
        <span className="absolute inset-0 grid place-items-center bg-secondary/55 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
          Change image
        </span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          const problem = validateImage(f);
          if (problem) {
            toast.error(problem);
            e.target.value = "";
            return;
          }
          onChange(f);
        }}
      />
    </button>
  );
}
