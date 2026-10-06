import { cn } from "@/lib/utils";

import { SeeAllLink } from "./see-all-link";

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
    <div className={cn("mb-6 max-w-full sm:mb-8", className)}>
      {eyebrow ? (
        <p className="mb-1 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          {eyebrow}
        </p>
      ) : null}
      <div className="flex items-center justify-between gap-3">
        <h2
          className={cn(
            "min-w-0 text-2xl sm:text-3xl",
            invert ? "text-white" : "text-foreground",
          )}
        >
          {title}
        </h2>
        {href ? <SeeAllLink href={href} label={actionLabel} /> : null}
      </div>
      {description ? (
        <p
          className={cn(
            "mt-1.5 max-w-2xl text-sm sm:text-base",
            invert ? "text-white/70" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
