import type { Product } from "@/types";

export const MAX_CART_QUANTITY = 10;

/** Flat delivery fee per checkout (matches backend default). */
export const CHECKOUT_DELIVERY_FEE = 100;

export type CartLine = {
  variantId: string;
  productId: string;
  quantity: number;
  product?: Product;
};

export type PaymentMethod = "prepaid" | "cod";

export type CheckoutValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  line1: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  paymentMethod: PaymentMethod;
  note: string;
};

export type PlacedOrder = {
  id: string;
  orderNumber: string;
  email: string;
  recipient: string;
  address: string;
  paymentLabel: string;
  itemCount: number;
  total: number;
  status: string;
};
