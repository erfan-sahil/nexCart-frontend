"use client";

import { useState } from "react";

import { MediaImage } from "@/components/common";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  name: string;
};

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  if (!current) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl border border-border bg-surface-muted text-sm text-muted-foreground">
        No image
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-surface-muted">
        <MediaImage
          src={current}
          alt={name}
          priority
          sizes="(max-width: 1024px) 100vw, 640px"
        />
      </div>
      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show image ${index + 1} of ${name}`}
              aria-pressed={index === active}
              className={cn(
                "relative aspect-square overflow-hidden rounded-xl border bg-surface-muted",
                index === active ? "border-primary" : "border-border",
              )}
            >
              <MediaImage src={src} alt="" sizes="140px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
