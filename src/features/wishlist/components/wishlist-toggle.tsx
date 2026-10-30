"use client";

import { Heart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { safeNextPath, withNext } from "@/features/auth/lib/next-path";
import { useAuthStore } from "@/features/auth/store";
import { cn } from "@/lib/utils";

import type { Product } from "@/types";

import {
  useAddWishlistItem,
  useRemoveWishlistItem,
  useWishlist,
} from "../query";

type WishlistToggleProps = {
  product: Product;
  variant?: "icon" | "inline" | "labeled";
  className?: string;
};

export function WishlistToggle({
  product,
  variant = "icon",
  className,
}: WishlistToggleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const authStatus = useAuthStore((state) => state.status);
  const role = useAuthStore((state) => state.user?.role);
  const wishlist = useWishlist();
  const addItem = useAddWishlistItem();
  const removeItem = useRemoveWishlistItem();
  const saved = wishlist.data?.some((item) => item.id === product.id) ?? false;
  const busy = addItem.isPending || removeItem.isPending;
  const name = product.name;
  const label = saved ? `Remove ${name} from wishlist` : `Save ${name}`;

  function toggle() {
    if (authStatus === "loading" || busy) return;

    if (authStatus !== "authenticated") {
      const query = window.location.search;
      const current = query ? `${pathname}${query}` : pathname;
      router.push(withNext("/login", safeNextPath(current)));
      return;
    }

    if (role !== "customer") return;

    if (saved) {
      removeItem.mutate(product.id);
      return;
    }

    addItem.mutate(product);
  }

  if (variant === "labeled") {
    return (
      <Button
        variant="outline"
        className={cn(
          "h-11 rounded-full px-4",
          saved && "border-primary text-primary",
          className,
        )}
        aria-pressed={saved}
        aria-label={label}
        disabled={busy}
        onClick={toggle}
      >
        <Heart className={cn("size-4", saved && "fill-primary")} />
        {saved ? "Saved" : "Save"}
      </Button>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-full transition-colors",
        variant === "icon"
          ? "absolute top-2 right-2 bg-card/95 shadow-sm"
          : "border border-border bg-card",
        saved ? "text-primary" : "text-muted-foreground hover:text-primary",
        className,
      )}
      aria-pressed={saved}
      aria-label={label}
      disabled={busy}
      onClick={toggle}
    >
      <Heart className={cn("size-4", saved && "fill-primary")} />
    </button>
  );
}
