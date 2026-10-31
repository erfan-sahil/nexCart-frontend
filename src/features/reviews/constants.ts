export const REVIEW_BODY_MIN = 8;
export const REVIEW_BODY_MAX = 600;

export const REVIEWS_QUERY_ROOT = "product-reviews" as const;

/** Full-width comment panel (fills row beside summary). */
export const REVIEWS_PANEL_CLASS = "w-full min-w-0 flex-1";

/** Full width of the discussion thread. */
export const REVIEW_BUBBLE_CLASS = "w-full";

/** Nested replies span the review card width. */
export const REPLY_BUBBLE_CLASS = "w-full";

/** Fixed scroll region for the review thread. */
export const REVIEWS_THREAD_SCROLL_CLASS = "h-[min(28rem,55vh)]";

/** Max height for a single displayed comment body. */
export const REVIEW_BODY_SCROLL_CLASS = "max-h-36";

/** Composer / edit textarea scroll region height. */
export const REVIEW_INPUT_SCROLL_CLASS = "h-28";
