import type { Metadata } from "next";

import { OrderHistoryView } from "@/features/orders";

export const metadata: Metadata = {
  title: "Order history",
  description: "Review the orders placed on your NexCart account.",
};

export default function OrdersPage() {
  return <OrderHistoryView />;
}
