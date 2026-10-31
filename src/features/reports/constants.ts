export const REPORTS_QUERY_ROOT = "product-reports" as const;

export const REPORT_MESSAGE_MIN = 10;
export const REPORT_MESSAGE_MAX = 600;

export const PRODUCT_REPORT_TYPES = [
  "misleading_listing",
  "counterfeit",
  "prohibited",
  "inappropriate_content",
  "pricing",
  "safety",
  "spam",
  "other",
] as const;

export const PRODUCT_REPORT_STATUSES = [
  "open",
  "reviewed",
  "dismissed",
] as const;

export type ProductReportType = (typeof PRODUCT_REPORT_TYPES)[number];
export type ProductReportStatus = (typeof PRODUCT_REPORT_STATUSES)[number];

export const PRODUCT_REPORT_TYPE_LABELS: Record<ProductReportType, string> = {
  misleading_listing: "Misleading title, photos, or description",
  counterfeit: "Counterfeit or fake item",
  prohibited: "Prohibited or illegal item",
  inappropriate_content: "Inappropriate content",
  pricing: "Wrong or misleading price",
  safety: "Safety concern",
  spam: "Spam or scam",
  other: "Something else",
};

export const PRODUCT_REPORT_STATUS_LABELS: Record<ProductReportStatus, string> =
  {
    open: "Open",
    reviewed: "Reviewed",
    dismissed: "Dismissed",
  };
