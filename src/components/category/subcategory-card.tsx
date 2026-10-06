import Image from "next/image";
import Link from "next/link";

import { formatCount } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Subcategory } from "@/types";

type SubcategoryCardProps = {
  subcategory: Subcategory;
  href: string;
  categoryName?: string;
  variant?: "default" | "compact";
};

export function SubcategoryCard({
  subcategory,
  href,
  categoryName,
  variant = "default",
}: SubcategoryCardProps) {
  const compact = variant === "compact";

  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col rounded-2xl border border-border bg-card p-2 transition-shadow hover:shadow-[0_8px_30px_rgba(10,10,10,0.06)] dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.45)]",
        compact && "min-w-[148px] shrink-0 sm:min-w-[168px]",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-xl bg-surface-muted",
          compact ? "aspect-[4/3]" : "aspect-square",
        )}
      >
        <Image
          src={subcategory.image}
          alt={subcategory.name}
          fill
          sizes={
            compact
              ? "168px"
              : "(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
          }
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="px-1 pt-2.5 pb-1">
        {categoryName ? (
          <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            {categoryName}
          </p>
        ) : null}
        <p className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
          {subcategory.name}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatCount(subcategory.productCount)} items
        </p>
      </div>
    </Link>
  );
}
