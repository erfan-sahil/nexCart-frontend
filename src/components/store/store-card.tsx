import Link from "next/link";
import { BadgeCheck, Star } from "lucide-react";

import { MediaImage } from "@/components/common";
import { formatCount } from "@/lib/format";
import type { Store } from "@/types";

type StoreCardProps = {
  store: Store;
};

export function StoreCard({ store }: StoreCardProps) {
  return (
    <Link
      href={`/stores/${store.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-300 hover:border-primary"
    >
      <div className="relative h-28 overflow-hidden bg-surface-muted sm:h-32">
        <MediaImage
          src={store.cover}
          alt=""
          sizes="(max-width: 768px) 90vw, 33vw"
          className="transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 transition-colors duration-300 group-hover:bg-brand-soft">
        <div className="flex items-center gap-3">
          <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-muted text-sm font-semibold ring-1 ring-border">
            <MediaImage
              src={store.logo}
              alt={`${store.name} logo`}
              sizes="48px"
            />
            {store.logo ? null : store.name.slice(0, 1)}
          </span>
          <div className="min-w-0">
            <p className="flex items-center gap-1 font-display text-sm font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
              <span className="truncate">{store.name}</span>
              {store.verified ? (
                <BadgeCheck className="size-4 shrink-0 text-primary" />
              ) : null}
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="size-3.5 fill-primary text-primary" />
              <span className="font-medium text-foreground">
                {Number.isInteger(store.rating)
                  ? store.rating
                  : store.rating.toFixed(1)}
              </span>
            </p>
          </div>
        </div>

        <p className="border-t border-border pt-3 text-xs text-muted-foreground">
          {formatCount(store.productCount)} products · {store.followers} orders
        </p>
      </div>
    </Link>
  );
}
