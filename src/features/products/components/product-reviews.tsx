"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { displayName } from "@/features/auth/lib/profile";
import { useAuthStore } from "@/features/auth/store";
import { formatCount } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ProductDetail, ProductReview } from "@/types";

import { StarRating } from "./star-rating";

type ProductReviewsProps = {
  product: ProductDetail;
};

function formatReviewDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
    new Date(value),
  );
}

function breakdown(average: number, count: number) {
  const weights = [1, 2, 3, 4, 5].map((star) => {
    const distance = Math.abs(average - star);
    return Math.exp(-distance * distance * 1.6);
  });
  const total = weights.reduce((sum, weight) => sum + weight, 0);

  return [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    share: total === 0 ? 0 : (weights[stars - 1] ?? 0) / total,
    count:
      total === 0 ? 0 : Math.round(((weights[stars - 1] ?? 0) / total) * count),
  }));
}

export function ProductReviews({ product }: ProductReviewsProps) {
  const user = useAuthStore((state) => state.user);
  const [reviews, setReviews] = useState<ProductReview[]>(product.reviews);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [guestName, setGuestName] = useState("");
  const [error, setError] = useState("");
  const [extraCount, setExtraCount] = useState(0);

  const author = user ? displayName(user) : guestName.trim();
  const totalCount = product.reviewCount + extraCount;
  const bars = breakdown(product.rating, product.reviewCount);

  function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (rating < 1) {
      setError("Choose a star rating.");
      return;
    }

    if (!user && author.length < 2) {
      setError("Add your name so the review can be posted.");
      return;
    }

    const text = comment.trim();
    if (text.length < 8) {
      setError("Write a short comment about the product.");
      return;
    }

    const next: ProductReview = {
      id: `local-${Date.now()}`,
      author: author || "Guest",
      rating,
      createdAt: new Date().toISOString(),
      comment: text,
    };

    setReviews((current) => [next, ...current]);
    setExtraCount((count) => count + 1);
    setRating(0);
    setComment("");
    setGuestName("");
    setError("");
  }

  return (
    <section id="reviews" className="mt-12 scroll-mt-28">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Reviews
          </p>
          <h2 className="mt-1 text-2xl sm:text-3xl">Comments and ratings</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {formatCount(totalCount)} {totalCount === 1 ? "review" : "reviews"}
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="font-display text-4xl tracking-tight">
            {product.rating.toFixed(1)}
          </p>
          <StarRating value={product.rating} size="md" className="mt-2" />
          <ul className="mt-5 space-y-2">
            {bars.map((bar) => (
              <li
                key={bar.stars}
                className="grid grid-cols-[1.5rem_1fr_2rem] items-center gap-2 text-xs"
              >
                <span className="tabular-nums text-muted-foreground">
                  {bar.stars}
                </span>
                <span className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <span
                    className="block h-full rounded-full bg-primary"
                    style={{ width: `${Math.round(bar.share * 100)}%` }}
                  />
                </span>
                <span className="text-right tabular-nums text-muted-foreground">
                  {formatCount(bar.count)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={submitReview}
          className="rounded-2xl border border-border bg-card p-5"
        >
          <h3 className="font-display text-lg">Write a review</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {user
              ? `Posting as ${displayName(user)}.`
              : "Share how this product worked for you."}
          </p>
          <fieldset className="mt-4">
            <legend className="text-sm font-medium">Your rating</legend>
            <div className="mt-2 flex gap-1">
              {Array.from({ length: 5 }, (_, index) => {
                const value = index + 1;
                const selected = value <= rating;

                return (
                  <button
                    key={value}
                    type="button"
                    aria-label={`${value} star${value === 1 ? "" : "s"}`}
                    aria-pressed={rating === value}
                    onClick={() => {
                      setRating(value);
                      setError("");
                    }}
                    className={cn(
                      "inline-flex size-9 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                      selected
                        ? "border-primary bg-primary text-[#fff4f2]"
                        : "border-border bg-background text-muted-foreground hover:border-primary hover:text-primary",
                    )}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </fieldset>
          {user ? null : (
            <label className="mt-4 block text-sm font-medium">
              Name
              <input
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
                maxLength={40}
                className="mt-1.5 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                placeholder="Your name"
              />
            </label>
          )}
          <label className="mt-4 block text-sm font-medium">
            Comment
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={4}
              maxLength={600}
              className="mt-1.5 w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              placeholder="What should other shoppers know?"
            />
          </label>
          {error ? (
            <p className="mt-2 text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" className="auth-orange-button mt-4 px-6">
            Post review
          </Button>
        </form>
      </div>

      <ul className="mt-6 space-y-3">
        {reviews.map((review) => (
          <li
            key={review.id}
            className="rounded-2xl border border-border bg-card px-4 py-4 sm:px-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">{review.author}</p>
                <p className="text-xs text-muted-foreground">
                  {formatReviewDate(review.createdAt)}
                </p>
              </div>
              <StarRating value={review.rating} />
            </div>
            <p className="mt-3 text-sm leading-6 text-foreground">
              {review.comment}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
