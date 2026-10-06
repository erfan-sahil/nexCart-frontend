"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogIn, LogOut, Package, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";

import { logout } from "../api";
import { displayName, roleLabel } from "../lib/profile";
import { meQueryKey, sessionQueryKey } from "../query";
import { useAuthStore } from "../store";
import type { AuthUser } from "../types";
import { useMe } from "../use-me";
import { UserAvatar } from "./user-avatar";

const accountButtonClass =
  "inline-flex size-10 items-center justify-center gap-2 rounded-full text-foreground transition-colors duration-300 hover:bg-brand-soft hover:text-primary lg:h-10 lg:w-auto lg:bg-ink lg:px-4 lg:font-semibold lg:text-[#fff4f2] lg:hover:bg-[color-mix(in_srgb,var(--brand)_55%,var(--ink))] lg:hover:text-[#fff4f2]";

function AccountPlaceholder() {
  return (
    <div aria-hidden>
      <span className="block size-10 animate-pulse rounded-full bg-muted lg:hidden" />
      <span className="hidden h-10 w-[7.25rem] animate-pulse rounded-full bg-muted lg:block" />
    </div>
  );
}

function GuestAccountLink({
  className,
  onNavigate,
  href = "/login",
  label = "Sign in",
}: {
  className?: string;
  onNavigate?: () => void;
  href?: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-label={label}
      className={className ?? accountButtonClass}
    >
      <UserRound className="size-5 lg:size-4" />
      <span className="hidden text-sm lg:inline">{label}</span>
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
      <GuestAccountLink
        href="/account"
        label="Account"
        className={accountButtonClass}
      />
    );
  }

  if (!profile.data) {
    return (
      <Link
        href="/login"
        className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-3.5 text-sm font-semibold text-[#fff4f2] transition-colors hover:bg-ink hover:text-[#fff4f2] sm:h-10 sm:px-4"
      >
        Sign in
      </Link>
    );
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
        className="inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-brand-soft hover:text-primary lg:h-10 lg:w-auto lg:gap-2 lg:border lg:border-border lg:bg-card lg:pr-3 lg:pl-1 lg:hover:border-primary/40"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
      >
        <UserAvatar user={user} className="size-8 text-[10px] lg:size-8" />
        <span className="hidden max-w-28 truncate text-sm font-medium lg:inline">
          {user.firstName}
        </span>
        <ChevronDown
          className={cn(
            "hidden size-4 text-muted-foreground transition-transform lg:block",
            open && "rotate-180",
          )}
        />
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

const sessionButtonClass =
  "flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50";

export function DrawerSessionButton({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const status = useAuthStore((state) => state.status);
  const profile = useMe();
  const router = useRouter();
  const queryClient = useQueryClient();

  const signOut = useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.removeQueries({ queryKey: meQueryKey });
      queryClient.setQueryData(sessionQueryKey, null);
      onNavigate?.();
      router.push("/");
      router.refresh();
    },
  });

  if (
    status === "loading" ||
    (status === "authenticated" && profile.isLoading)
  ) {
    return (
      <span
        aria-hidden
        className="block h-11 w-full animate-pulse rounded-xl bg-muted"
      />
    );
  }

  if (!profile.data) {
    return (
      <Link
        href="/login"
        onClick={onNavigate}
        className={cn(
          sessionButtonClass,
          "bg-primary text-[#fff4f2] hover:bg-primary/80 hover:text-[#fff4f2]",
        )}
      >
        <LogIn className="size-4" />
        Sign in
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        sessionButtonClass,
        "border border-border text-destructive hover:bg-destructive/10",
      )}
      disabled={signOut.isPending}
      onClick={() => signOut.mutate()}
    >
      <LogOut className="size-4" />
      {signOut.isPending ? "Signing out..." : "Log out"}
    </button>
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
