import { mediaUrl } from "@/lib/media";

import type { CustomerTimelineStep, OrderTracking } from "../api";
import type { TrackedOrder, TrackingEvent, TrackingStepId } from "../types";
import { formatOrderDate } from "./map-order";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isCheckoutEmail(value: string) {
  return EMAIL_PATTERN.test(value.trim());
}

function stepFor(status: OrderTracking["status"]): TrackedOrder["status"] {
  if (status === "cancelled") return "cancelled";
  if (status === "expired") return "expired";
  if (status === "awaiting_payment") return "placed";
  if (
    status === "confirmed" ||
    status === "product_accepted" ||
    status === "shipped_to_warehouse"
  ) {
    return "confirmed";
  }
  if (
    status === "shipped" ||
    status === "out_for_delivery" ||
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

function coarseStepFromTimeline(
  timeline: CustomerTimelineStep[],
): TrackingStepId {
  const lastCompleted = [...timeline].reverse().find((step) => step.completed);

  if (!lastCompleted) {
    return "placed";
  }

  const coarse: Record<string, TrackingStepId> = {
    placed: "placed",
    confirmed: "confirmed",
    product_accepted: "confirmed",
    preparing: "confirmed",
    at_warehouse: "confirmed",
    inspected: "confirmed",
    packing: "confirmed",
    shipped_to_warehouse: "shipped",
    shipped: "shipped",
    out_for_delivery: "out_for_delivery",
    delivered: "delivered",
    delivery_failed: "out_for_delivery",
    customer_rejected: "out_for_delivery",
    returning_to_warehouse: "out_for_delivery",
    refund_processing: "out_for_delivery",
    refunded: "delivered",
  };

  return coarse[lastCompleted.id] ?? "confirmed";
}

function headline(order: OrderTracking) {
  if (order.status === "cancelled") return "Order cancelled";
  if (order.status === "awaiting_payment") return "Waiting for payment";
  if (order.status === "expired") return "Order expired";

  const timeline = order.timeline ?? [];

  if (timeline.length > 0) {
    const next = timeline.find((step) => !step.completed);
    if (next) {
      return next.label;
    }

    const delivered = timeline.find((step) => step.id === "delivered");
    if (delivered?.completed) {
      return "Delivered";
    }
  }

  if (order.status === "delivery_failed") return "Delivery failed";
  if (order.status === "customer_rejected") return "Customer rejected delivery";
  if (order.status === "returning_to_warehouse")
    return "Returning to warehouse";
  if (order.status === "refund_processing") return "Refund processing";
  if (order.status === "refunded") return "Refunded";
  if (order.status === "confirmed" || order.status === "product_accepted") {
    return "Preparing your order";
  }
  if (order.status === "shipped" || order.status === "out_for_delivery") {
    return "On the way";
  }
  if (order.status === "delivered") return "Delivered";
  return "Order update";
}

function paymentLabel(order: OrderTracking) {
  if (order.paymentMethod === "cod") return "Cash on delivery";
  if (order.paymentStatus === "paid") return "Paid online";
  if (order.paymentStatus === "partially_paid") return "Partly paid";
  return "Payment pending";
}

function formatShipTo(order: OrderTracking) {
  const address = [
    order.shipTo.line1,
    order.shipTo.line2,
    order.shipTo.city,
    order.shipTo.state,
    order.shipTo.postalCode,
  ]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(", ");

  return address
    ? `${order.shipTo.recipientName} · ${address}`
    : order.shipTo.recipientName;
}

function pushEvent(
  events: TrackingEvent[],
  id: string,
  title: string,
  detail: string,
  at: string,
  location: string,
) {
  events.push({
    id,
    title,
    detail,
    location,
    atLabel: formatOrderDate(at),
  });
}

function eventsFromTimeline(
  order: OrderTracking,
  city: string,
): TrackingEvent[] {
  const timeline = order.timeline ?? [];
  const completed = timeline.filter((step) => step.completed);

  return [...completed].reverse().map((step) => ({
    id: step.id,
    title: step.label,
    detail: step.label,
    location: city,
    atLabel: formatOrderDate(step.at ?? order.placedAt),
  }));
}

function buildLegacyEvents(order: OrderTracking): TrackingEvent[] {
  const city = order.shipTo.city.trim() || "Bangladesh";
  const events: TrackingEvent[] = [];

  if (order.deliveredAt) {
    pushEvent(
      events,
      "delivered",
      "Delivered",
      "Delivered to the shipping address.",
      order.deliveredAt,
      city,
    );
  }

  if (order.shippedAt) {
    pushEvent(
      events,
      "shipped",
      "Shipped",
      order.carrier
        ? `Handed to ${order.carrier}.`
        : "The package is on the way.",
      order.shippedAt,
      city,
    );
  }

  if (order.packedAt) {
    pushEvent(
      events,
      "packed",
      "Packed",
      "Packed and ready for the courier.",
      order.packedAt,
      city,
    );
  }

  if (
    order.fulfillmentStartedAt &&
    order.status !== "awaiting_payment" &&
    order.status !== "expired" &&
    order.status !== "cancelled"
  ) {
    pushEvent(
      events,
      "confirmed",
      "Confirmed",
      "The seller is preparing this order.",
      order.fulfillmentStartedAt,
      city,
    );
  }

  if (order.status === "cancelled") {
    pushEvent(
      events,
      "cancelled",
      "Order cancelled",
      "This order will not be shipped.",
      order.placedAt,
      "NexCart",
    );
  }

  if (order.status === "expired") {
    pushEvent(
      events,
      "expired",
      "Payment window expired",
      "This order was not confirmed.",
      order.placedAt,
      "NexCart",
    );
  }

  if (order.status === "awaiting_payment") {
    pushEvent(
      events,
      "payment",
      "Waiting for payment",
      "Complete payment to confirm this order.",
      order.placedAt,
      "NexCart",
    );
  }

  pushEvent(
    events,
    "placed",
    "Order placed",
    "We received this order.",
    order.placedAt,
    "NexCart",
  );

  return events;
}

export function toTrackedOrder(
  order: OrderTracking,
  email: string,
): TrackedOrder {
  const timeline = order.timeline ?? [];
  const hasTimeline = timeline.length > 0;
  const coarseStatus = stepFor(order.status);
  const status: TrackedOrder["status"] =
    coarseStatus === "cancelled" || coarseStatus === "expired"
      ? coarseStatus
      : hasTimeline
        ? coarseStepFromTimeline(timeline)
        : coarseStatus;

  return {
    id: order.orderNumber,
    email,
    status,
    eta: headline(order),
    carrier: order.carrier.trim() || "Not assigned",
    trackingNumber: order.trackingNumber.trim(),
    shipTo: formatShipTo(order),
    paymentLabel: paymentLabel(order),
    total: order.grandTotal,
    timeline,
    events: hasTimeline
      ? eventsFromTimeline(order, order.shipTo.city.trim() || "Bangladesh")
      : buildLegacyEvents(order),
    items: order.items.map((item) => ({
      name: item.name,
      slug: item.slug,
      image: mediaUrl(item.imageUrl),
      quantity: item.quantity,
      price: item.unitPrice,
    })),
  };
}
