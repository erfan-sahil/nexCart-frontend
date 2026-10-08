import type { Metadata } from "next";

import { CheckoutView } from "@/features/cart";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Enter delivery details and place your NexCart order.",
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
