import type { Metadata } from "next";

import { TermsView } from "@/features/terms";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "The rules for shopping and selling on NexCart, including orders, returns, and seller fees.",
};

export default function TermsPage() {
  return <TermsView />;
}
