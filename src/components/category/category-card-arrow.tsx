import { ArrowRightUp } from "@/lib/icons";

import { cn } from "@/lib/utils";

type CategoryCardArrowProps = {
  size?: "sm" | "md";
  className?: string;
};

/**
 * Round arrow badge shown in the corner of category cards.
 * Must be rendered inside a `relative` + `group` parent.
 */
export function CategoryCardArrow({
  size = "md",
  className,
}: CategoryCardArrowProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute flex items-center justify-center rounded-full border border-primary bg-brand-soft text-primary transition-colors duration-300 group-hover:text-black dark:group-hover:text-white",
        size === "md"
          ? "right-2 bottom-2 size-7"
          : "right-1.5 bottom-1.5 size-6",
        className,
      )}
    >
      <ArrowRightUp weight="broken" className="size-3.5" />
    </span>
  );
}
