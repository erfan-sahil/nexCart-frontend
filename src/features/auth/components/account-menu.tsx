"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Package, UserRound } from "lucide-react";

import { logout } from "../api";
import { displayName, roleLabel } from "../lib/profile";
import { meQueryKey, sessionQueryKey } from "../query";
import { useAuthStore } from "../store";
import type { AuthUser } from "../types";
import { useMe } from "../use-me";
import { UserAvatar } from "./user-avatar";

function AccountPlaceholder() {
  return (
    <div className="flex flex-col items-center px-2 py-1" aria-hidden>
      <span className="size-5 animate-pulse rounded-full bg-muted" />
      <span className="mt-1 hidden h-3 w-10 animate-pulse rounded bg-muted lg:block" />
    </div>
  );
}

function GuestAccountLink({
  className,
  onNavigate,
  label = "Account",
}: {
  className?: string;
  onNavigate?: () => void;
  label?: string;
}) {
  return (
    <Link
      href="/login"
      onClick={onNavigate}
      className={
        className ??
        "relative flex flex-col items-center rounded-lg px-2 py-1 text-foreground transition-colors hover:text-primary"
      }
    >
      <UserRound className="size-5" />
      <span className="mt-0.5 hidden text-[11px] font-medium lg:block">
        {label}
      </span>
    </Link>
  );
}

export function AccountMenu() {
  const status = useAuthStore((state) => state.status);
  const profile = useMe();

  if (
    status === "loading" ||
    (status === "authenticated" && profile.isLoading)
  ) {
    return <AccountPlaceholder />;
  }

  if (status === "authenticated" && profile.isError) {
    return (
      <Link
        href="/account"
        className="relative flex flex-col items-center rounded-lg px-2 py-1 text-foreground transition-colors hover:text-primary"
      >
        <UserRound className="size-5" />
        <span className="mt-0.5 hidden text-[11px] font-medium lg:block">
          Account
        </span>
      </Link>
    );
  }

  if (!profile.data) {
    return <GuestAccountLink />;
  }

  return <SignedInMenu user={profile.data.user} />;
}

function SignedInMenu({ user }: { user: AuthUser }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const name = displayName(user);

  const signOut = useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.removeQueries({ queryKey: meQueryKey });
      queryClient.setQueryData(sessionQueryKey, null);
      setOpen(false);
      router.push("/");
      router.refresh();
    },
  });

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="flex items-center gap-2 rounded-lg px-2 py-1 text-foreground transition-colors hover:text-primary"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
      >
        <UserAvatar user={user} className="size-7 text-[10px]" />
        <span className="hidden max-w-24 truncate text-[11px] font-medium lg:block">
          {user.firstName}
        </span>
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute top-[calc(100%+0.5rem)] right-0 z-50 w-64 rounded-xl border border-border bg-background p-2 shadow-lg"
        >
          <div className="px-2 py-2">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
            <p className="mt-1 text-[11px] font-medium tracking-wide text-primary uppercase">
              {roleLabel(user.role)}
            </p>
          </div>
          <div className="my-1 h-px bg-border" />
          <Link
            href="/account"
            role="menuitem"
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-muted"
            onClick={() => setOpen(false)}
          >
            <UserRound className="size-4" />
            My account
          </Link>
          <Link
            href="/orders"
            role="menuitem"
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-muted"
            onClick={() => setOpen(false)}
          >
            <Package className="size-4" />
            Orders
          </Link>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-destructive hover:bg-destructive/10 disabled:opacity-50"
            disabled={signOut.isPending}
            onClick={() => signOut.mutate()}
          >
            <LogOut className="size-4" />
            {signOut.isPending ? "Signing out..." : "Sign out"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function AccountNavLink({ onNavigate }: { onNavigate?: () => void }) {
  const status = useAuthStore((state) => state.status);
  const profile = useMe();

  if (
    status === "loading" ||
    (status === "authenticated" && profile.isLoading)
  ) {
    return <span className="text-muted-foreground">Account</span>;
  }

  if (!profile.data) {
    return (
      <Link href="/login" onClick={onNavigate}>
        Account
      </Link>
    );
  }

  return (
    <Link href="/account" onClick={onNavigate}>
      {profile.data.user.firstName}
    </Link>
  );
}

export function AccountGreeting() {
  const profile = useMe();
  const user = profile.data?.user;

  if (!user) return null;

  return (
    <Link
      href="/account"
      className="hidden font-medium underline-offset-4 hover:underline sm:inline"
    >
      Hi, {user.firstName}
    </Link>
  );
}
