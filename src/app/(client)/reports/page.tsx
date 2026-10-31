import type { Metadata } from "next";

import { ProductReportsInboxView } from "@/features/reports";

export const metadata: Metadata = {
  title: "Product reports",
  description: "Review shopper reports for marketplace listings.",
};

export default function ProductReportsPage() {
  return <ProductReportsInboxView />;
}
