import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  actionLabel?: string;
  actionVariant?: "solid" | "spotlight";
  className?: string;
  invert?: boolean;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  href,
  actionLabel = "See all",
  actionVariant = "solid",
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
        actionVariant === "spotlight" ? (
          <Link
            href={href}
            className="group inline-flex h-10 items-center gap-2.5 rounded-full border border-border bg-card py-1 pr-1 pl-3.5 text-sm font-semibold text-foreground transition-colors duration-300 hover:border-primary hover:bg-brand-soft"
          >
            {actionLabel}
            <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition duration-300 group-hover:translate-x-0.5 group-hover:bg-ink group-hover:text-primary">
              <ArrowRight className="size-4" />
            </span>
          </Link>
        ) : (
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
        )
      ) : null}
    </div>
  );
}
