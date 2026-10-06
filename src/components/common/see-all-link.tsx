import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

type SeeAllLinkProps = {
  href: string;
  label?: string;
  className?: string;
};

export function SeeAllLink({
  href,
  label = "See all",
  className,
}: SeeAllLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex h-10 shrink-0 items-center gap-2.5 rounded-full border border-border bg-card py-1 pr-1 pl-3.5 text-sm font-semibold text-foreground transition-colors duration-300 hover:border-primary hover:bg-brand-soft",
        className,
      )}
    >
      {label}
      <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition duration-300 group-hover:translate-x-0.5 group-hover:bg-ink group-hover:text-primary dark:group-hover:bg-brand-hover dark:group-hover:text-primary-foreground">
        <ArrowRight className="size-4" />
      </span>
    </Link>
  );
}
