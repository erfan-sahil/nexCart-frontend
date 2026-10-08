import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

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
      className={cn("group flex flex-col", compact && "w-[128px] shrink-0")}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl bg-surface-muted ring-1 ring-border transition duration-300 group-hover:ring-primary",
          compact ? "aspect-[4/3]" : "aspect-square",
        )}
      >
        <Image
          src={subcategory.image}
          alt={subcategory.name}
          fill
          sizes={
            compact
              ? "128px"
              : "(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
          }
          className="object-cover transition duration-700 ease-out group-hover:scale-105"
        />
        {compact ? (
          <span className="absolute right-1.5 bottom-1.5 flex size-6 items-center justify-center rounded-full border border-primary bg-brand-soft text-primary transition-colors duration-300 group-hover:text-black dark:group-hover:text-white">
            <ArrowUpRight className="size-3" />
          </span>
        ) : null}
      </div>
      <div className="px-0.5 pt-2.5">
        {categoryName ? (
          <p className="mb-1.5 truncate text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            {categoryName}
          </p>
        ) : null}
        <p className="truncate font-display text-sm leading-none font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
          {subcategory.name}
        </p>
        <p className="mt-1.5 text-[11px] leading-none text-muted-foreground">
          {formatCount(subcategory.productCount)} items
        </p>
      </div>
    </Link>
  );
}
