import Link from "next/link";
import { Star } from "lucide-react";

import { MediaImage } from "@/components/common";
import { AddToCartButton } from "@/features/cart";
import { WishlistToggle } from "@/features/wishlist";
import { discountPercent, formatCount, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

function ratingLabel(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

type ProductCardProps = {
  product: Product;
  className?: string;
  size?: "default" | "compact";
};

export function ProductCard({
  product,
  className,
  size = "default",
}: ProductCardProps) {
  const off = discountPercent(product.price, product.originalPrice);
  const compact = size === "compact";

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden border border-border bg-card",
        compact ? "rounded-xl" : "rounded-2xl",
        className,
      )}
    >
      <div className="relative bg-surface-muted">
        <Link
          href={`/products/${product.slug}`}
          className="relative block aspect-square overflow-hidden"
        >
          <MediaImage
            src={product.image}
            alt={product.name}
            sizes={
              compact
                ? "(max-width: 640px) 46vw, (max-width: 1024px) 22vw, 180px"
                : "(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 220px"
            }
            className="transition duration-500 group-hover:scale-105"
          />
        </Link>

        <div
          className={cn(
            "pointer-events-none absolute flex flex-col items-start",
            compact ? "top-2 left-2 gap-1" : "top-2.5 left-2.5 gap-1.5",
          )}
        >
          {off > 0 ? (
            <span
              className={cn(
                "rounded-full bg-primary font-semibold text-[#fff4f2]",
                compact
                  ? "px-1.5 py-px text-[10px]"
                  : "px-2 py-0.5 text-[11px]",
              )}
            >
              -{off}%
            </span>
          ) : null}
          {product.badge ? (
            <span
              className={cn(
                "rounded-full bg-card/95 font-medium text-foreground shadow-sm",
                compact
                  ? "px-1.5 py-px text-[10px]"
                  : "px-2 py-0.5 text-[11px]",
              )}
            >
              {product.badge}
            </span>
          ) : null}
        </div>

        <WishlistToggle
          product={product}
          className={compact ? "top-1.5 right-1.5 size-7" : undefined}
        />
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col bg-card transition-colors duration-300 group-hover:bg-brand-soft",
          compact ? "gap-1.5 p-2" : "gap-2 p-3",
        )}
      >
        <Link
          href={`/stores/${product.store.slug}`}
          className={cn(
            "inline-flex min-w-0 items-center font-medium text-muted-foreground transition-colors hover:text-primary",
            compact ? "gap-1 text-[10px]" : "gap-1.5 text-[11px]",
          )}
        >
          <span
            className={cn(
              "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-muted font-semibold ring-1 ring-border",
              compact ? "size-4 text-[8px]" : "size-5 text-[9px]",
            )}
          >
            <MediaImage
              src={product.store.logo}
              alt=""
              sizes={compact ? "16px" : "20px"}
            />
            {product.store.logo ? null : product.store.name.slice(0, 1)}
          </span>
          <span className="truncate">{product.store.name}</span>
        </Link>

        <Link href={`/products/${product.slug}`}>
          <h3
            className={cn(
              "line-clamp-2 font-display font-semibold text-foreground transition-colors group-hover:text-primary",
              compact
                ? "min-h-8 text-xs leading-4"
                : "min-h-10 text-sm leading-5",
            )}
          >
            {product.name}
          </h3>
        </Link>

        <div
          className={cn(
            "flex items-center justify-between gap-2 text-muted-foreground",
            compact ? "text-[10px]" : "text-[11px]",
          )}
        >
          <p className="inline-flex min-w-0 items-center gap-1">
            <Star
              className={cn(
                "shrink-0 fill-primary text-primary",
                compact ? "size-3" : "size-3.5",
              )}
            />
            <span className="font-semibold text-foreground">
              {ratingLabel(product.rating)}
            </span>
            <span>({formatCount(product.reviewCount)})</span>
          </p>
          {product.sold ? (
            <p className="shrink-0">{formatCount(product.sold)} sold</p>
          ) : null}
        </div>

        <div
          className={cn(
            "mt-auto flex items-center justify-between gap-2 border-t border-border/80",
            compact ? "pt-2" : "pt-2.5",
          )}
        >
          <p className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
            <span
              className={cn(
                "leading-none font-semibold tracking-tight text-foreground",
                compact ? "text-sm" : "text-base",
              )}
            >
              {formatPrice(product.price)}
            </span>
            {product.originalPrice ? (
              <span
                className={cn(
                  "leading-none text-muted-foreground line-through",
                  compact ? "text-[11px]" : "text-xs",
                )}
              >
                {formatPrice(product.originalPrice)}
              </span>
            ) : null}
          </p>
          <AddToCartButton
            product={product}
            className={compact ? "size-7" : undefined}
          />
        </div>
      </div>
    </article>
  );
}
