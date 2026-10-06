import type { Metadata } from "next";

import { RegisterForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a NexCart account to shop independent stores.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
