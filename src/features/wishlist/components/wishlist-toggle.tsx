"use client";

import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useWishlistStore } from "../store";

type WishlistToggleProps = {
  productId: string;
  name: string;
  variant?: "icon" | "inline" | "labeled";
  className?: string;
};

export function WishlistToggle({
  productId,
  name,
  variant = "icon",
  className,
}: WishlistToggleProps) {
  const saved = useWishlistStore((state) => state.ids.includes(productId));
  const toggle = useWishlistStore((state) => state.toggle);
  const label = saved ? `Remove ${name} from wishlist` : `Save ${name}`;

  if (variant === "labeled") {
    return (
      <Button
        variant="outline"
        className={cn(
          "h-11 rounded-full px-4",
          saved && "border-primary text-primary",
          className,
        )}
        aria-pressed={saved}
        aria-label={label}
        onClick={() => toggle(productId)}
      >
        <Heart className={cn("size-4", saved && "fill-primary")} />
        {saved ? "Saved" : "Save"}
      </Button>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-full transition-colors",
        variant === "icon"
          ? "absolute top-2 right-2 bg-card/95 shadow-sm"
          : "border border-border bg-card",
        saved ? "text-primary" : "text-muted-foreground hover:text-primary",
        className,
      )}
      aria-pressed={saved}
      aria-label={label}
      onClick={() => toggle(productId)}
    >
      <Heart className={cn("size-4", saved && "fill-primary")} />
    </button>
  );
}
