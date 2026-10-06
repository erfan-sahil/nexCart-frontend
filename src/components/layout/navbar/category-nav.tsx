"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LayoutGrid } from "lucide-react";

import { Container } from "@/components/common";
import { CATEGORY_LINKS } from "@/constants/navigation";
import { cn } from "@/lib/utils";

function isCategoryActive(
  pathname: string,
  selectedSlug: string | null,
  slug: string,
) {
  if (pathname === `/categories/${slug}`) return true;
  return pathname === "/products" && selectedSlug === slug;
}

function CategoryNavLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedSlug = searchParams.get("category");
  const allActive = pathname === "/categories";

  return (
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
        const active = isCategoryActive(pathname, selectedSlug, item.slug);

        return (
          <Link
            key={item.slug}
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
  );
}

export function CategoryNav() {
  return (
    <nav
      aria-label="Product categories"
      className="hidden border-t border-border bg-background lg:block"
    >
      <Suspense
        fallback={
          <Container className="flex h-11 items-center gap-6">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
              <LayoutGrid className="size-4 text-primary" />
              All categories
            </span>
          </Container>
        }
      >
        <CategoryNavLinks />
      </Suspense>
    </nav>
  );
}
