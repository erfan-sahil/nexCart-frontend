import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

import type { ResolvedCartLine } from "../lib/catalog";
import type { CartTotals } from "../lib/totals";

type OrderSummaryProps = {
  totals: CartTotals & { dueNow?: number };
  lines?: ResolvedCartLine[];
  dueNow?: number;
  loadingQuote?: boolean;
  deliveryNote?: string | null;
  action?: React.ReactNode;
};

export function OrderSummary({
  totals,
  lines,
  dueNow,
  loadingQuote,
  deliveryNote,
  action,
}: OrderSummaryProps) {
  const payNow = dueNow ?? totals.dueNow ?? totals.total;
  const deliveryIsFree = totals.itemCount > 0 && totals.deliveryFee === 0;

  const rows = [
    { label: "Subtotal", value: formatPrice(totals.subtotal) },
    {
      label: "Delivery",
      value: deliveryIsFree ? "Free" : formatPrice(totals.deliveryFee),
    },
  ];

  return (
    <aside className="rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-40">
      <h2 className="font-display text-lg font-semibold">Order summary</h2>

      {loadingQuote ? (
        <p className="mt-2 text-xs text-muted-foreground">Updating totals…</p>
      ) : null}

      {lines?.length ? (
        <ul className="mt-4 space-y-3 border-b border-border pb-4">
          {lines.map((line) => (
            <li
              key={line.variantId}
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

      {deliveryNote ? (
        <p className="mt-3 text-xs text-muted-foreground">{deliveryNote}</p>
      ) : null}

      <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
        <p className="text-sm font-medium">Order total</p>
        <p className="font-display text-2xl tracking-tight tabular-nums">
          {formatPrice(totals.total)}
        </p>
      </div>

      {payNow !== totals.total ? (
        <div className="mt-3 flex items-center justify-between rounded-lg bg-brand-soft px-3 py-2 text-sm">
          <span className="text-muted-foreground">Due now</span>
          <span className="font-semibold tabular-nums">
            {formatPrice(payNow)}
          </span>
        </div>
      ) : null}

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
        Totals are confirmed by the server at checkout.
      </p>
    </aside>
  );
}
