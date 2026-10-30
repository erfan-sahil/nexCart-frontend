import type { Product } from "@/types";

import { MAX_CART_QUANTITY, type CartLine } from "../types";

export type ResolvedCartLine = {
  variantId: string;
  product: Product;
  quantity: number;
};

export function resolveCartLines(lines: CartLine[]): ResolvedCartLine[] {
  return lines.flatMap((line) => {
    if (!line.variantId || !line.product) return [];
    return [
      {
        variantId: line.variantId,
        product: line.product,
        quantity: line.quantity,
      },
    ];
  });
}

export function cartItemsForCheckout(lines: ResolvedCartLine[]) {
  return lines.map((line) => ({
    variantId: line.variantId,
    quantity: line.quantity,
  }));
}

export function groupCartByStore(lines: ResolvedCartLine[]) {
  const groups = new Map<
    string,
    { store: Product["store"]; lines: ResolvedCartLine[] }
  >();

  for (const line of lines) {
    const current = groups.get(line.product.store.id);

    if (current) {
      current.lines.push(line);
      continue;
    }

    groups.set(line.product.store.id, {
      store: line.product.store,
      lines: [line],
    });
  }

  return [...groups.values()];
}
