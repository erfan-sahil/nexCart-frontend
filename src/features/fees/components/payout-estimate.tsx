"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { estimatePayout, formatTaka, REFERRAL_FEE_RATE } from "../lib/schedule";

const MIN_SALE = 10;
const MAX_SALE = 5000;

function clampSale(value: number) {
  if (!Number.isFinite(value)) return MIN_SALE;
  return Math.min(MAX_SALE, Math.max(MIN_SALE, value));
}

export function PayoutEstimate() {
  const [sale, setSale] = useState(120);
  const estimate = estimatePayout(sale);
  const keepShare =
    estimate.sale === 0 ? 0 : (estimate.payout / estimate.sale) * 100;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-base font-medium">Estimate a payout</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Uses the {Math.round(REFERRAL_FEE_RATE * 100)}% referral fee on the
            item price.
          </p>
        </div>
        <p className="font-display text-3xl tracking-tight whitespace-nowrap tabular-nums">
          {formatTaka(estimate.payout)}
        </p>
      </div>

      <div className="mt-5">
        <Label htmlFor="sale-price" className="text-sm">
          Item price
        </Label>
        <div className="mt-2 flex items-center gap-3">
          <div className="relative w-32 shrink-0">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
              Tk
            </span>
            <Input
              id="sale-price"
              type="number"
              inputMode="numeric"
              min={MIN_SALE}
              max={MAX_SALE}
              step={1}
              value={sale}
              aria-describedby="sale-range"
              className="h-11 rounded-xl pr-3 pl-9 text-sm tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              onChange={(event) => {
                const next = Number(event.target.value);
                if (Number.isFinite(next)) setSale(next);
              }}
              onBlur={() => setSale((current) => clampSale(current))}
            />
          </div>
          <input
            id="sale-range"
            type="range"
            min={MIN_SALE}
            max={MAX_SALE}
            step={1}
            value={clampSale(sale)}
            aria-label="Item price"
            className="h-1.5 min-w-0 flex-1 cursor-pointer accent-primary"
            onChange={(event) => setSale(Number(event.target.value))}
          />
        </div>
      </div>

      <div
        className="mt-5 flex h-2 overflow-hidden rounded-full bg-muted"
        role="img"
        aria-label={`${formatTaka(estimate.payout)} to you, ${formatTaka(estimate.fee)} referral fee`}
      >
        <div className="h-full bg-primary" style={{ width: `${keepShare}%` }} />
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <dt className="text-xs text-muted-foreground">Item price</dt>
          <dd className="mt-0.5 text-sm font-medium tabular-nums">
            {formatTaka(estimate.sale)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Referral fee</dt>
          <dd className="mt-0.5 text-sm font-medium tabular-nums">
            {formatTaka(estimate.fee)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">You receive</dt>
          <dd className="mt-0.5 text-sm font-medium text-primary tabular-nums">
            {formatTaka(estimate.payout)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
