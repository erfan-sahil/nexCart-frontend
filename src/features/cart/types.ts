import type { Product } from "@/types";

export const MAX_CART_QUANTITY = 10;

export type CartLine = {
  productId: string;
  quantity: number;
};

export type ResolvedCartLine = {
  product: Product;
  quantity: number;
};

export type PaymentMethod = "bkash" | "cod";

export type CheckoutValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  line1: string;
  city: string;
  region: string;
  postalCode: string;
  paymentMethod: PaymentMethod;
  bkashNumber: string;
};

export type PlacedOrder = {
  id: string;
  email: string;
  recipient: string;
  address: string;
  paymentLabel: string;
  itemCount: number;
  total: number;
};
