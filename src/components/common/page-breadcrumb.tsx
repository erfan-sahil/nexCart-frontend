import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type PageBreadcrumbProps = {
  items: BreadcrumbItem[];
  invert?: boolean;
  className?: string;
};

export function PageBreadcrumb({
  items,
  invert = false,
  className,
}: PageBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, index) => {
          const last = index === items.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center gap-1.5"
            >
              {index > 0 ? (
                <ChevronRight
                  className={cn(
                    "size-3.5 shrink-0",
                    invert ? "text-white/40" : "text-muted-foreground",
                  )}
                />
              ) : null}
              {last || !item.href ? (
                <span
                  className={cn(
                    "font-medium",
                    invert ? "text-white" : "text-foreground",
                  )}
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "transition-colors",
                    invert
                      ? "text-white/65 hover:text-primary"
                      : "text-muted-foreground hover:text-primary",
                  )}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
