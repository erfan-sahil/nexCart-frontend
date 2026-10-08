"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, MapPin, Package, Pencil } from "lucide-react";
import { useEffect, useState } from "react";

import { Container, PageBreadcrumb } from "@/components/common";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { displayName, roleLabel } from "../lib/profile";
import { useAuthStore } from "../store";
import type { AuthUser } from "../types";
import { useMe } from "../use-me";
import { AccountEditor } from "./account-editor";
import { UserAvatar } from "./user-avatar";

const shortcuts = [
  {
    href: "/orders",
    label: "Orders",
    hint: "Purchases and returns",
    icon: Package,
  },
  {
    href: "/wishlist",
    label: "Wishlist",
    hint: "Products you saved",
    icon: Heart,
  },
  {
    href: "/track-order",
    label: "Track order",
    hint: "Follow a delivery",
    icon: MapPin,
  },
] as const;

function formatDate(value: string | null) {
  if (!value) return "Not yet";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function ProfileRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "positive" | "muted";
}) {
  return (
    <div className="grid gap-1 border-b border-border py-3.5 last:border-b-0 sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:items-baseline sm:gap-6">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "text-sm font-medium",
          tone === "positive" && "text-primary",
          tone === "muted" && "text-muted-foreground",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function ProfileDetails({ user }: { user: AuthUser }) {
  return (
    <dl>
      <ProfileRow label="Email" value={user.email} />
      <ProfileRow
        label="Phone"
        value={user.phone || "Not added"}
        tone={user.phone ? undefined : "muted"}
      />
      <ProfileRow label="Role" value={roleLabel(user.role)} />
      <ProfileRow
        label="Account"
        value={user.status === "active" ? "Active" : "Suspended"}
        tone={user.status === "active" ? "positive" : undefined}
      />
      <ProfileRow
        label="Verification"
        value={user.emailVerified ? "Verified" : "Not verified"}
        tone={user.emailVerified ? "positive" : "muted"}
      />
      <ProfileRow label="Last sign-in" value={formatDate(user.lastLoginAt)} />
      <ProfileRow label="Member since" value={formatDate(user.createdAt)} />
    </dl>
  );
}

export function AccountProfile() {
  const router = useRouter();
  const status = useAuthStore((state) => state.status);
  const profile = useMe();
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (status === "anonymous") {
      router.replace("/login");
    }
  }, [router, status]);

  if (status === "loading" || profile.isLoading || status === "anonymous") {
    return (
      <Container className="py-10">
        <div className="h-8 w-40 animate-pulse rounded-full bg-muted" />
        <div className="mt-6 h-72 animate-pulse rounded-3xl bg-muted" />
      </Container>
    );
  }

  if (profile.isError || !profile.data) {
    return (
      <Container className="py-16 text-center">
        <h1 className="font-display text-2xl tracking-tight">
          Could not load your profile
        </h1>
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

  return (
    <Container className="py-8 sm:py-10">
      <PageBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Account" }]}
      />

      <section className="mt-5 overflow-hidden rounded-3xl border border-border bg-card">
        <div className="bg-ink px-5 py-6 text-[#fff4f2] sm:px-8 sm:py-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <UserAvatar
                user={user}
                className="size-16 text-lg ring-2 ring-white/15"
              />
              <div className="min-w-0">
                <p className="text-xs font-medium tracking-[0.16em] text-primary uppercase">
                  Account
                </p>
                <h1 className="mt-1 truncate font-display text-2xl tracking-tight sm:text-3xl">
                  {displayName(user)}
                </h1>
                <p className="mt-1 truncate text-sm text-white/70">
                  {user.email}
                </p>
              </div>
            </div>

            {editing ? null : (
              <Button
                className="h-10 shrink-0 self-start rounded-full bg-[#fff4f2] px-4 font-semibold text-ink hover:bg-primary hover:text-[#fff4f2] sm:self-center"
                onClick={() => setEditing(true)}
              >
                <Pencil className="size-4" />
                Edit profile
              </Button>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium">
              {roleLabel(user.role)}
            </span>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium">
              {user.status === "active" ? "Active" : "Suspended"}
            </span>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium">
              {user.emailVerified ? "Email verified" : "Email not verified"}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="px-5 py-6 sm:px-8 sm:py-7">
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h2 className="font-display text-lg tracking-tight">
                {editing ? "Edit details" : "Profile"}
              </h2>
              <p className="text-xs text-muted-foreground">
                Joined {formatDate(user.createdAt)}
              </p>
            </div>
            {editing ? (
              <AccountEditor
                user={user}
                onCancel={() => setEditing(false)}
                onSaved={() => setEditing(false)}
              />
            ) : (
              <ProfileDetails user={user} />
            )}
          </div>

          <aside className="border-t border-border bg-surface-muted/40 px-5 py-6 sm:px-6 lg:border-t-0 lg:border-l">
            <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
              Shortcuts
            </p>
            <ul className="mt-3 space-y-2">
              {shortcuts.map(({ href, label, hint, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-3 rounded-2xl border border-transparent bg-card px-3 py-3 transition-colors hover:border-border hover:bg-brand-soft"
                  >
                    <span className="inline-flex size-9 items-center justify-center rounded-xl bg-brand-soft text-primary">
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">{label}</span>
                      <span className="block text-xs text-muted-foreground">
                        {hint}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </Container>
  );
}
