import type { Metadata } from "next";

import { RegisterForm } from "@/features/auth";
import { safeNextPath } from "@/features/auth/lib/next-path";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a NexCart account to shop independent stores.",
};

type RegisterPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const params = await searchParams;
  const next = Array.isArray(params.next) ? params.next[0] : params.next;

  return <RegisterForm nextPath={safeNextPath(next)} />;
}
