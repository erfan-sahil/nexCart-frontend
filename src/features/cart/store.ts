import { create } from "zustand";

import type { Product } from "@/types";

import { MAX_CART_QUANTITY, type CartLine } from "./types";

type CartState = {
  lines: CartLine[];
  add: (product: Product, quantity?: number) => boolean;
  setQuantity: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
};

function clampQuantity(quantity: number) {
  return Math.min(MAX_CART_QUANTITY, Math.max(1, Math.floor(quantity)));
}

export const useCartStore = create<CartState>((set) => ({
  lines: [],
  add: (product, quantity = 1) => {
    const variantId = product.defaultVariantId;

    if (!variantId) {
      return false;
    }

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
              product,
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
                product,
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
