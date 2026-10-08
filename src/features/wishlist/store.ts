import { create } from "zustand";

type WishlistState = {
  ids: string[];
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

export const dummyWishlistIds = ["p4", "p5"];

export const useWishlistStore = create<WishlistState>((set) => ({
  ids: dummyWishlistIds,
  toggle: (productId) =>
    set((state) => ({
      ids: state.ids.includes(productId)
        ? state.ids.filter((id) => id !== productId)
        : [...state.ids, productId],
    })),
  remove: (productId) =>
    set((state) => ({
      ids: state.ids.filter((id) => id !== productId),
    })),
  clear: () => set({ ids: [] }),
}));

export function useWishlistCount() {
  return useWishlistStore((state) => state.ids.length);
}
