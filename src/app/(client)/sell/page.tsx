import type { Metadata } from "next";

import { SellApplication } from "@/features/vendor-application/components/sell-application";

export const metadata: Metadata = {
  title: "Sell on NexCart",
  description: "Apply to open a store on NexCart.",
};

export default function SellPage() {
  return <SellApplication />;
}
