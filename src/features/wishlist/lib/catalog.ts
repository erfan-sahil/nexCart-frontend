import { products } from "@/data/mock";
import type { Product } from "@/types";

export function resolveWishlist(ids: string[]): Product[] {
  return ids.flatMap((id) => {
    const product = products.find((item) => item.id === id);
    return product ? [product] : [];
  });
}
