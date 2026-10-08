import Link from "next/link";

import { Container } from "@/components/common";
import { AccountGreeting } from "@/features/auth/components/account-menu";

export function TopBar() {
  return (
    <div className="bg-primary text-[#fff4f2]">
      <Container className="flex h-8 items-center justify-between gap-3 text-[11px] tracking-wide sm:h-9 sm:text-xs">
        <p className="min-w-0 truncate">
          Free shipping on orders over{" "}
          <span className="font-semibold">$50</span>
        </p>
        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
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
            className="rounded-full bg-ink px-2.5 py-0.5 font-medium text-[#fff4f2]"
          >
            Sell on NexCart
          </Link>
        </div>
      </Container>
    </div>
  );
}
