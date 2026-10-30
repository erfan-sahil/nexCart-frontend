import type { ResolvedCartLine } from "./catalog";
import { CHECKOUT_DELIVERY_FEE } from "../types";

export type CartTotals = {
  itemCount: number;
  subtotal: number;
  savings: number;
  deliveryFee: number;
  total: number;
};

function money(value: number) {
  return Math.round(value * 100) / 100;
}

/** Local estimate; checkout uses server quote before placing the order. */
export function getCartTotals(lines: ResolvedCartLine[]): CartTotals {
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = money(
    lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0),
  );
  const savings = money(
    lines.reduce((sum, line) => {
      const original = line.product.originalPrice;
      if (!original || original <= line.product.price) return sum;
      return sum + (original - line.product.price) * line.quantity;
    }, 0),
  );
  const deliveryFee = itemCount === 0 ? 0 : CHECKOUT_DELIVERY_FEE;
  const total = money(subtotal + deliveryFee);

  return {
    itemCount,
    subtotal,
    savings,
    deliveryFee,
    total,
  };
}

export function totalsFromQuote(totals: {
  itemsSubtotal: number;
  deliveryFee: number;
  grandTotal: number;
  amountDueNow: number;
}) {
  return {
    subtotal: totals.itemsSubtotal,
    deliveryFee: totals.deliveryFee,
    total: totals.grandTotal,
    dueNow: totals.amountDueNow,
  };
}
