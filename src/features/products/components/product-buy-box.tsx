"use client";

import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, ShoppingBag } from "@/lib/icons";
import { useCallback, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/cart";
import { WishlistToggle } from "@/features/wishlist";
import { discountPercent, formatPrice } from "@/lib/format";
import type { ProductDetail } from "@/types";

import { listProductVariants } from "../api/variants";
import {
  defaultVariant,
  findVariant,
  selectionFromVariant,
  variantAxes,
  variantImageFor,
} from "../lib/variant-selection";
import { useProductMedia } from "./product-media-context";
import { ProductVariantPicker } from "./product-variant-picker";

type ProductBuyBoxProps = {
  product: ProductDetail;
};

export function ProductBuyBox({ product }: ProductBuyBoxProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [userSelection, setUserSelection] = useState<Record<
    string,
    string
  > | null>(null);
  const { showImage } = useProductMedia();

  const hasOptions = (product.variantCount ?? 0) > 1;

  const variantsQuery = useQuery({
    queryKey: ["product-variants", product.id],
    queryFn: () => listProductVariants(product.id),
    enabled: hasOptions,
  });

  const variants = useMemo(
    () => variantsQuery.data?.items ?? [],
    [variantsQuery.data?.items],
  );

  const axes = useMemo(() => variantAxes(variants), [variants]);

  const defaultSelection = useMemo(() => {
    const initial = defaultVariant(variants);
    return initial ? selectionFromVariant(initial) : {};
  }, [variants]);

  const selection = userSelection ?? defaultSelection;

  const setSelection = useCallback(
    (next: Record<string, string>) => {
      const changed = Object.keys(next).find(
        (attributeId) => next[attributeId] !== selection[attributeId],
      );

      if (changed) {
        const nextImage = variantImageFor(variants, next, changed);

        if (
          nextImage &&
          nextImage !== variantImageFor(variants, selection, changed)
        ) {
          showImage(nextImage);
        }
      }

      setUserSelection(next);
    },
    [variants, selection, showImage],
  );

  const selected = useMemo(
    () => findVariant(variants, selection),
    [variants, selection],
  );

  const displayPrice = selected?.price ?? product.price;
  const displayOriginal =
    selected?.originalPrice ??
    (product.originalPrice && product.originalPrice > displayPrice
      ? product.originalPrice
      : undefined);
  const off = discountPercent(displayPrice, displayOriginal);
  const unavailable =
    hasOptions && variantsQuery.isSuccess
      ? !selected || selected.stock <= 0
      : product.inStock === false || !product.defaultVariantId;

  function addToCart() {
    if (unavailable) {
      return;
    }

    const ok = useCartStore.getState().add(
      product,
      quantity,
      selected
        ? {
            id: selected.id,
            price: selected.price,
            originalPrice: selected.originalPrice,
            inStock: selected.stock > 0,
          }
        : undefined,
    );

    if (!ok) {
      return;
    }

    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="mt-4 space-y-3">
      {hasOptions ? (
        variantsQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading options…</p>
        ) : variantsQuery.isError ? (
          <p className="text-sm text-destructive" role="alert">
            Options could not be loaded.
          </p>
        ) : (
          <ProductVariantPicker
            axes={axes}
            variants={variants}
            selection={selection}
            onChange={setSelection}
          />
        )
      ) : null}

      <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
        <p className="font-display text-3xl tracking-tight text-foreground">
          {formatPrice(displayPrice)}
        </p>
        {displayOriginal ? (
          <p className="pb-1 text-sm text-muted-foreground line-through">
            {formatPrice(displayOriginal)}
          </p>
        ) : null}
        {off > 0 ? (
          <span className="mb-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-[#fff4f2]">
            -{off}%
          </span>
        ) : null}
      </div>

      {selected && selected.stock > 0 && selected.stock <= 5 ? (
        <p className="text-xs text-muted-foreground">
          Only {selected.stock} left in this option
        </p>
      ) : null}

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
          disabled={unavailable || variantsQuery.isLoading}
        >
          <ShoppingBag className="size-4" />
          {unavailable ? "Out of stock" : added ? "Added" : "Add to cart"}
        </Button>
        <WishlistToggle product={product} variant="labeled" />
      </div>
    </div>
  );
}
