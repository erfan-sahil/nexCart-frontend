import type { Metadata } from "next";

import { WishlistView } from "@/features/wishlist";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Products you saved to buy later on NexCart.",
};

export default function WishlistPage() {
  return <WishlistView />;
}
