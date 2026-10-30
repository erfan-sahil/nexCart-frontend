import { mediaUrl } from "@/lib/media";

import type { OrderTracking } from "../api";
import type { TrackedOrder, TrackingEvent, TrackingStepId } from "../types";
import { formatOrderDate } from "./map-order";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isCheckoutEmail(value: string) {
  return EMAIL_PATTERN.test(value.trim());
}

function stepFor(status: OrderTracking["status"]): TrackedOrder["status"] {
  if (status === "expired") return "expired";
  if (status === "awaiting_payment") return "placed";
  if (status === "confirmed") return "confirmed";
  if (status === "shipped") return "shipped";
  return "delivered";
}

function headline(status: OrderTracking["status"]) {
  if (status === "awaiting_payment") return "Waiting for payment";
  if (status === "confirmed") return "Preparing your order";
  if (status === "shipped") return "On the way";
  if (status === "delivered") return "Delivered";
  return "Order expired";
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

function buildEvents(order: OrderTracking): TrackingEvent[] {
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
    order.status !== "expired"
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
  const status: TrackingStepId | "expired" = stepFor(order.status);

  return {
    id: order.orderNumber,
    email,
    status,
    eta: headline(order.status),
    carrier: order.carrier.trim() || "Not assigned",
    trackingNumber: order.trackingNumber.trim(),
    shipTo: formatShipTo(order),
    paymentLabel: paymentLabel(order),
    total: order.grandTotal,
    events: buildEvents(order),
    items: order.items.map((item) => ({
      name: item.name,
      slug: item.slug,
      image: mediaUrl(item.imageUrl),
      quantity: item.quantity,
      price: item.unitPrice,
    })),
  };
}
