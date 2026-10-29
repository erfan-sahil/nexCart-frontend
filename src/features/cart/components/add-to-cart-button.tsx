"use client";

import { Check, ShoppingBag } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import type { Product } from "@/types";

import { useCartStore } from "../store";

type AddToCartButtonProps = {
  product: Product;
  className?: string;
};

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const add = useCartStore((state) => state.add);
  const [added, setAdded] = useState(false);
  const [failed, setFailed] = useState(false);
  const unavailable = product.inStock === false || !product.defaultVariantId;

  function addToCart() {
    if (unavailable) return;
    const ok = add(product, 1);
    if (!ok) {
      setFailed(true);
      window.setTimeout(() => setFailed(false), 2000);
      return;
    }
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <button
      type="button"
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-[#fff4f2] transition-colors duration-300 hover:bg-ink hover:text-[#fff4f2] disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
      aria-label={
        unavailable
          ? `${product.name} is out of stock`
          : added
            ? `Added ${product.name} to cart`
            : `Add ${product.name} to cart`
      }
      disabled={unavailable}
      onClick={addToCart}
    >
      {added ? (
        <Check className="size-3.5" />
      ) : (
        <ShoppingBag className="size-3.5" />
      )}
    </button>
  );
}
