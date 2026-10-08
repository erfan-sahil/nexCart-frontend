"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { useCartItemCount } from "../store";

export function CartNavLink() {
  const count = useCartItemCount();

  return (
    <Link
      href="/cart"
      aria-label={count ? `Cart, ${count} items` : "Cart"}
      className="relative inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-brand-soft hover:text-primary"
    >
      <ShoppingBag className="size-5" />
      {count ? (
        <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-[#fff4f2]">
          {count > 9 ? "9+" : count}
        </span>
      ) : null}
    </Link>
  );
}
