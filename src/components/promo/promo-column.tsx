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
      aria-label={`Sponsored: ${promo.title}`}
      className={cn(
        "group relative isolate flex h-full min-h-64 w-full flex-col overflow-hidden rounded-xl",
        className,
      )}
    >
      <Image
        src={promo.image}
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 288px"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/15" />
      <div className="relative z-10 mt-auto flex w-full flex-col justify-end p-4">
        <span className="absolute top-3 left-3 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium tracking-wide text-white/85 uppercase">
          {promo.eyebrow}
        </span>
        <h3 className="text-lg leading-tight font-semibold text-white">
          {promo.title}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-white/70">
          {promo.subtitle}
        </p>
        <div className="mt-3 rounded-lg bg-white/10 p-2.5 backdrop-blur-sm">
          <p className="line-clamp-1 text-xs font-medium text-white">
            {promo.productName}
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="text-sm font-semibold text-primary">
              {formatPrice(promo.price)}
            </span>
            {promo.originalPrice ? (
              <span className="text-[11px] text-white/50 line-through">
                {formatPrice(promo.originalPrice)}
              </span>
            ) : null}
            {off > 0 ? (
              <span className="text-[11px] font-medium text-primary">
                -{off}%
              </span>
            ) : null}
          </div>
        </div>
        <span className="mt-3 inline-flex h-8 w-fit items-center rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors group-hover:bg-brand-hover">
          {promo.ctaLabel}
        </span>
      </div>
    </Link>
  );
}
