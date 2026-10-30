import type { Order, OrderStatus } from "../api";
import type { HistoryStatus } from "./order-history";
import type { TrackedItem } from "../types";

export function mapOrderStatus(status: OrderStatus): HistoryStatus {
  if (status === "expired") return "cancelled";
  if (status === "awaiting_payment") return "placed";
  if (status === "confirmed") return "confirmed";
  if (status === "shipped") return "shipped";
  return "delivered";
}

export function formatOrderDate(iso: string) {
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function orderStatusSummary(order: Order) {
  if (order.status === "awaiting_payment") {
    return "Complete payment to confirm";
  }
  if (order.status === "expired") {
    return "Payment window expired";
  }
  if (order.status === "confirmed") {
    return "Preparing at the warehouse";
  }
  if (order.status === "shipped") {
    return "On the way to you";
  }
  if (order.status === "delivered" && order.totals.balanceDue > 0) {
    return "Delivered — balance due on delivery";
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
  return (
    order.status === "confirmed" ||
    order.status === "shipped" ||
    order.status === "delivered"
  );
}
