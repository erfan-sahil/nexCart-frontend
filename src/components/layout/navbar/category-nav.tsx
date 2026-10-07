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
    <Container className="no-scrollbar flex h-12 items-center gap-1 overflow-x-auto">
      <Link
        href="/categories"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold transition-colors",
          allActive
            ? "bg-primary text-[#fff4f2]"
            : "text-foreground hover:bg-card hover:text-primary",
        )}
      >
        <LayoutGrid
          className={cn(
            "size-4",
            allActive ? "text-[#fff4f2]" : "text-primary",
          )}
        />
        All categories
      </Link>
      {CATEGORY_LINKS.map((item) => {
        const active = isCategoryActive(pathname, selectedSlug, item.slug);

        return (
          <Link
            key={item.slug}
            href={item.href}
            className={cn(
              "rounded-full px-3 py-1 text-sm transition-colors",
              active
                ? "bg-primary font-medium text-[#fff4f2]"
                : "text-muted-foreground hover:bg-card hover:text-primary",
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
      className="hidden border-t border-border bg-brand-soft/70 lg:block"
    >
      <Suspense
        fallback={
          <Container className="flex h-12 items-center gap-1">
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
