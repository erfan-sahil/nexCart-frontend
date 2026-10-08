import type { Metadata } from "next";

import { CookiesView } from "@/features/cookies";

export const metadata: Metadata = {
  title: "Cookies",
  description:
    "The one cookie NexCart sets to keep you signed in, and what else stays on this device.",
};

export default function CookiesPage() {
  return <CookiesView />;
}
