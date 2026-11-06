import { create } from "zustand";

import type { Product } from "@/types";

import { MAX_CART_QUANTITY, type CartLine } from "./types";

type CartState = {
  lines: CartLine[];
  add: (
    product: Product,
    quantity?: number,
    variant?: {
      id: string;
      price: number;
      originalPrice?: number;
      inStock?: boolean;
    },
  ) => boolean;
  setQuantity: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
};

function clampQuantity(quantity: number) {
  return Math.min(MAX_CART_QUANTITY, Math.max(1, Math.floor(quantity)));
}

export const useCartStore = create<CartState>((set) => ({
  lines: [],
  add: (product, quantity = 1, variant) => {
    const variantId = variant?.id ?? product.defaultVariantId;

    if (!variantId) {
      return false;
    }

    const lineProduct: Product = {
      ...product,
      defaultVariantId: variantId,
      price: variant?.price ?? product.price,
      originalPrice: variant?.originalPrice ?? product.originalPrice,
      inStock: variant?.inStock ?? product.inStock,
    };

    set((state) => {
      const existing = state.lines.find((line) => line.variantId === variantId);

      if (!existing) {
        return {
          lines: [
            ...state.lines,
            {
              variantId,
              productId: product.id,
              quantity: clampQuantity(quantity),
              product: lineProduct,
            },
          ],
        };
      }

      return {
        lines: state.lines.map((line) =>
          line.variantId === variantId
            ? {
                ...line,
                quantity: clampQuantity(line.quantity + quantity),
                product: lineProduct,
              }
            : line,
        ),
      };
    });

    return true;
  },
  setQuantity: (variantId, quantity) =>
    set((state) => ({
      lines: state.lines.map((line) =>
        line.variantId === variantId
          ? { ...line, quantity: clampQuantity(quantity) }
          : line,
      ),
    })),
  remove: (variantId) =>
    set((state) => ({
      lines: state.lines.filter((line) => line.variantId !== variantId),
    })),
  clear: () => set({ lines: [] }),
}));

export function useCartItemCount() {
  return useCartStore((state) =>
    state.lines.reduce((sum, line) => sum + line.quantity, 0),
  );
}
