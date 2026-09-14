import Link from "next/link";
import { Heart, ShoppingBag, UserRound } from "lucide-react";

import { ThemeToggle } from "@/components/common";

const actions = [
  { href: "/account", label: "Account", icon: UserRound },
  { href: "/wishlist", label: "Wishlist", icon: Heart, count: 2 },
  { href: "/cart", label: "Cart", icon: ShoppingBag, count: 3 },
] as const;

export function NavActions() {
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <ThemeToggle />
      {actions.map(({ href, label, icon: Icon, ...rest }) => {
        const count = "count" in rest ? rest.count : undefined;

        return (
          <Link
            key={href}
            href={href}
            className="relative flex flex-col items-center rounded-lg px-2 py-1 text-foreground transition-colors hover:text-primary"
          >
            <span className="relative">
              <Icon className="size-5" />
              {count ? (
                <span className="absolute -top-1.5 -right-2 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  {count}
                </span>
              ) : null}
            </span>
            <span className="mt-0.5 hidden text-[11px] font-medium lg:block">
              {label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
