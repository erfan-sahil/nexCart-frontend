import type { Metadata } from "next";

import { FeesView } from "@/features/fees";

export const metadata: Metadata = {
  title: "Fees & payouts",
  description:
    "The NexCart referral fee, what stays out of it, and how seller payouts are sent.",
};

export default function FeesPage() {
  return <FeesView />;
}
