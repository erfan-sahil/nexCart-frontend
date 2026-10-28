import Image from "next/image";

import { cn } from "@/lib/utils";

type MediaImageProps = {
  src?: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

export function MediaImage({
  src,
  alt,
  sizes,
  className,
  priority,
}: MediaImageProps) {
  if (!src) return null;

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={!src.includes("images.unsplash.com")}
      className={cn("object-cover", className)}
    />
  );
}
