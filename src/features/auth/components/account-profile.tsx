"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Container, PageBreadcrumb } from "@/components/common";
import { Button } from "@/components/ui/button";

import { displayName, roleLabel } from "../lib/profile";
import { useAuthStore } from "../store";
import { useMe } from "../use-me";
import { UserAvatar } from "./user-avatar";

function formatDate(value: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AccountProfile() {
  const router = useRouter();
  const status = useAuthStore((state) => state.status);
  const profile = useMe();

  useEffect(() => {
    if (status === "anonymous") {
      router.replace("/login");
    }
  }, [router, status]);

  if (status === "loading" || profile.isLoading || status === "anonymous") {
    return (
      <Container className="py-10">
        <div className="h-8 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-6 h-48 animate-pulse rounded-2xl bg-muted" />
      </Container>
    );
  }

  if (profile.isError || !profile.data) {
    return (
      <Container className="py-16 text-center">
        <h1 className="text-2xl font-semibold">Could not load your profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The account request failed. Try again in a moment.
        </p>
        <Button
          className="auth-orange-button mt-6 px-6 hover:bg-ink hover:text-[#fff4f2]"
          onClick={() => profile.refetch()}
        >
          Retry
        </Button>
      </Container>
    );
  }

  const { user } = profile.data;
  const details = [
    { label: "Email", value: user.email },
    { label: "Phone", value: user.phone || "Not added" },
    { label: "Role", value: roleLabel(user.role) },
    {
      label: "Status",
      value: user.status === "active" ? "Active" : "Suspended",
    },
    {
      label: "Email verification",
      value: user.emailVerified ? "Verified" : "Not verified",
    },
    { label: "Last sign-in", value: formatDate(user.lastLoginAt) },
    { label: "Member since", value: formatDate(user.createdAt) },
  ];

  return (
    <Container className="py-8 sm:py-10">
      <PageBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Account" }]}
      />
      <div className="mt-6 flex items-center gap-4">
        <UserAvatar user={user} className="size-14 text-base" />
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Your account
          </p>
          <h1 className="mt-1 text-3xl">{displayName(user)}</h1>
        </div>
      </div>
      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        {details.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-border bg-background px-4 py-4"
          >
            <dt className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              {item.label}
            </dt>
            <dd className="mt-1 text-sm font-medium">{item.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button
          variant="outline"
          nativeButton={false}
          className="rounded-full border-primary/40 px-4 hover:border-primary hover:bg-primary hover:text-[#fff4f2]"
          render={<Link href="/orders" />}
        >
          View orders
        </Button>
        <Button
          variant="outline"
          nativeButton={false}
          className="rounded-full border-primary/40 px-4 hover:border-primary hover:bg-primary hover:text-[#fff4f2]"
          render={<Link href="/wishlist" />}
        >
          Wishlist
        </Button>
      </div>
    </Container>
  );
}
