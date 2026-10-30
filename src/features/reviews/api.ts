import { api } from "@/lib/api/client";
import { toApiError } from "@/lib/api/errors";
import type { ApiSuccess } from "@/lib/api/types";

import type {
  ProductReview,
  ProductReviewReply,
  ProductReviewsPayload,
  ReviewRepliesPayload,
  ReviewSummary,
} from "./types";

export async function fetchProductReviews(
  productId: string,
  page = 1,
  limit = 10,
) {
  try {
    const { data } = await api.get<ApiSuccess<ProductReviewsPayload>>(
      `/products/${productId}/reviews`,
      { params: { page, limit } },
    );

    return {
      payload: data.data,
      pagination: data.meta?.pagination,
    };
  } catch (error) {
    throw toApiError(error);
  }
}

export async function fetchReviewReplies(
  productId: string,
  reviewId: string,
  page = 1,
  limit = 20,
) {
  try {
    const { data } = await api.get<ApiSuccess<ReviewRepliesPayload>>(
      `/products/${productId}/reviews/${reviewId}/replies`,
      { params: { page, limit } },
    );

    return {
      payload: data.data,
      pagination: data.meta?.pagination,
    };
  } catch (error) {
    throw toApiError(error);
  }
}

export async function createProductReview(input: {
  productId: string;
  rating: number;
  body: string;
}) {
  try {
    const { data } = await api.post<
      ApiSuccess<{ review: ProductReview; summary: ReviewSummary }>
    >(`/products/${input.productId}/reviews`, {
      rating: input.rating,
      body: input.body,
    });

    return data.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function updateProductReview(input: {
  productId: string;
  reviewId: string;
  rating?: number;
  body?: string;
}) {
  try {
    const { data } = await api.patch<
      ApiSuccess<{
        review?: ProductReview;
        reply?: ProductReviewReply;
        summary: ReviewSummary | null;
      }>
    >(`/products/${input.productId}/reviews/${input.reviewId}`, {
      rating: input.rating,
      body: input.body,
    });

    return data.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function deleteProductReview(productId: string, reviewId: string) {
  try {
    const { data } = await api.delete<
      ApiSuccess<{ summary: ReviewSummary | null }>
    >(`/products/${productId}/reviews/${reviewId}`);

    return data.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function createReviewReply(input: {
  productId: string;
  reviewId: string;
  body: string;
}) {
  try {
    const { data } = await api.post<ApiSuccess<{ reply: ProductReviewReply }>>(
      `/products/${input.productId}/reviews/${input.reviewId}/replies`,
      { body: input.body },
    );

    return data.data;
  } catch (error) {
    throw toApiError(error);
  }
}
