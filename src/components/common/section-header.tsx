import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  actionLabel?: string;
  className?: string;
  invert?: boolean;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  href,
  actionLabel = "See all",
  className,
  invert = false,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow ? (
          <p
            className={cn(
              "mb-1 text-xs font-semibold tracking-[0.18em] uppercase",
              invert ? "text-primary" : "text-primary",
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={cn(
            "text-2xl sm:text-3xl",
            invert ? "text-white" : "text-foreground",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "mt-1.5 text-sm sm:text-base",
              invert ? "text-white/70" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {href ? (
        <Link
          href={href}
          className={cn(
            "inline-flex h-9 items-center gap-1 rounded-full px-4 text-sm font-medium transition-colors duration-500",
            invert
              ? "border border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
              : "bg-primary text-primary-foreground hover:bg-ink hover:text-primary",
          )}
        >
          {actionLabel}
          <ArrowRight className="size-4" />
        </Link>
      ) : null}
    </div>
  );
}
