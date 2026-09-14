import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type LogoProps = {
  variant?: "dark" | "light";
  className?: string;
  priority?: boolean;
};

export function Logo({
  variant = "dark",
  className,
  priority = false,
}: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2.5", className)}
      aria-label="NexCart home"
    >
      <Image
        src="/brand/logo-mark.png"
        alt=""
        width={40}
        height={28}
        className="h-7 w-auto"
        priority={priority}
      />
      <span
        className={cn(
          "text-xl font-semibold tracking-tight",
          variant === "light" ? "text-white" : "text-ink",
        )}
      >
        NexCart
      </span>
    </Link>
  );
}
