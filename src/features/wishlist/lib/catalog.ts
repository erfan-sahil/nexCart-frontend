import { products } from "@/data/mock";
import type { Product } from "@/types";

type WishlistEntry = {
  id: string;
  product?: Product;
};

export function resolveWishlist(entries: WishlistEntry[]): Product[] {
  return entries.flatMap((entry) => {
    const product =
      entry.product ?? products.find((item) => item.id === entry.id);
    return product ? [product] : [];
  });
}
