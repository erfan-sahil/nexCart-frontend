import Link from "next/link";

import { Container } from "@/components/common";
import { AccountGreeting } from "@/features/auth/components/account-menu";

export function TopBar() {
  return (
    <div className="bg-primary text-primary-foreground">
      <Container className="flex h-9 items-center justify-between text-[11px] tracking-wide sm:text-xs">
        <p className="truncate">
          Free shipping on orders over{" "}
          <span className="font-semibold">$50</span>
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/track-order"
            className="hidden hover:underline sm:inline"
          >
            Track order
          </Link>
          <Link href="/help" className="hidden hover:underline sm:inline">
            Help
          </Link>
          <AccountGreeting />
          <Link
            href="/sell"
            className="rounded-full bg-ink px-2.5 py-0.5 font-medium text-primary"
          >
            Sell on NexCart
          </Link>
        </div>
      </Container>
    </div>
  );
}
