import type { ResolvedCartLine } from "../types";

export const FREE_SHIPPING_AT = 75;
export const SHIPPING_FEE = 8.99;
export const TAX_RATE = 0.08;

export type CartTotals = {
  itemCount: number;
  subtotal: number;
  savings: number;
  shipping: number;
  tax: number;
  total: number;
  freeShippingRemaining: number;
};

function money(value: number) {
  return Math.round(value * 100) / 100;
}

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
  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_FEE;
  const tax = money(subtotal * TAX_RATE);
  const total = money(subtotal + shipping + tax);

  return {
    itemCount,
    subtotal,
    savings,
    shipping,
    tax,
    total,
    freeShippingRemaining: Math.max(0, money(FREE_SHIPPING_AT - subtotal)),
  };
}
