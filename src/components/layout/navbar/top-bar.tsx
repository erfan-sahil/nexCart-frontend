import Link from "next/link";

import { Container } from "@/components/common";

export function TopBar() {
  return (
    <div className="bg-surface-dark text-white">
      <Container className="flex h-9 items-center justify-between text-[11px] tracking-wide sm:text-xs">
        <p className="truncate text-white/75">
          Free shipping on orders over{" "}
          <span className="font-medium text-primary">$50</span>
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/track-order"
            className="hidden hover:text-primary sm:inline"
          >
            Track order
          </Link>
          <Link href="/help" className="hidden hover:text-primary sm:inline">
            Help
          </Link>
          <Link
            href="/sell"
            className="font-medium text-primary hover:text-brand-muted"
          >
            Sell on NexCart
          </Link>
        </div>
      </Container>
    </div>
  );
}
