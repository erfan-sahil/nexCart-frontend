"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { Logo, ThemeToggle } from "@/components/common";

export function AuthFormColumn({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const inverted = pathname.startsWith("/register");

  return (
    <div
      data-tone={inverted ? "invert" : "default"}
      className="auth-form-panel flex min-h-svh flex-col bg-background"
    >
      <header className="flex items-center justify-between px-4 py-4 sm:px-8">
        <Logo priority />
        <ThemeToggle showLabel={false} />
      </header>
      <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
