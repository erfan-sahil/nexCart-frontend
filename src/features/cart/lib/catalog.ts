import { products } from "@/data/mock";
import type { StoreSummary } from "@/types";

import type { CartLine, ResolvedCartLine } from "../types";

export function resolveCartLines(lines: CartLine[]): ResolvedCartLine[] {
  return lines.flatMap((line) => {
    const product = products.find((item) => item.id === line.productId);
    if (!product) return [];
    return [{ product, quantity: line.quantity }];
  });
}

export function groupCartByStore(lines: ResolvedCartLine[]) {
  const groups = new Map<
    string,
    { store: StoreSummary; lines: ResolvedCartLine[] }
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
