import { Minus, Plus } from "lucide-react";

import { MAX_CART_QUANTITY } from "../types";

type QuantityStepperProps = {
  quantity: number;
  label: string;
  onChange: (quantity: number) => void;
};

export function QuantityStepper({
  quantity,
  label,
  onChange,
}: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-background">
      <button
        type="button"
        className="inline-flex size-8 items-center justify-center rounded-full text-foreground transition-colors hover:text-primary disabled:opacity-40"
        aria-label={`Decrease quantity for ${label}`}
        disabled={quantity <= 1}
        onClick={() => onChange(quantity - 1)}
      >
        <Minus className="size-3.5" />
      </button>
      <span className="w-6 text-center text-sm font-semibold tabular-nums">
        {quantity}
      </span>
      <button
        type="button"
        className="inline-flex size-8 items-center justify-center rounded-full text-foreground transition-colors hover:text-primary disabled:opacity-40"
        aria-label={`Increase quantity for ${label}`}
        disabled={quantity >= MAX_CART_QUANTITY}
        onClick={() => onChange(quantity + 1)}
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
