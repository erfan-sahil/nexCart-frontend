import { create } from "zustand";

import { MAX_CART_QUANTITY, type CartLine } from "./types";

type CartState = {
  lines: CartLine[];
  add: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

export const dummyCartLines: CartLine[] = [
  { productId: "p1", quantity: 1 },
  { productId: "p2", quantity: 2 },
  { productId: "p3", quantity: 1 },
];

function clampQuantity(quantity: number) {
  return Math.min(MAX_CART_QUANTITY, Math.max(1, Math.floor(quantity)));
}

export const useCartStore = create<CartState>((set) => ({
  lines: dummyCartLines,
  add: (productId, quantity = 1) =>
    set((state) => {
      const existing = state.lines.find((line) => line.productId === productId);

      if (!existing) {
        return {
          lines: [
            ...state.lines,
            { productId, quantity: clampQuantity(quantity) },
          ],
        };
      }

      return {
        lines: state.lines.map((line) =>
          line.productId === productId
            ? { ...line, quantity: clampQuantity(line.quantity + quantity) }
            : line,
        ),
      };
    }),
  setQuantity: (productId, quantity) =>
    set((state) => ({
      lines: state.lines.map((line) =>
        line.productId === productId
          ? { ...line, quantity: clampQuantity(quantity) }
          : line,
      ),
    })),
  remove: (productId) =>
    set((state) => ({
      lines: state.lines.filter((line) => line.productId !== productId),
    })),
  clear: () => set({ lines: [] }),
}));

export function useCartItemCount() {
  return useCartStore((state) =>
    state.lines.reduce((sum, line) => sum + line.quantity, 0),
  );
}
