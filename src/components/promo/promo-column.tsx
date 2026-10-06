import Image from "next/image";
import Link from "next/link";

import { discountPercent, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PromoSlot } from "@/types";

type PromoColumnProps = {
  promo: PromoSlot;
  className?: string;
};

export function PromoColumn({ promo, className }: PromoColumnProps) {
  const off = discountPercent(promo.price, promo.originalPrice);

  return (
    <Link
      href={promo.href}
      aria-label={`${promo.eyebrow}: ${promo.title}`}
      className={cn(
        "group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card",
        className,
      )}
    >
      <div className="relative min-h-64 flex-1 overflow-hidden bg-surface-muted">
        <Image
          src={promo.image}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 320px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <span className="rounded-full bg-card/95 px-2.5 py-1 text-[11px] font-medium text-foreground shadow-sm">
            {promo.eyebrow}
          </span>
          {off > 0 ? (
            <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-[#fff4f2]">
              -{off}%
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-3 bg-card p-4 transition-colors duration-300 group-hover:bg-brand-soft">
        <div>
          <h3 className="font-display text-2xl leading-tight font-semibold text-foreground">
            {promo.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {promo.subtitle}
          </p>
        </div>

        <div className="border-t border-border pt-3">
          <p className="truncate text-sm font-medium text-foreground">
            {promo.productName}
          </p>
          <p className="mt-1.5 flex items-baseline gap-2">
            <span className="text-lg leading-none font-semibold tracking-tight text-foreground">
              {formatPrice(promo.price)}
            </span>
            {promo.originalPrice ? (
              <span className="text-xs leading-none text-muted-foreground line-through">
                {formatPrice(promo.originalPrice)}
              </span>
            ) : null}
          </p>
        </div>

        <span className="inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-[#fff4f2] transition-colors duration-300 group-hover:bg-brand-hover">
          {promo.ctaLabel}
        </span>
      </div>
    </Link>
  );
}
