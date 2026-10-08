import type { Metadata } from "next";

import { PrivacyView } from "@/features/privacy";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What NexCart collects when you shop, sell, or contact us, and how that information is used.",
};

export default function PrivacyPage() {
  return <PrivacyView />;
}
