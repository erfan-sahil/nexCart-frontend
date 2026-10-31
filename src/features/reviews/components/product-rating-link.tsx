"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Star } from "lucide-react";

import { formatCount } from "@/lib/format";
import { withNext } from "@/features/auth/lib/next-path";
import { useProductReviews } from "@/features/reviews/query";

type ProductRatingLinkProps = {
  productId: string;
  average: number;
  count: number;
  sold?: number;
  badge?: string;
};

function ratingLabel(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function ProductRatingLink({
  productId,
  average,
  count,
  sold,
  badge,
}: ProductRatingLinkProps) {
  const { data } = useProductReviews(productId);
  const summary = data?.payload.summary;
  const displayAverage = summary?.average ?? average;
  const displayCount = summary?.count ?? count;

  return (
    <a
      href="#reviews"
      className="mt-3 inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground"
    >
      <span className="inline-flex items-center gap-1.5">
        <Star className="size-4 fill-primary text-primary" />
        <span className="font-semibold text-foreground">
          {ratingLabel(displayAverage)}
        </span>
        <span>({formatCount(displayCount)})</span>
      </span>
      {sold ? <span>{formatCount(sold)} sold</span> : null}
      {badge ? (
        <span className="rounded-full bg-card px-2 py-0.5 text-[11px] font-medium text-foreground ring-1 ring-border">
          {badge}
        </span>
      ) : null}
    </a>
  );
}

export function SignInToReviewLink() {
  const pathname = usePathname();
  const href = withNext("/login", `${pathname}#reviews`);

  return (
    <Link
      href={href}
      className="text-sm font-medium text-primary hover:underline"
    >
      Sign in to write a review
    </Link>
  );
}
