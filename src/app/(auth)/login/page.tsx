import type { Metadata } from "next";

import { LoginForm } from "@/features/auth";
import { safeNextPath } from "@/features/auth/lib/next-path";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your NexCart account.",
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = Array.isArray(params.next) ? params.next[0] : params.next;

  return <LoginForm nextPath={safeNextPath(next)} />;
}
