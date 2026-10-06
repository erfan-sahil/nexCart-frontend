"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/providers/theme-provider";

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
      className="relative flex cursor-pointer flex-col items-center rounded-lg px-2 py-1 text-foreground transition-colors hover:text-primary"
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
