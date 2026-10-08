import type { Metadata } from "next";

import { ReturnsView } from "@/features/returns";

export const metadata: Metadata = {
  title: "Returns & refunds",
  description:
    "How to return an item on NexCart within 30 days of delivery, and when the refund is issued.",
};

export default function ReturnsPage() {
  return <ReturnsView />;
}
