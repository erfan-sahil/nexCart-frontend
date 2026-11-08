"use client";

import { useEffect, useState, type ReactNode } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { REVIEW_INPUT_SCROLL_CLASS } from "@/features/reviews/constants";
import { cn } from "@/lib/utils";

type ReviewInputScrollProps = {
  children: ReactNode;
  className?: string;
};

/** Same bordered scroll shell as ScrollArea; plain div on mobile avoids focus traps. */
export function ReviewInputScroll({
  children,
  className,
}: ReviewInputScrollProps) {
  const [plain, setPlain] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const update = () => setPlain(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const shell = cn(
    "rounded-lg border border-input",
    REVIEW_INPUT_SCROLL_CLASS,
    className,
  );

  if (plain) {
    return <div className={cn(shell, "overflow-y-auto")}>{children}</div>;
  }

  return <ScrollArea className={shell}>{children}</ScrollArea>;
}
