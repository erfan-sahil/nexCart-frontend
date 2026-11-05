import { AlertTriangle, Check } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  getOrderProgress,
  getOrderStatusMeta,
  ORDER_STAGES,
} from "../lib/order-status";

type OrderProgressProps = {
  status: string;
  className?: string;
};

/** Half of one stage column, so the track runs between the first and last step centres. */
const TRACK_INSET = `${50 / ORDER_STAGES.length}%`;

export function OrderProgress({ status, className }: OrderProgressProps) {
  const progress = getOrderProgress(status);
  if (!progress) return null;

  const { activeIndex, ratio, interrupted } = progress;
  const { label } = getOrderStatusMeta(status);
  const accent = interrupted ? "bg-orange-500" : "bg-primary";
  const fillWidth = `${ratio * 100}%`;

  return (
    <div
      role="progressbar"
      aria-label="Order progress"
      aria-valuemin={0}
      aria-valuemax={ORDER_STAGES.length - 1}
      aria-valuenow={activeIndex}
      aria-valuetext={label}
      className={className}
    >
      <div className="relative hidden sm:block">
        <div
          aria-hidden
          className="absolute top-4 h-1.5 -translate-y-1/2 rounded-full bg-border"
          style={{ left: TRACK_INSET, right: TRACK_INSET }}
        >
          <span
            className={cn(
              "absolute inset-y-0 left-0 rounded-full transition-[width] duration-500",
              accent,
            )}
            style={{ width: fillWidth }}
          />
        </div>

        <ol className="relative grid grid-cols-6">
          {ORDER_STAGES.map((stage, index) => {
            const completed = index <= activeIndex;
            const current = index === activeIndex;
            const warn = current && interrupted;

            return (
              <li
                key={stage.id}
                aria-current={current ? "step" : undefined}
                className="flex flex-col items-center gap-2 px-1 text-center"
              >
                <span
                  aria-hidden
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full text-xs font-semibold ring-4 ring-card",
                    warn
                      ? "bg-orange-500 text-white"
                      : completed
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {warn ? (
                    <AlertTriangle className="size-4" />
                  ) : completed ? (
                    <Check className="size-4" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={cn(
                    "text-[11px] leading-tight font-medium",
                    warn
                      ? "text-orange-700 dark:text-orange-300"
                      : current
                        ? "text-primary"
                        : completed
                          ? "text-muted-foreground"
                          : "text-muted-foreground/60",
                  )}
                >
                  {warn ? label : stage.label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="px-1.5 sm:hidden">
        <div aria-hidden className="relative h-1.5 rounded-full bg-border">
          <span
            className={cn(
              "absolute inset-y-0 left-0 rounded-full transition-[width] duration-500",
              accent,
            )}
            style={{ width: fillWidth }}
          />
          <span
            className={cn(
              "absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-card",
              accent,
            )}
            style={{ left: fillWidth }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>{ORDER_STAGES[0].label}</span>
          <span
            className={cn(
              "font-medium",
              interrupted
                ? "text-orange-700 dark:text-orange-300"
                : "text-primary",
            )}
          >
            {label}
          </span>
          <span>{ORDER_STAGES.at(-1)?.label}</span>
        </div>
      </div>
    </div>
  );
}
