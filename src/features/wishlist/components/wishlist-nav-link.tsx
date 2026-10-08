"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { useWishlistCount } from "../store";

export function WishlistNavLink() {
  const count = useWishlistCount();

  return (
    <Link
      href="/wishlist"
      aria-label={count ? `Wishlist, ${count} items` : "Wishlist"}
      className="relative inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-brand-soft hover:text-primary"
    >
      <Heart className="size-5" />
      {count ? (
        <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-[#fff4f2]">
          {count > 9 ? "9+" : count}
        </span>
      ) : null}
    </Link>
  );
}
