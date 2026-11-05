import { mediaUrl } from "@/lib/media";

import type { OrderTracking } from "../api";
import type { TrackedOrder, TrackingEvent } from "../types";
import { formatOrderDate } from "./map-order";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isCheckoutEmail(value: string) {
  return EMAIL_PATTERN.test(value.trim());
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

  return {
    id: order.orderNumber,
    email,
    status: order.status,
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
