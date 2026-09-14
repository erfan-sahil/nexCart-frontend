import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";

import { discountPercent, formatCount, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

type ProductCardProps = {
  product: Product;
  variant?: "default" | "compact";
};

export function ProductCard({
  product,
  variant = "default",
}: ProductCardProps) {
  const off = discountPercent(product.price, product.originalPrice);
  const compact = variant === "compact";

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-[0_8px_30px_rgba(10,10,10,0.06)]",
        compact && "min-w-[180px] sm:min-w-[210px]",
      )}
    >
      <div className="relative overflow-hidden bg-surface-muted">
        <Link
          href={`/products/${product.slug}`}
          className={cn(
            "relative block",
            compact ? "aspect-square" : "aspect-[4/5]",
          )}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        {off > 0 ? (
          <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
            -{off}%
          </span>
        ) : null}
        {product.badge ? (
          <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-ink/80 px-2 py-0.5 text-[11px] font-medium text-white">
            {product.badge}
          </span>
        ) : null}
        <button
          type="button"
          className="absolute right-3 bottom-3 inline-flex size-8 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition-colors hover:text-primary"
          aria-label={`Save ${product.name}`}
        >
          <Heart className="size-4" />
        </button>
      </div>

      <div className={cn("flex flex-1 flex-col", compact ? "p-3" : "p-4")}>
        <Link
          href={`/stores/${product.store.slug}`}
          className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase hover:text-primary"
        >
          {product.store.name}
        </Link>
        <Link href={`/products/${product.slug}`} className="mt-1">
          <h3
            className={cn(
              "line-clamp-2 font-medium text-ink transition-colors group-hover:text-primary",
              compact ? "text-sm" : "text-[15px] leading-snug",
            )}
          >
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3.5 fill-primary text-primary" />
          <span className="font-medium text-ink">{product.rating}</span>
          <span>({formatCount(product.reviewCount)})</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div>
            <p className="text-base font-semibold text-primary">
              {formatPrice(product.price)}
            </p>
            {product.originalPrice ? (
              <p className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-brand-hover"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="size-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
