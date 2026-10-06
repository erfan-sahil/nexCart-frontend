import type { Metadata } from "next";

import { AccountProfile } from "@/features/auth/components/account-profile";

export const metadata: Metadata = {
  title: "Account",
  description: "Your NexCart profile.",
};

export default function AccountPage() {
  return <AccountProfile />;
}
