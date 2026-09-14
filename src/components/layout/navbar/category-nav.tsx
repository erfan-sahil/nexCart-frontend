"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid } from "lucide-react";

import { Container } from "@/components/common";
import { CATEGORY_LINKS } from "@/constants/navigation";
import { cn } from "@/lib/utils";

export function CategoryNav() {
  const pathname = usePathname();
  const allActive = pathname === "/categories";

  return (
    <nav
      aria-label="Product categories"
      className="hidden border-t border-border bg-background lg:block"
    >
      <Container className="flex h-11 items-center gap-6">
        <Link
          href="/categories"
          className={cn(
            "inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-primary",
            allActive ? "text-primary" : "text-foreground",
          )}
        >
          <LayoutGrid className="size-4 text-primary" />
          All categories
        </Link>
        {CATEGORY_LINKS.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm transition-colors hover:text-primary",
                active ? "font-medium text-primary" : "text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </Container>
    </nav>
  );
}
