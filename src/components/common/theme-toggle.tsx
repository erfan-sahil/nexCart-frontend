"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  showLabel?: boolean;
};

export function ThemeToggle({ showLabel = true }: ThemeToggleProps) {
  const { setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => {
        const isDark = document.documentElement.classList.contains("dark");
        setTheme(isDark ? "light" : "dark");
      }}
      aria-label="Toggle color theme"
      title="Toggle color theme"
      className={cn(
        "relative cursor-pointer text-foreground transition-colors hover:text-primary",
        showLabel
          ? "flex flex-col items-center rounded-lg px-2 py-1"
          : "inline-flex size-10 items-center justify-center rounded-full hover:bg-brand-soft",
      )}
    >
      <Sun className="size-5 dark:hidden" />
      <Moon className="hidden size-5 dark:block" />
      {showLabel ? (
        <span className="mt-0.5 hidden text-[11px] font-medium lg:block">
          Theme
        </span>
      ) : null}
    </button>
  );
}
