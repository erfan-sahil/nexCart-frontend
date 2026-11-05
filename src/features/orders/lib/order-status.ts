import type { OrderStatus } from "../api";

export const ORDER_STAGES = [
  { id: "placed", label: "Placed" },
  { id: "confirmed", label: "Confirmed" },
  { id: "product_accepted", label: "Vendor accepted" },
  { id: "shipped_to_warehouse", label: "At warehouse" },
  { id: "out_for_delivery", label: "Out for delivery" },
  { id: "delivered", label: "Delivered" },
] as const;

export type OrderStageId = (typeof ORDER_STAGES)[number]["id"];

export type OrderStatusTone =
  | "neutral"
  | "processing"
  | "transit"
  | "delivery"
  | "success"
  | "attention"
  | "danger";

export type OrderStatusGroup = "open" | "returns" | "delivered" | "cancelled";

export type OrderStatusMeta = {
  label: string;
  headline: string;
  summary: string;
  /** Stage on the shared progress bar; `null` hides the progress bar. */
  stage: OrderStageId | null;
  /** Stage was reached but the order left the happy path there. */
  interrupted: boolean;
  tone: OrderStatusTone;
  group: OrderStatusGroup;
  trackable: boolean;
};

const ORDER_STATUS_META: Record<OrderStatus, OrderStatusMeta> = {
  awaiting_payment: {
    label: "Awaiting payment",
    headline: "Waiting for payment",
    summary: "Complete payment to confirm this order.",
    stage: "placed",
    interrupted: false,
    tone: "neutral",
    group: "open",
    trackable: false,
  },
  confirmed: {
    label: "Confirmed",
    headline: "Order confirmed",
    summary: "We sent your items to the vendors for acceptance.",
    stage: "confirmed",
    interrupted: false,
    tone: "processing",
    group: "open",
    trackable: true,
  },
  product_accepted: {
    label: "Vendor accepted",
    headline: "Vendors are preparing your items",
    summary: "Vendors accepted your items and are preparing them for NexCart.",
    stage: "product_accepted",
    interrupted: false,
    tone: "processing",
    group: "open",
    trackable: true,
  },
  shipped_to_warehouse: {
    label: "At warehouse",
    headline: "Processing at NexCart",
    summary:
      "Your items are on the way to, or being packed at, the NexCart warehouse.",
    stage: "shipped_to_warehouse",
    interrupted: false,
    tone: "transit",
    group: "open",
    trackable: true,
  },
  shipped: {
    label: "Shipped",
    headline: "Shipped",
    summary: "Your package left the warehouse and is moving toward you.",
    stage: "shipped_to_warehouse",
    interrupted: false,
    tone: "transit",
    group: "open",
    trackable: true,
  },
  out_for_delivery: {
    label: "Out for delivery",
    headline: "Out for delivery",
    summary: "The courier has your package and is on the way.",
    stage: "out_for_delivery",
    interrupted: false,
    tone: "delivery",
    group: "open",
    trackable: true,
  },
  delivered: {
    label: "Delivered",
    headline: "Delivered",
    summary: "Delivered. Returns are not available after you accept delivery.",
    stage: "delivered",
    interrupted: false,
    tone: "success",
    group: "delivered",
    trackable: true,
  },
  delivery_failed: {
    label: "Delivery failed",
    headline: "Delivery failed",
    summary:
      "Delivery could not be completed. The package is returning to NexCart.",
    stage: "out_for_delivery",
    interrupted: true,
    tone: "attention",
    group: "returns",
    trackable: true,
  },
  customer_rejected: {
    label: "Rejected at delivery",
    headline: "Rejected at delivery",
    summary:
      "You rejected some or all items at delivery. Rejected items are returning to NexCart.",
    stage: "out_for_delivery",
    interrupted: true,
    tone: "attention",
    group: "returns",
    trackable: true,
  },
  returning_to_warehouse: {
    label: "Returning to warehouse",
    headline: "Returning to NexCart",
    summary: "Returned items are on the way back to the NexCart warehouse.",
    stage: "out_for_delivery",
    interrupted: true,
    tone: "attention",
    group: "returns",
    trackable: true,
  },
  refund_processing: {
    label: "Refund processing",
    headline: "Refund processing",
    summary:
      "The warehouse accepted the return. Your refund is being processed.",
    stage: "out_for_delivery",
    interrupted: true,
    tone: "attention",
    group: "returns",
    trackable: true,
  },
  refunded: {
    label: "Refunded",
    headline: "Refunded",
    summary: "The refund for the returned items has been recorded.",
    stage: "out_for_delivery",
    interrupted: true,
    tone: "neutral",
    group: "returns",
    trackable: true,
  },
  expired: {
    label: "Expired",
    headline: "Order expired",
    summary: "The payment window closed before this order was confirmed.",
    stage: null,
    interrupted: false,
    tone: "danger",
    group: "cancelled",
    trackable: false,
  },
  cancelled: {
    label: "Cancelled",
    headline: "Order cancelled",
    summary: "This order was cancelled and will not be shipped.",
    stage: null,
    interrupted: false,
    tone: "danger",
    group: "cancelled",
    trackable: false,
  },
};

const EXTRA_STATUS_LABELS: Record<string, string> = {
  returned_to_warehouse: "Returned to warehouse",
  accepted: "Accepted",
  requested: "Requested",
  rejected: "Rejected",
};

export const ORDER_STATUS_BADGE: Record<OrderStatusTone, string> = {
  neutral: "bg-slate-500/15 text-slate-700 dark:text-slate-300",
  processing: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  transit: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  delivery: "bg-amber-500/15 text-amber-800 dark:text-amber-300",
  success: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  attention: "bg-orange-500/15 text-orange-800 dark:text-orange-300",
  danger: "bg-destructive/10 text-destructive",
};

function isKnownOrderStatus(status: string): status is OrderStatus {
  return Object.prototype.hasOwnProperty.call(ORDER_STATUS_META, status);
}

function humanizeStatus(status: string) {
  const text = status.replace(/_/g, " ").trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "Unknown";
}

export function getOrderStatusMeta(status: string): OrderStatusMeta {
  if (isKnownOrderStatus(status)) return ORDER_STATUS_META[status];

  const label = humanizeStatus(status);
  return {
    label,
    headline: label,
    summary: "We will update this page as your order moves.",
    stage: null,
    interrupted: false,
    tone: "neutral",
    group: "open",
    trackable: true,
  };
}

export function orderStatusLabel(status: string) {
  if (isKnownOrderStatus(status)) return ORDER_STATUS_META[status].label;
  return EXTRA_STATUS_LABELS[status] ?? humanizeStatus(status);
}

export type OrderProgress = {
  activeIndex: number;
  /** 0–1 position of the active stage along the bar. */
  ratio: number;
  interrupted: boolean;
};

export function getOrderProgress(status: string): OrderProgress | null {
  const { stage, interrupted } = getOrderStatusMeta(status);
  if (!stage) return null;

  const activeIndex = ORDER_STAGES.findIndex((item) => item.id === stage);
  return {
    activeIndex,
    ratio: activeIndex / (ORDER_STAGES.length - 1),
    interrupted,
  };
}
