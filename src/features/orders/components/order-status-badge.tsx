import { cn } from "@/lib/utils";

import { getOrderStatusMeta, ORDER_STATUS_BADGE } from "../lib/order-status";

type OrderStatusBadgeProps = {
  status: string;
  size?: "sm" | "md";
  className?: string;
};

export function OrderStatusBadge({
  status,
  size = "sm",
  className,
}: OrderStatusBadgeProps) {
  const { label, tone } = getOrderStatusMeta(status);

  return (
    <span
      className={cn(
        "inline-flex rounded-full font-medium whitespace-nowrap",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
        ORDER_STATUS_BADGE[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}
