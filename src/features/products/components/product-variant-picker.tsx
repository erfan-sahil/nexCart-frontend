"use client";

import { cn } from "@/lib/utils";

import { optionAvailable } from "../lib/variant-selection";
import type { SellableVariant, VariantAxis } from "../types/variant";

type ProductVariantPickerProps = {
  axes: VariantAxis[];
  variants: SellableVariant[];
  selection: Record<string, string>;
  onChange: (selection: Record<string, string>) => void;
};

export function ProductVariantPicker({
  axes,
  variants,
  selection,
  onChange,
}: ProductVariantPickerProps) {
  if (axes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {axes.map((axis) => (
        <div key={axis.attributeId}>
          <p className="text-xs font-medium text-muted-foreground">
            {axis.name}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {axis.options.map((option) => {
              const selected = selection[axis.attributeId] === option.id;
              const available = optionAvailable(
                variants,
                selection,
                axis.attributeId,
                option.id,
              );

              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={!available}
                  aria-pressed={selected}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm transition-colors",
                    selected
                      ? "border-primary bg-primary/10 font-medium text-primary"
                      : "border-border bg-card text-foreground hover:border-primary/40",
                    !available && "cursor-not-allowed opacity-40",
                  )}
                  onClick={() =>
                    onChange({
                      ...selection,
                      [axis.attributeId]: option.id,
                    })
                  }
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
