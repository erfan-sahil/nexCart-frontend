import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

import { FREE_SHIPPING_AT, type CartTotals } from "../lib/totals";
import type { ResolvedCartLine } from "../types";

type OrderSummaryProps = {
  totals: CartTotals;
  lines?: ResolvedCartLine[];
  action?: React.ReactNode;
};

export function OrderSummary({ totals, lines, action }: OrderSummaryProps) {
  const progress = Math.min(
    100,
    totals.subtotal === 0 ? 0 : (totals.subtotal / FREE_SHIPPING_AT) * 100,
  );
  const rows = [
    { label: "Subtotal", value: formatPrice(totals.subtotal) },
    {
      label: "Shipping",
      value: totals.shipping === 0 ? "Free" : formatPrice(totals.shipping),
    },
    { label: "Estimated tax", value: formatPrice(totals.tax) },
  ];

  return (
    <aside className="rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-40">
      <h2 className="font-display text-lg font-semibold">Order summary</h2>

      {totals.subtotal > 0 ? (
        <div className="mt-4">
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {totals.freeShippingRemaining > 0
              ? `Add ${formatPrice(totals.freeShippingRemaining)} for free shipping`
              : "Your order qualifies for free shipping"}
          </p>
        </div>
      ) : null}

      {lines?.length ? (
        <ul className="mt-4 space-y-3 border-b border-border pb-4">
          {lines.map((line) => (
            <li
              key={line.product.id}
              className="flex items-start justify-between gap-3 text-sm"
            >
              <p className="min-w-0">
                <span className="line-clamp-2 font-medium">
                  {line.product.name}
                </span>
                <span className="text-muted-foreground">
                  Qty {line.quantity}
                </span>
              </p>
              <span className="shrink-0 font-medium tabular-nums">
                {formatPrice(line.product.price * line.quantity)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <dl className="mt-4 space-y-2 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd className="font-medium tabular-nums">{row.value}</dd>
          </div>
        ))}
        {totals.savings > 0 ? (
          <div className="flex items-center justify-between text-primary">
            <dt>You save</dt>
            <dd className="font-medium tabular-nums">
              {formatPrice(totals.savings)}
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
        <p className="text-sm font-medium">Total</p>
        <p className="font-display text-2xl tracking-tight tabular-nums">
          {formatPrice(totals.total)}
        </p>
      </div>

      {action ?? (
        <Button
          nativeButton={false}
          render={<Link href="/checkout" />}
          className="auth-orange-button mt-5 w-full"
        >
          <ShoppingBag className="size-4" />
          Checkout
        </Button>
      )}

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Preview checkout. No payment is captured.
      </p>
    </aside>
  );
}
