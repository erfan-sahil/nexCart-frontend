import { create } from "zustand";

import type { Product } from "@/types";

type WishlistEntry = {
  id: string;
  product?: Product;
};

type WishlistState = {
  entries: WishlistEntry[];
  toggle: (product: Product) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const dummyEntries: WishlistEntry[] = [{ id: "p4" }, { id: "p5" }];

export const useWishlistStore = create<WishlistState>((set) => ({
  entries: dummyEntries,
  toggle: (product) =>
    set((state) => ({
      entries: state.entries.some((entry) => entry.id === product.id)
        ? state.entries.filter((entry) => entry.id !== product.id)
        : [...state.entries, { id: product.id, product }],
    })),
  remove: (productId) =>
    set((state) => ({
      entries: state.entries.filter((entry) => entry.id !== productId),
    })),
  clear: () => set({ entries: [] }),
}));

export function useWishlistCount() {
  return useWishlistStore((state) => state.entries.length);
}
