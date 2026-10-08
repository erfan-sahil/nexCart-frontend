"use client";

import { Check, ShoppingBag } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { useCartStore } from "../store";

type AddToCartButtonProps = {
  productId: string;
  name: string;
  className?: string;
};

export function AddToCartButton({
  productId,
  name,
  className,
}: AddToCartButtonProps) {
  const add = useCartStore((state) => state.add);
  const [added, setAdded] = useState(false);

  function addToCart() {
    add(productId);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <button
      type="button"
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-[#fff4f2] transition-colors duration-300 hover:bg-ink hover:text-[#fff4f2]",
        className,
      )}
      aria-label={added ? `Added ${name} to cart` : `Add ${name} to cart`}
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
