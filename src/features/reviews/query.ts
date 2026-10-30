"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createProductReview,
  createReviewReply,
  deleteProductReview,
  fetchProductReviews,
  updateProductReview,
} from "./api";
import { REVIEWS_QUERY_ROOT } from "./constants";
import type { ProductReviewsPayload, ReviewSummary } from "./types";

export function productReviewsQueryKey(productId: string, page = 1) {
  return [REVIEWS_QUERY_ROOT, productId, page] as const;
}

export function useProductReviews(productId: string, page = 1) {
  return useQuery({
    queryKey: productReviewsQueryKey(productId, page),
    queryFn: async () => fetchProductReviews(productId, page),
  });
}

function patchReviewsCache(
  queryClient: ReturnType<typeof useQueryClient>,
  productId: string,
  page: number,
  updater: (
    current: Awaited<ReturnType<typeof fetchProductReviews>>,
  ) => Awaited<ReturnType<typeof fetchProductReviews>>,
) {
  const key = productReviewsQueryKey(productId, page);
  queryClient.setQueryData(
    key,
    (current: Awaited<ReturnType<typeof fetchProductReviews>> | undefined) => {
      if (!current) return current;
      return updater(current);
    },
  );
}

export function useCreateProductReview(productId: string, page = 1) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProductReview,
    onSuccess: (result) => {
      patchReviewsCache(queryClient, productId, page, (current) => ({
        ...current,
        payload: {
          ...current.payload,
          summary: result.summary,
          mine: result.review,
          reviews: [
            result.review,
            ...current.payload.reviews.filter(
              (review) => review.id !== result.review.id,
            ),
          ],
        },
      }));
      void queryClient.invalidateQueries({
        queryKey: [REVIEWS_QUERY_ROOT, productId],
      });
    },
  });
}

export function useUpdateProductReview(productId: string, page = 1) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProductReview,
    onSuccess: (result) => {
      patchReviewsCache(queryClient, productId, page, (current) => {
        const nextSummary = result.summary ?? current.payload.summary;

        const mapReview = (
          review: ProductReviewsPayload["reviews"][number],
        ) => {
          if (result.review && review.id === result.review.id) {
            return result.review;
          }

          if (result.reply) {
            return {
              ...review,
              replies: review.replies.map((reply) =>
                reply.id === result.reply!.id ? result.reply! : reply,
              ),
            };
          }

          return review;
        };

        return {
          ...current,
          payload: {
            ...current.payload,
            summary: nextSummary,
            mine: current.payload.mine ? mapReview(current.payload.mine) : null,
            reviews: current.payload.reviews.map(mapReview),
          },
        };
      });
      void queryClient.invalidateQueries({
        queryKey: [REVIEWS_QUERY_ROOT, productId],
      });
    },
  });
}

export function useDeleteProductReview(productId: string, page = 1) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId }: { reviewId: string }) =>
      deleteProductReview(productId, reviewId),
    onSuccess: (result, variables) => {
      patchReviewsCache(queryClient, productId, page, (current) => {
        const nextSummary = result.summary ?? current.payload.summary;

        return {
          ...current,
          payload: {
            ...current.payload,
            summary: nextSummary,
            mine:
              current.payload.mine?.id === variables.reviewId
                ? null
                : current.payload.mine,
            reviews: current.payload.reviews
              .filter((review) => review.id !== variables.reviewId)
              .map((review) => ({
                ...review,
                replies: review.replies.filter(
                  (reply) => reply.id !== variables.reviewId,
                ),
                replyCount:
                  review.replies.some(
                    (reply) => reply.id === variables.reviewId,
                  ) && review.replyCount > 0
                    ? review.replyCount - 1
                    : review.replyCount,
              })),
          },
        };
      });
      void queryClient.invalidateQueries({
        queryKey: [REVIEWS_QUERY_ROOT, productId],
      });
    },
  });
}

export function useCreateReviewReply(productId: string, page = 1) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReviewReply,
    onSuccess: (result, variables) => {
      patchReviewsCache(queryClient, productId, page, (current) => ({
        ...current,
        payload: {
          ...current.payload,
          reviews: current.payload.reviews.map((review) => {
            if (review.id !== variables.reviewId) {
              return review;
            }

            const exists = review.replies.some(
              (reply) => reply.id === result.reply.id,
            );

            return {
              ...review,
              replyCount: exists ? review.replyCount : review.replyCount + 1,
              replies: exists
                ? review.replies.map((reply) =>
                    reply.id === result.reply.id ? result.reply : reply,
                  )
                : [...review.replies, result.reply],
            };
          }),
        },
      }));
      void queryClient.invalidateQueries({
        queryKey: [REVIEWS_QUERY_ROOT, productId],
      });
    },
  });
}

export type { ReviewSummary };
