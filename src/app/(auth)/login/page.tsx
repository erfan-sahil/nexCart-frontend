import type { Metadata } from "next";

import { LoginForm } from "@/features/auth";
import { safeNextPath } from "@/features/auth/lib/next-path";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your NexCart account.",
};

type LoginPageProps = {
  searchParams: Promise<{
    next?: string | string[];
    error?: string | string[];
    message?: string | string[];
  }>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <LoginForm
      nextPath={safeNextPath(firstParam(params.next))}
      oauthError={firstParam(params.error) ?? null}
      oauthMessage={firstParam(params.message) ?? null}
    />
  );
}
