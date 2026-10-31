import type { Metadata } from "next";

import { RecentlyViewedView } from "@/features/recently-viewed";

export const metadata: Metadata = {
  title: "Recently viewed",
  description: "Jump back into products you already opened.",
};

export default function RecentlyViewedPage() {
  return <RecentlyViewedView />;
}
