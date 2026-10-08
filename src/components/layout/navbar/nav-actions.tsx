import { ThemeToggle } from "@/components/common";
import { AccountMenu } from "@/features/auth/components/account-menu";
import { CartNavLink } from "@/features/cart";
import { WishlistNavLink } from "@/features/wishlist";

export function NavActions() {
  return (
    <div className="flex items-center gap-0.5 sm:gap-1 lg:gap-1.5">
      <div className="hidden sm:block">
        <ThemeToggle showLabel={false} />
      </div>
      <WishlistNavLink />
      <CartNavLink />
      <span className="mx-1 hidden h-6 w-px bg-border lg:block" aria-hidden />
      <AccountMenu />
    </div>
  );
}
