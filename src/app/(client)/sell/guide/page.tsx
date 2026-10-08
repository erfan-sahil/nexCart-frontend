import type { Metadata } from "next";

import { SellerGuideView } from "@/features/seller-guide";

export const metadata: Metadata = {
  title: "Seller guide",
  description:
    "Who can sell on NexCart, what the application asks for, and how to list after approval.",
};

export default function SellerGuidePage() {
  return <SellerGuideView />;
}
