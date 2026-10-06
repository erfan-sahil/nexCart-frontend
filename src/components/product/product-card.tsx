import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";

import { discountPercent, formatCount, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

type ProductCardProps = {
  product: Product;
  className?: string;
};

export function ProductCard({ product, className }: ProductCardProps) {
  const off = discountPercent(product.price, product.originalPrice);

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card",
        className,
      )}
    >
      <div className="relative bg-surface-muted">
        <Link
          href={`/products/${product.slug}`}
          className="relative block aspect-square overflow-hidden"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 220px"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>

        <div className="pointer-events-none absolute top-2.5 left-2.5 flex flex-col items-start gap-1.5">
          {off > 0 ? (
            <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
              -{off}%
            </span>
          ) : null}
          {product.badge ? (
            <span className="rounded-full bg-card/95 px-2 py-0.5 text-[11px] font-medium text-foreground shadow-sm">
              {product.badge}
            </span>
          ) : null}
        </div>

        <button
          type="button"
          className="absolute top-2.5 right-2.5 inline-flex size-8 items-center justify-center rounded-full bg-card/95 text-muted-foreground shadow-sm transition-colors hover:text-primary"
          aria-label={`Save ${product.name}`}
        >
          <Heart className="size-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 bg-card p-3 transition-colors duration-300 group-hover:bg-brand-soft">
        <Link
          href={`/stores/${product.store.slug}`}
          className="inline-flex min-w-0 items-center gap-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <span className="relative size-5 shrink-0 overflow-hidden rounded-full bg-surface-muted ring-1 ring-border">
            <Image
              src={product.store.logo}
              alt=""
              fill
              sizes="20px"
              className="object-cover"
            />
          </span>
          <span className="truncate">{product.store.name}</span>
        </Link>

        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-10 font-display text-sm leading-5 font-semibold text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <p className="inline-flex min-w-0 items-center gap-1">
            <Star className="size-3.5 shrink-0 fill-primary text-primary" />
            <span className="font-semibold text-foreground">
              {product.rating}
            </span>
            <span>({formatCount(product.reviewCount)})</span>
          </p>
          {product.sold ? (
            <p className="shrink-0">{formatCount(product.sold)} sold</p>
          ) : null}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border/80 pt-2.5">
          <p className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
            <span className="text-base leading-none font-semibold tracking-tight text-foreground">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice ? (
              <span className="text-xs leading-none text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            ) : null}
          </p>
          <button
            type="button"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors duration-300 hover:bg-ink hover:text-primary"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="size-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
