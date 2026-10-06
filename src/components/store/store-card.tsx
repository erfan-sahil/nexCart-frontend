import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Star } from "lucide-react";

import { formatCount } from "@/lib/format";
import type { Store } from "@/types";

type StoreCardProps = {
  store: Store;
};

export function StoreCard({ store }: StoreCardProps) {
  return (
    <Link
      href={`/stores/${store.slug}`}
      className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-[0_8px_30px_rgba(10,10,10,0.06)] dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
    >
      <div className="relative h-28 overflow-hidden bg-surface-muted sm:h-32">
        <Image
          src={store.cover}
          alt=""
          fill
          sizes="(max-width: 768px) 90vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="relative px-4 pt-8 pb-4">
        <div className="absolute -top-7 left-4 size-14 overflow-hidden rounded-2xl border-2 border-card bg-surface-muted shadow-sm">
          <Image
            src={store.logo}
            alt={`${store.name} logo`}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="flex items-center gap-1 font-semibold text-foreground">
              {store.name}
              {store.verified ? (
                <BadgeCheck className="size-4 text-primary" />
              ) : null}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {formatCount(store.productCount)} products · {store.followers}{" "}
              followers
            </p>
          </div>
          <span className="inline-flex items-center gap-0.5 rounded-full bg-brand-soft px-2 py-0.5 text-xs font-medium text-primary">
            <Star className="size-3 fill-primary text-primary" />
            {store.rating}
          </span>
        </div>
      </div>
    </Link>
  );
}
