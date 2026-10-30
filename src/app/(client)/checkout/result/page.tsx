import type { Metadata } from "next";
import { Suspense } from "react";

import { CheckoutResultView } from "@/features/cart/components/checkout-result-view";

export const metadata: Metadata = {
  title: "Checkout result",
  description: "Payment result for your NexCart order.",
};

export default function CheckoutResultPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutResultView />
    </Suspense>
  );
}
