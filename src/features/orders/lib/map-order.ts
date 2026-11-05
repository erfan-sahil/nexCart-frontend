import type { Order, OrderStatus } from "../api";
import type { HistoryStatus } from "./order-history";
import type { TrackedItem } from "../types";

export function mapOrderStatus(status: OrderStatus): HistoryStatus {
  if (status === "cancelled" || status === "expired") return "cancelled";
  if (status === "awaiting_payment") return "placed";
  if (
    status === "confirmed" ||
    status === "product_accepted" ||
    status === "shipped_to_warehouse"
  ) {
    return "confirmed";
  }
  if (status === "shipped" || status === "out_for_delivery") return "shipped";
  if (
    status === "delivery_failed" ||
    status === "customer_rejected" ||
    status === "returning_to_warehouse" ||
    status === "refund_processing" ||
    status === "refunded"
  ) {
    return "shipped";
  }
  return "delivered";
}

export function formatOrderDate(iso: string) {
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function formatOrderStatusLabel(status: OrderStatus | string) {
  if (status === "awaiting_payment") return "Awaiting payment";
  if (status === "cancelled") return "Cancelled";
  if (status === "expired") return "Expired";
  if (status === "delivery_failed") return "Delivery failed";
  if (status === "customer_rejected") return "Customer rejected";
  if (status === "returning_to_warehouse") return "Returning to warehouse";
  if (status === "refund_processing") return "Refund processing";
  if (status === "refunded") return "Refunded";
  if (status === "out_for_delivery") return "Out for delivery";
  if (status === "shipped_to_warehouse") return "Shipped to warehouse";
  if (status === "product_accepted") return "Vendor accepted";
  return String(status).replace(/_/g, " ");
}

export function orderStatusSummary(order: Order) {
  if (order.status === "cancelled") {
    return "This order was cancelled";
  }
  if (order.status === "awaiting_payment") {
    return "Complete payment to confirm";
  }
  if (order.status === "expired") {
    return "Payment window expired";
  }
  if (order.status === "delivery_failed") {
    return "Delivery could not be completed. The package is returning to NexCart.";
  }
  if (order.status === "customer_rejected") {
    return "You rejected some or all items at delivery. Rejected items are returning to NexCart.";
  }
  if (order.status === "returning_to_warehouse") {
    return "Returned items are on the way back to the NexCart warehouse.";
  }
  if (order.status === "refund_processing") {
    return "Warehouse accepted the return. Your refund is being processed.";
  }
  if (order.status === "refunded") {
    return "Refund for rejected items has been recorded.";
  }
  if (order.refundStatus === "refunded") {
    return "Part of this order was refunded after a delivery return.";
  }
  if (order.status === "confirmed" || order.status === "product_accepted") {
    return "Vendors and warehouse are preparing your items";
  }
  if (
    order.status === "shipped" ||
    order.status === "shipped_to_warehouse" ||
    order.status === "out_for_delivery"
  ) {
    return "On the way to you";
  }
  if (order.status === "delivered" && order.totals.balanceDue > 0) {
    return "Delivered — balance due on delivery";
  }
  if (order.status === "delivered") {
    return "Delivered. Returns are not available after you accept delivery.";
  }
  return "Delivered";
}

export function orderItemsToTracked(order: Order): TrackedItem[] {
  return order.items.map((item) => ({
    name: item.productName,
    slug: item.productId,
    image: "",
    quantity: item.quantity,
    price: item.lineTotal,
  }));
}

export function orderIsTrackable(order: Order) {
  if (order.status === "cancelled" || order.status === "expired") {
    return false;
  }

  return (
    order.status === "confirmed" ||
    order.status === "product_accepted" ||
    order.status === "shipped_to_warehouse" ||
    order.status === "shipped" ||
    order.status === "out_for_delivery" ||
    order.status === "delivered" ||
    order.status === "delivery_failed" ||
    order.status === "customer_rejected" ||
    order.status === "returning_to_warehouse" ||
    order.status === "refund_processing" ||
    order.status === "refunded"
  );
}

export function orderTrackUrl(order: Order, email: string) {
  const params = new URLSearchParams({
    order: order.orderNumber,
    email: email.trim().toLowerCase(),
  });
  return `/track-order?${params.toString()}`;
}
