import type { Metadata } from "next";

import { TrackOrderView } from "@/features/orders";

export const metadata: Metadata = {
  title: "Track order",
  description: "Look up a NexCart shipment with your order number and email.",
};

export default function TrackOrderPage() {
  return <TrackOrderView />;
}
