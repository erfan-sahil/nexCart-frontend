import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type LogoProps = {
  /** auto follows the site theme; on-dark / on-light force a specific mark */
  variant?: "auto" | "on-dark" | "on-light";
  className?: string;
  priority?: boolean;
};

const MARKS = {
  light: "/brand/nexcart-black-second.png",
  dark: "/brand/nexcart-white-second.png",
} as const;

function BrandMark({
  src,
  className,
  priority,
}: {
  src: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt=""
      width={1672}
      height={941}
      className={cn("h-8 w-auto", className)}
      priority={priority}
    />
  );
}

export function Logo({
  variant = "auto",
  className,
  priority = false,
}: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2.5", className)}
      aria-label="NexCart home"
    >
      {variant === "auto" ? (
        <>
          <BrandMark
            src={MARKS.light}
            className="dark:hidden"
            priority={priority}
          />
          <BrandMark
            src={MARKS.dark}
            className="hidden dark:block"
            priority={priority}
          />
        </>
      ) : (
        <BrandMark
          src={variant === "on-dark" ? MARKS.dark : MARKS.light}
          priority={priority}
        />
      )}
    </Link>
  );
}
