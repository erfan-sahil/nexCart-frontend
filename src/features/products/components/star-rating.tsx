import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

type StarRatingProps = {
  value: number;
  className?: string;
  size?: "sm" | "md";
};

export function StarRating({ value, className, size = "sm" }: StarRatingProps) {
  const icon = size === "sm" ? "size-3.5" : "size-4";
  const filled = Math.round(value);

  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={cn(
            icon,
            index < filled
              ? "fill-primary text-primary"
              : "fill-transparent text-border",
          )}
        />
      ))}
    </span>
  );
}
