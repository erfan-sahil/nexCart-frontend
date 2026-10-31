import { formatPrice } from "@/lib/format";

import type { SiteSettings } from "./types";

function money(value: number) {
  return Math.round(value * 100) / 100;
}

export function deliveryFeeFor(subtotal: number, settings: SiteSettings) {
  if (
    settings.freeDeliveryEnabled &&
    subtotal >= settings.freeDeliveryMinAmount
  ) {
    return 0;
  }

  return settings.deliveryFee;
}

export function freeShippingBanner(settings: SiteSettings) {
  if (!settings.freeDeliveryEnabled) return null;

  if (settings.freeDeliveryMinAmount <= 0) {
    return { lead: "Free shipping on all orders", amount: null };
  }

  return {
    lead: "Free shipping on orders over",
    amount: formatPrice(settings.freeDeliveryMinAmount, settings.currency),
  };
}

export function freeDeliveryNote(subtotal: number, settings: SiteSettings) {
  if (!settings.freeDeliveryEnabled || settings.freeDeliveryMinAmount <= 0) {
    return null;
  }

  if (subtotal >= settings.freeDeliveryMinAmount) {
    return "Free delivery applies to this order.";
  }

  const remaining = money(settings.freeDeliveryMinAmount - subtotal);
  return `Add ${formatPrice(remaining, settings.currency)} more for free delivery.`;
}
