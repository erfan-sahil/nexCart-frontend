"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/cart";
import { WishlistToggle } from "@/features/wishlist";
import { discountPercent, formatPrice } from "@/lib/format";
import type { ProductDetail } from "@/types";

type ProductBuyBoxProps = {
  product: ProductDetail;
};

export function ProductBuyBox({ product }: ProductBuyBoxProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const off = discountPercent(product.price, product.originalPrice);

  function addToCart() {
    useCartStore.getState().add(product.id, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
        <p className="font-display text-3xl tracking-tight text-foreground">
          {formatPrice(product.price)}
        </p>
        {product.originalPrice ? (
          <p className="pb-1 text-sm text-muted-foreground line-through">
            {formatPrice(product.originalPrice)}
          </p>
        ) : null}
        {off > 0 ? (
          <span className="mb-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-[#fff4f2]">
            -{off}%
          </span>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center rounded-full border border-border bg-card">
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:text-primary disabled:opacity-40"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          >
            <Minus className="size-4" />
          </button>
          <span className="w-8 text-center text-sm font-semibold tabular-nums">
            {quantity}
          </span>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:text-primary disabled:opacity-40"
            aria-label="Increase quantity"
            disabled={quantity >= 10}
            onClick={() => setQuantity((value) => Math.min(10, value + 1))}
          >
            <Plus className="size-4" />
          </button>
        </div>
        <Button
          className="auth-orange-button h-11 min-w-40 flex-1 px-6"
          onClick={addToCart}
        >
          <ShoppingBag className="size-4" />
          {added ? "Added" : "Add to cart"}
        </Button>
        <WishlistToggle
          productId={product.id}
          name={product.name}
          variant="labeled"
        />
      </div>
    </div>
  );
}
