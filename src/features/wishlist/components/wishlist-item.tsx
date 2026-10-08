"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, ShoppingBag, Star } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/cart";
import { discountPercent, formatCount, formatPrice } from "@/lib/format";
import type { Product } from "@/types";

import { useWishlistStore } from "../store";

type WishlistItemProps = {
  product: Product;
};

export function WishlistItem({ product }: WishlistItemProps) {
  const add = useCartStore((state) => state.add);
  const remove = useWishlistStore((state) => state.remove);
  const [added, setAdded] = useState(false);
  const off = discountPercent(product.price, product.originalPrice);

  function addToCart() {
    add(product.id);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <li className="flex gap-4 border-b border-border px-4 py-4 last:border-b-0 sm:px-5">
      <Link
        href={`/products/${product.slug}`}
        className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-surface-muted sm:size-28"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="112px"
          className="object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <Link
            href={`/stores/${product.store.slug}`}
            className="inline-flex max-w-full items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
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
            <h2 className="mt-1.5 line-clamp-2 font-display text-base leading-snug font-semibold tracking-tight transition-colors hover:text-primary sm:text-lg">
              {product.name}
            </h2>
          </Link>
          <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Star className="size-3.5 fill-primary text-primary" />
            <span className="font-medium text-foreground">
              {product.rating}
            </span>
            <span>({formatCount(product.reviewCount)})</span>
            {product.badge ? (
              <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-medium text-primary">
                {product.badge}
              </span>
            ) : null}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 sm:w-44 sm:flex-col sm:items-end">
          <div className="text-left sm:text-right">
            <p className="text-base font-semibold tracking-tight">
              {formatPrice(product.price)}
            </p>
            {product.originalPrice ? (
              <p className="mt-0.5 text-sm text-muted-foreground">
                <span className="line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                {off > 0 ? (
                  <span className="ml-1.5 font-medium text-primary">
                    -{off}%
                  </span>
                ) : null}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="h-9 rounded-full px-3.5 text-sm font-semibold"
              onClick={addToCart}
            >
              {added ? (
                <Check className="size-4" />
              ) : (
                <ShoppingBag className="size-4" />
              )}
              {added ? "Added" : "Add"}
            </Button>
            <Button
              variant="ghost"
              className="h-9 rounded-full px-3 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={() => remove(product.id)}
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
}
