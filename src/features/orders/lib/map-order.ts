import type { Order } from "../api";
import type { TrackedItem } from "../types";
import { getOrderStatusMeta, orderStatusLabel } from "./order-status";

export function formatOrderDate(iso: string) {
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function formatOrderStatusLabel(status: string) {
  return orderStatusLabel(status);
}

export function orderStatusSummary(order: Order) {
  if (order.status === "delivered" && order.refundStatus === "refunded") {
    return "Part of this order was refunded after a delivery return.";
  }
  if (order.status === "delivered" && order.totals.balanceDue > 0) {
    return "Delivered — balance due on delivery";
  }
  return getOrderStatusMeta(order.status).summary;
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

export function orderIsTrackable(order: Pick<Order, "status">) {
  return getOrderStatusMeta(order.status).trackable;
}

export function orderTrackUrl(order: Order, email: string) {
  const params = new URLSearchParams({
    order: order.orderNumber,
    email: email.trim().toLowerCase(),
  });
  return `/track-order?${params.toString()}`;
}
