import type { TrackedItem, TrackingStepId } from "../types";

import { SAMPLE_ORDERS, STATUS_COPY } from "./mock-orders";

export type HistoryStatus = TrackingStepId | "cancelled";

export type HistoryFilter = "all" | "open" | "delivered" | "cancelled";

export type HistoryOrder = {
  id: string;
  email: string;
  status: HistoryStatus;
  placedOn: string;
  summary: string;
  items: TrackedItem[];
  trackable: boolean;
};

export const HISTORY_FILTERS: { id: HistoryFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "open", label: "In progress" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

const CANCELLED: HistoryOrder = {
  id: "NX-30755",
  email: "aisha@example.com",
  status: "cancelled",
  placedOn: "Sep 18, 4:10 PM",
  summary: "Refunded to bKash",
  trackable: false,
  items: [
    {
      name: "Glow Restore Serum Kit",
      slug: "glow-serum-kit",
      image:
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80",
      quantity: 1,
      price: 42,
    },
  ],
};

function placedOn(events: { title: string; atLabel: string }[]) {
  const placed = [...events]
    .reverse()
    .find((event) => event.title === "Order placed");

  return placed?.atLabel ?? events.at(-1)?.atLabel ?? "";
}

export function orderHistory(): HistoryOrder[] {
  const tracked = SAMPLE_ORDERS.map((order) => ({
    id: order.id,
    email: order.email,
    status: order.status,
    placedOn: placedOn(order.events),
    summary: order.eta,
    items: order.items,
    trackable: true,
  }));

  return [...tracked, CANCELLED].sort((a, b) => {
    const order = ["NX-55102", "NX-48291", "NX-39014", "NX-11820", "NX-30755"];
    return order.indexOf(a.id) - order.indexOf(b.id);
  });
}

export function historyStatusLabel(status: HistoryStatus) {
  if (status === "cancelled") return "Cancelled";
  return STATUS_COPY[status].label;
}

export function matchesHistoryFilter(
  status: HistoryStatus,
  filter: HistoryFilter,
) {
  if (filter === "all") return true;
  if (filter === "delivered") return status === "delivered";
  if (filter === "cancelled") return status === "cancelled";
  return status !== "delivered" && status !== "cancelled";
}

export function orderTotal(items: TrackedItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
