import { Star } from "@/lib/icons";

import { cn } from "@/lib/utils";

type StarRatingProps = {
  value: number;
  className?: string;
  size?: "sm" | "md";
};

/*
 * Icons from @stashicon/icons set an inline `color`, which overrides Tailwind
 * text-* classes, so the color must be passed through the `color` prop.
 */
const FILLED_COLOR = "var(--brand-hover)";
const EMPTY_COLOR = "var(--border)";

export function StarRating({ value, className, size = "sm" }: StarRatingProps) {
  const icon = size === "sm" ? "size-3.5" : "size-4";
  const filled = Math.round(value);

  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          weight={index < filled ? "bold" : "linear"}
          color={index < filled ? FILLED_COLOR : EMPTY_COLOR}
          className={icon}
        />
      ))}
    </span>
  );
}
