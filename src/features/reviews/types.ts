export type ReviewAuthor = {
  id: string;
  displayName: string;
  avatarUrl: string;
};

export type ProductReviewReply = {
  id: string;
  author: ReviewAuthor;
  body: string;
  createdAt: string;
  updatedAt: string;
  isMine: boolean;
};

export type ProductReview = {
  id: string;
  author: ReviewAuthor;
  rating: number;
  body: string;
  createdAt: string;
  updatedAt: string;
  replyCount: number;
  replies: ProductReviewReply[];
  isMine: boolean;
};

export type RatingDistribution = {
  star1: number;
  star2: number;
  star3: number;
  star4: number;
  star5: number;
};

export type ReviewSummary = {
  average: number;
  count: number;
  distribution: RatingDistribution;
};

export type ProductReviewsPayload = {
  summary: ReviewSummary;
  reviews: ProductReview[];
  mine: ProductReview | null;
};

export type ReviewRepliesPayload = {
  replies: ProductReviewReply[];
};
