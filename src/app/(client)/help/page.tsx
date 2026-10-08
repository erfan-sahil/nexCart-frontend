import type { Metadata } from "next";

import { HelpCenterView } from "@/features/help";

export const metadata: Metadata = {
  title: "Help center",
  description:
    "Find answers about orders, returns, your NexCart account, and selling.",
};

export default function HelpPage() {
  return <HelpCenterView />;
}
