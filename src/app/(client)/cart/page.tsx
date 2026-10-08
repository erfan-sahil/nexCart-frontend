import type { Metadata } from "next";

import { CartView } from "@/features/cart";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review the items in your NexCart bag before checkout.",
};

export default function CartPage() {
  return <CartView />;
}
