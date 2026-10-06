import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";

import { ThemeToggle } from "@/components/common";
import { AccountMenu } from "@/features/auth/components/account-menu";

const actions = [
  { href: "/wishlist", label: "Wishlist", icon: Heart, count: 2 },
  { href: "/cart", label: "Cart", icon: ShoppingBag, count: 3 },
] as const;

export function NavActions() {
  return (
    <div className="flex items-center gap-0.5 sm:gap-1 lg:gap-1.5">
      <div className="hidden sm:block">
        <ThemeToggle showLabel={false} />
      </div>
      {actions.map(({ href, label, icon: Icon, count }) => (
        <Link
          key={href}
          href={href}
          aria-label={count ? `${label}, ${count} items` : label}
          className="relative inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-brand-soft hover:text-primary"
        >
          <Icon className="size-5" />
          {count ? (
            <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-ink text-[10px] font-semibold text-primary">
              {count}
            </span>
          ) : null}
        </Link>
      ))}
      <span className="mx-1 hidden h-6 w-px bg-border lg:block" aria-hidden />
      <AccountMenu />
    </div>
  );
}
