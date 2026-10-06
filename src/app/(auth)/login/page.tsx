import type { Metadata } from "next";

import { LoginForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your NexCart account.",
};

export default function LoginPage() {
  return <LoginForm />;
}
