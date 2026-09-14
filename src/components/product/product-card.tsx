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
        "group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-[0_8px_24px_rgba(10,10,10,0.06)]",
        compact && "w-36 shrink-0 sm:w-40",
      )}
    >
      <div className="relative overflow-hidden bg-surface-muted">
        <Link
          href={`/products/${product.slug}`}
          className="relative block aspect-square"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        {off > 0 ? (
          <span className="pointer-events-none absolute top-2 left-2 rounded-full bg-primary px-1.5 py-px text-[10px] font-semibold text-primary-foreground">
            -{off}%
          </span>
        ) : null}
        {product.badge ? (
          <span className="pointer-events-none absolute top-2 right-2 rounded-full bg-ink/80 px-1.5 py-px text-[10px] font-medium text-white">
            {product.badge}
          </span>
        ) : null}
        <button
          type="button"
          className="absolute right-2 bottom-2 inline-flex size-7 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition-colors hover:text-primary"
          aria-label={`Save ${product.name}`}
        >
          <Heart className="size-3.5" />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-2.5">
        <Link
          href={`/stores/${product.store.slug}`}
          className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase hover:text-primary"
        >
          {product.store.name}
        </Link>
        <Link href={`/products/${product.slug}`} className="mt-0.5">
          <h3 className="line-clamp-2 text-[13px] leading-snug font-medium text-ink transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>

        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
          <Star className="size-3 fill-primary text-primary" />
          <span className="font-medium text-ink">{product.rating}</span>
          <span>({formatCount(product.reviewCount)})</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-1.5 pt-2">
          <div>
            <p className="text-sm font-semibold text-primary">
              {formatPrice(product.price)}
            </p>
            {product.originalPrice ? (
              <p className="text-[11px] text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            className="inline-flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-brand-hover"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="size-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
