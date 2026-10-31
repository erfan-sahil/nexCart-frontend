"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Reply } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { displayName } from "@/features/auth/lib/profile";
import { useAuthStore } from "@/features/auth/store";
import { StarRating } from "@/features/products/components/star-rating";
import {
  REVIEW_BODY_MAX,
  REVIEW_BODY_MIN,
  REVIEW_BODY_SCROLL_CLASS,
  REVIEW_INPUT_SCROLL_CLASS,
  REPLY_BUBBLE_CLASS,
  REVIEW_BUBBLE_CLASS,
  REVIEWS_PANEL_CLASS,
  REVIEWS_THREAD_SCROLL_CLASS,
} from "@/features/reviews/constants";
import {
  useCreateProductReview,
  useCreateReviewReply,
  useDeleteProductReview,
  useProductReviews,
  useUpdateProductReview,
} from "@/features/reviews/query";
import type {
  ProductReview,
  ProductReviewReply,
} from "@/features/reviews/types";
import { formatCount } from "@/lib/format";
import { cn } from "@/lib/utils";

import { SignInToReviewLink } from "./product-rating-link";
import {
  ExpandableReplyBox,
  ExpandableReplyInput,
} from "./expandable-reply-input";
import { ReviewCommentMenu } from "./review-comment-menu";

type ProductReviewSectionProps = {
  productId: string;
  initialAverage: number;
  initialCount: number;
};

function formatReviewDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
    new Date(value),
  );
}

function distributionBars(distribution: {
  star1: number;
  star2: number;
  star3: number;
  star4: number;
  star5: number;
}) {
  const total =
    distribution.star1 +
    distribution.star2 +
    distribution.star3 +
    distribution.star4 +
    distribution.star5;

  return [5, 4, 3, 2, 1].map((stars) => {
    const key = `star${stars}` as keyof typeof distribution;
    const count = distribution[key];

    return {
      stars,
      count,
      share: total === 0 ? 0 : count / total,
    };
  });
}

function RatingPicker({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="mt-2 flex gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const star = index + 1;
        const selected = star <= value;

        return (
          <button
            key={star}
            type="button"
            disabled={disabled}
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
            aria-pressed={value === star}
            onClick={() => onChange(star)}
            className={cn(
              "inline-flex size-9 cursor-pointer items-center justify-center rounded-full border text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
              selected
                ? "border-primary bg-primary text-[#fff4f2]"
                : "border-border bg-background text-muted-foreground hover:border-primary hover:text-primary",
            )}
          >
            {star}
          </button>
        );
      })}
    </div>
  );
}

function CommentBody({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <ScrollArea
      className={cn("w-full rounded-md", REVIEW_BODY_SCROLL_CLASS, className)}
    >
      <p className="pr-3 text-sm leading-6 wrap-break-word text-foreground">
        {text}
      </p>
    </ScrollArea>
  );
}

function CommentField({
  id,
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label htmlFor={id} className="mt-4 block text-sm font-medium">
      {label}
      <ScrollArea
        className={cn(
          "mt-1.5 rounded-lg border border-input",
          REVIEW_INPUT_SCROLL_CLASS,
        )}
      >
        <textarea
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={rows}
          maxLength={REVIEW_BODY_MAX}
          className="min-h-24 w-full resize-none border-0 bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-0"
          placeholder={placeholder}
        />
      </ScrollArea>
    </label>
  );
}

function validateBody(body: string) {
  const text = body.trim();

  if (text.length < REVIEW_BODY_MIN) {
    return `Write at least ${REVIEW_BODY_MIN} characters.`;
  }

  return "";
}

type ReviewComposerProps = {
  productId: string;
  onPosted: () => void;
};

function ReviewComposer({ productId, onPosted }: ReviewComposerProps) {
  const user = useAuthStore((state) => state.user);
  const createReview = useCreateProductReview(productId);
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  if (!user || user.role !== "customer") {
    return null;
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (rating < 1) {
      setError("Choose a star rating.");
      return;
    }

    const message = validateBody(body);

    if (message) {
      setError(message);
      return;
    }

    createReview.mutate(
      { productId, rating, body: body.trim() },
      {
        onSuccess: () => {
          setRating(0);
          setBody("");
          setError("");
          onPosted();
        },
        onError: (err) => {
          setError(err.message);
        },
      },
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <h3 className="font-display text-lg">Write a review</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Posting as {displayName(user)}.
        </p>
      </div>
      <fieldset className="mt-4">
        <legend className="text-sm font-medium">Your rating</legend>
        <RatingPicker
          value={rating}
          onChange={(value) => {
            setRating(value);
            setError("");
          }}
          disabled={createReview.isPending}
        />
      </fieldset>
      <CommentField
        id="review-body"
        label="Comment"
        value={body}
        onChange={setBody}
        placeholder="What should other shoppers know?"
      />
      {error ? (
        <p className="mt-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        type="submit"
        className="auth-orange-button mt-4 px-6"
        disabled={createReview.isPending}
      >
        {createReview.isPending ? "Posting…" : "Post review"}
      </Button>
    </form>
  );
}

function ReplyComposer({
  productId,
  reviewId,
  onCancel,
  onPosted,
}: {
  productId: string;
  reviewId: string;
  onCancel: () => void;
  onPosted?: () => void;
}) {
  const createReply = useCreateReviewReply(productId);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = validateBody(body);

    if (message) {
      setError(message);
      return;
    }

    createReply.mutate(
      { productId, reviewId, body: body.trim() },
      {
        onSuccess: () => {
          setBody("");
          setError("");
          onPosted?.();
        },
        onError: (err) => setError(err.message),
      },
    );
  }

  return (
    <form onSubmit={submit} className="mt-2">
      <ExpandableReplyBox
        footer={
          <>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-7 px-2"
              disabled={createReply.isPending}
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-7 px-3"
              disabled={createReply.isPending}
            >
              {createReply.isPending ? "Posting…" : "Post reply"}
            </Button>
          </>
        }
      >
        <ExpandableReplyInput
          id={`reply-${reviewId}`}
          value={body}
          onChange={setBody}
          disabled={createReply.isPending}
          placeholder="Write a reply…"
          autoFocus
        />
      </ExpandableReplyBox>
      {error ? (
        <p className="mt-1.5 text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}

function ReplyItem({
  productId,
  reply,
}: {
  productId: string;
  reply: ProductReviewReply;
}) {
  const updateReview = useUpdateProductReview(productId);
  const deleteReview = useDeleteProductReview(productId);
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(reply.body);
  const [error, setError] = useState("");

  function save(event: FormEvent) {
    event.preventDefault();
    const message = validateBody(body);

    if (message) {
      setError(message);
      return;
    }

    updateReview.mutate(
      { productId, reviewId: reply.id, body: body.trim() },
      {
        onSuccess: () => {
          setEditing(false);
          setError("");
        },
        onError: (err) => setError(err.message),
      },
    );
  }

  return (
    <li
      className={cn(
        REPLY_BUBBLE_CLASS,
        "rounded-xl border border-border/80 bg-muted/30 px-3 py-2.5",
        reply.isMine && "border-primary/15 bg-primary/5",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium">{reply.author.displayName}</p>
          <p className="text-xs text-muted-foreground">
            {formatReviewDate(reply.createdAt)}
          </p>
        </div>
        {reply.isMine && !editing ? (
          <ReviewCommentMenu
            itemLabel="reply"
            deletePending={deleteReview.isPending}
            onEdit={() => setEditing(true)}
            onDelete={() => deleteReview.mutate({ reviewId: reply.id })}
          />
        ) : null}
      </div>
      {editing ? (
        <form onSubmit={save} className="mt-2">
          <ScrollArea
            className={cn(
              "rounded-lg border border-input",
              REVIEW_INPUT_SCROLL_CLASS,
            )}
          >
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={3}
              maxLength={REVIEW_BODY_MAX}
              className="min-h-24 w-full resize-none border-0 bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-0"
            />
          </ScrollArea>
          {error ? (
            <p className="mt-1 text-sm text-destructive">{error}</p>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                setEditing(false);
                setBody(reply.body);
                setError("");
              }}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={updateReview.isPending}>
              Save
            </Button>
          </div>
        </form>
      ) : (
        <CommentBody text={reply.body} className="mt-2" />
      )}
    </li>
  );
}

function ReviewItem({
  productId,
  review,
}: {
  productId: string;
  review: ProductReview;
}) {
  const status = useAuthStore((state) => state.status);
  const updateReview = useUpdateProductReview(productId);
  const deleteReview = useDeleteProductReview(productId);
  const [editing, setEditing] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const [body, setBody] = useState(review.body);
  const [error, setError] = useState("");

  const replies = review.replies ?? [];
  const viewerReply = replies.find((reply) => reply.isMine);
  const canReply = status === "authenticated" && !viewerReply;

  function save(event: FormEvent) {
    event.preventDefault();

    if (rating < 1) {
      setError("Choose a star rating.");
      return;
    }

    const message = validateBody(body);

    if (message) {
      setError(message);
      return;
    }

    updateReview.mutate(
      { productId, reviewId: review.id, rating, body: body.trim() },
      {
        onSuccess: () => {
          setEditing(false);
          setError("");
        },
        onError: (err) => setError(err.message),
      },
    );
  }

  return (
    <li className="w-full py-2">
      <article
        className={cn(
          REVIEW_BUBBLE_CLASS,
          "rounded-2xl border border-border bg-card px-3 py-3 shadow-sm sm:px-4 sm:py-4",
          review.isMine && "border-primary/20 bg-primary/5",
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold">{review.author.displayName}</p>
            <p className="text-xs text-muted-foreground">
              {formatReviewDate(review.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StarRating value={review.rating} />
            {review.isMine && !editing ? (
              <ReviewCommentMenu
                itemLabel="review"
                deletePending={deleteReview.isPending}
                onEdit={() => setEditing(true)}
                onDelete={() => deleteReview.mutate({ reviewId: review.id })}
              />
            ) : null}
          </div>
        </div>

        {editing ? (
          <form onSubmit={save} className="mt-3">
            <fieldset>
              <legend className="text-sm font-medium">Your rating</legend>
              <RatingPicker value={rating} onChange={setRating} />
            </fieldset>
            <ScrollArea
              className={cn(
                "mt-3 rounded-lg border border-input",
                REVIEW_INPUT_SCROLL_CLASS,
              )}
            >
              <textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                rows={4}
                maxLength={REVIEW_BODY_MAX}
                className="min-h-24 w-full resize-none border-0 bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-0"
              />
            </ScrollArea>
            {error ? (
              <p className="mt-1 text-sm text-destructive">{error}</p>
            ) : null}
            <div className="mt-2 flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setEditing(false);
                  setRating(review.rating);
                  setBody(review.body);
                  setError("");
                }}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={updateReview.isPending}>
                Save changes
              </Button>
            </div>
          </form>
        ) : (
          <CommentBody text={review.body} className="mt-3" />
        )}

        {replies.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {replies.map((reply) => (
              <ReplyItem key={reply.id} productId={productId} reply={reply} />
            ))}
          </ul>
        ) : null}

        {review.replyCount > replies.length ? (
          <p className="mt-2 text-xs text-muted-foreground">
            {formatCount(review.replyCount - replies.length)} more{" "}
            {review.replyCount - replies.length === 1 ? "reply" : "replies"}
          </p>
        ) : null}

        {canReply && replyOpen ? (
          <ReplyComposer
            productId={productId}
            reviewId={review.id}
            onCancel={() => setReplyOpen(false)}
            onPosted={() => setReplyOpen(false)}
          />
        ) : null}

        {canReply && !replyOpen ? (
          <div className="mt-2 flex justify-end">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-7 gap-1.5 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setReplyOpen(true)}
            >
              <Reply className="size-3.5" aria-hidden />
              Reply
            </Button>
          </div>
        ) : null}
      </article>
    </li>
  );
}

export function ProductReviewSection({
  productId,
  initialAverage,
  initialCount,
}: ProductReviewSectionProps) {
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const { data, isLoading, isError, refetch } = useProductReviews(productId);

  const summary = data?.payload.summary ?? {
    average: initialAverage,
    count: initialCount,
    distribution: { star1: 0, star2: 0, star3: 0, star4: 0, star5: 0 },
  };

  const reviews = useMemo(() => {
    const items = data?.payload.reviews ?? [];
    const mine = data?.payload.mine;

    if (!mine) {
      return items;
    }

    if (items.some((review) => review.id === mine.id)) {
      return items;
    }

    return [mine, ...items];
  }, [data?.payload.mine, data?.payload.reviews]);

  const bars = distributionBars(summary.distribution);
  const hasMine = Boolean(data?.payload.mine);
  const showComposer =
    status === "authenticated" && user?.role === "customer" && !hasMine;

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
          {formatCount(summary.count)}{" "}
          {summary.count === 1 ? "review" : "reviews"}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="w-full shrink-0 lg:w-52">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="font-display text-4xl tracking-tight">
              {summary.average.toFixed(1)}
            </p>
            <StarRating value={summary.average} size="md" className="mt-2" />
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
        </aside>

        <div
          className={cn(
            REVIEWS_PANEL_CLASS,
            "flex min-h-[min(32rem,65vh)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
          )}
        >
          <div className="shrink-0 border-b border-border bg-muted/30 px-4 py-4 sm:px-5">
            {showComposer ? (
              <ReviewComposer
                productId={productId}
                onPosted={() => refetch()}
              />
            ) : status === "anonymous" ? (
              <div>
                <h3 className="font-display text-lg">Write a review</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Sign in with a customer account to rate this product.
                </p>
                <SignInToReviewLink />
              </div>
            ) : hasMine ? (
              <p className="text-sm text-muted-foreground">
                You already reviewed this product. Edit or delete your review in
                the thread below.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Browse what other shoppers said about this product.
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5 sm:px-5">
            <h3 className="text-sm font-semibold">Discussion</h3>
            <span className="text-xs text-muted-foreground">
              {formatCount(summary.count)}{" "}
              {summary.count === 1 ? "review" : "reviews"}
            </span>
          </div>

          {isLoading ? (
            <ScrollArea
              className={cn(REVIEWS_THREAD_SCROLL_CLASS, "px-4 sm:px-5")}
            >
              <ul className="flex flex-col gap-3 py-3">
                {Array.from({ length: 3 }, (_, index) => (
                  <li key={index} className="w-full">
                    <Skeleton className="h-24 w-full rounded-2xl" />
                  </li>
                ))}
              </ul>
            </ScrollArea>
          ) : isError ? (
            <div className="flex flex-1 items-center justify-center p-6 text-sm">
              Could not load reviews.{" "}
              <button
                type="button"
                className="cursor-pointer font-medium text-primary hover:underline"
                onClick={() => refetch()}
              >
                Try again
              </button>
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-muted-foreground">
              No reviews yet. Be the first to share your experience.
            </div>
          ) : (
            <ScrollArea className={REVIEWS_THREAD_SCROLL_CLASS}>
              <ul className="flex flex-col gap-1 px-3 py-3 sm:px-4">
                {reviews.map((review) => (
                  <ReviewItem
                    key={review.id}
                    productId={productId}
                    review={review}
                  />
                ))}
              </ul>
            </ScrollArea>
          )}
        </div>
      </div>
    </section>
  );
}
