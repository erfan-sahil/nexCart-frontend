"use client";

import { ArrowLeft, ArrowRight, ImageOff } from "@/lib/icons";

import { MediaImage } from "@/components/common";
import { cn } from "@/lib/utils";

import { useProductMedia } from "./product-media-context";

type ProductGalleryProps = {
  images: string[];
  name: string;
};

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const { activeImage, showImage } = useProductMedia();
  const activeIndex = activeImage ? images.indexOf(activeImage) : -1;
  const index = activeIndex === -1 ? 0 : activeIndex;
  const current = images[index];
  const hasMany = images.length > 1;

  if (!current) {
    return (
      <div className="flex aspect-square flex-col items-center justify-center gap-2 rounded-3xl bg-surface-muted text-sm text-muted-foreground ring-1 ring-border/60">
        <ImageOff className="size-6" aria-hidden />
        No image
      </div>
    );
  }

  const step = (delta: number) => {
    const next = images[(index + delta + images.length) % images.length];

    if (next) {
      showImage(next);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="group relative aspect-square overflow-hidden rounded-3xl bg-surface-muted ring-1 ring-border/60">
        <MediaImage
          src={current}
          alt={name}
          priority
          sizes="(max-width: 1024px) 100vw, 640px"
          className="transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />

        {hasMany ? (
          <>
            <GalleryArrow
              direction="previous"
              onClick={() => step(-1)}
              className="left-3"
            />
            <GalleryArrow
              direction="next"
              onClick={() => step(1)}
              className="right-3"
            />
            <span className="absolute right-3 bottom-3 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground tabular-nums shadow-sm backdrop-blur-md">
              {index + 1} / {images.length}
            </span>
          </>
        ) : null}
      </div>

      {hasMany ? (
        <div
          role="group"
          aria-label={`${name} images`}
          className="grid grid-cols-5 gap-2 p-1 sm:gap-3"
        >
          {images.map((src, position) => {
            const selected = position === index;

            return (
              <button
                key={src}
                type="button"
                aria-pressed={selected}
                aria-label={`Show image ${position + 1} of ${images.length}`}
                onClick={() => showImage(src)}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-2xl bg-surface-muted transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  selected
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : "opacity-60 ring-1 ring-border/60 hover:opacity-100",
                )}
              >
                <MediaImage src={src} alt="" sizes="128px" />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

type GalleryArrowProps = {
  direction: "previous" | "next";
  onClick: () => void;
  className: string;
};

function GalleryArrow({ direction, onClick, className }: GalleryArrowProps) {
  const Icon = direction === "previous" ? ArrowLeft : ArrowRight;

  return (
    <button
      type="button"
      aria-label={direction === "previous" ? "Previous image" : "Next image"}
      onClick={onClick}
      className={cn(
        "absolute top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-md backdrop-blur-md transition-all duration-200 outline-none hover:scale-105 hover:bg-background focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring sm:opacity-0 sm:group-hover:opacity-100",
        className,
      )}
    >
      <Icon weight="line-duotone" className="size-5" aria-hidden />
    </button>
  );
}
