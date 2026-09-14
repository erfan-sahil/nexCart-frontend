import Link from "next/link";
import { LayoutGrid } from "lucide-react";

import { Container } from "@/components/shared/container";
import { CATEGORY_LINKS } from "@/constants/navigation";

export function CategoryNav() {
  return (
    <nav
      aria-label="Product categories"
      className="hidden border-t border-border bg-white lg:block"
    >
      <Container className="flex h-11 items-center gap-6">
        <Link
          href="/categories"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-primary"
        >
          <LayoutGrid className="size-4 text-primary" />
          All categories
        </Link>
        {CATEGORY_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            {item.label}
          </Link>
        ))}
      </Container>
    </nav>
  );
}
