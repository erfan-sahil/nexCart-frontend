import type { OrderStatus } from "../api";
import type { TrackedItem } from "../types";
import { getOrderStatusMeta, type OrderStatusGroup } from "./order-status";

export type HistoryFilter = "all" | OrderStatusGroup;

export type HistoryOrder = {
  id: string;
  orderNumber?: string;
  email: string;
  status: OrderStatus;
  placedOn: string;
  summary: string;
  items: TrackedItem[];
  trackable: boolean;
  total?: number;
};

export const HISTORY_FILTERS: { id: HistoryFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "open", label: "In progress" },
  { id: "returns", label: "Returns" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

export function matchesHistoryFilter(
  status: OrderStatus,
  filter: HistoryFilter,
) {
  return filter === "all" || getOrderStatusMeta(status).group === filter;
}
