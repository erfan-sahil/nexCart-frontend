import Link from "next/link";
import {
  CalendarDays,
  Mail,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  Star,
} from "lucide-react";

import { MediaImage } from "@/components/common";
import type { StoreProfile } from "@/features/catalog";
import { formatCount } from "@/lib/format";

type StoreHeroProps = {
  store: StoreProfile;
};

const NEW_STORE_DAYS = 90;

const actionClass =
  "inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium transition-colors hover:border-primary hover:text-primary";

function formatJoined(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function isNewStore(value: string) {
  const joinedAt = new Date(value).getTime();
  if (Number.isNaN(joinedAt)) return false;

  return Date.now() - joinedAt < NEW_STORE_DAYS * 24 * 60 * 60 * 1000;
}

function ratingLabel(rating: number) {
  return Number.isInteger(rating) ? String(rating) : rating.toFixed(1);
}

export function StoreHero({ store }: StoreHeroProps) {
  const joined = formatJoined(store.joinedAt);
  const hasRating = store.reviewCount > 0 || store.rating > 0;
  const showNewBadge = !hasRating && isNewStore(store.joinedAt);

  const stats = [
    ...(hasRating
      ? [
          {
            label: `${formatCount(store.reviewCount)} reviews`,
            value: ratingLabel(store.rating),
            icon: Star,
          },
        ]
      : []),
    {
      label: "Products",
      value: formatCount(store.productCount),
      icon: Package,
    },
    {
      label: "Orders",
      value: formatCount(store.orderCount),
      icon: ShoppingBag,
    },
    ...(joined
      ? [{ label: "Member since", value: joined, icon: CalendarDays }]
      : []),
  ];

  return (
    <header className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative h-32 bg-surface-muted sm:h-48">
        <MediaImage
          src={store.banner}
          alt=""
          sizes="(max-width: 1280px) 100vw, 80rem"
          priority
        />
      </div>

      <div className="px-4 pb-6 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-5">
          <span className="relative -mt-10 flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-surface-muted text-3xl font-semibold ring-4 ring-card sm:-mt-12 sm:size-24">
            <MediaImage
              src={store.logo}
              alt={`${store.name} logo`}
              sizes="96px"
            />
            {store.logo ? null : store.name.slice(0, 1)}
          </span>

          <div className="min-w-0 flex-1 sm:pb-1">
            <h1 className="text-3xl text-foreground sm:text-4xl">
              {store.name}
            </h1>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              {showNewBadge ? (
                <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-[#fff4f2]">
                  New store
                </span>
              ) : null}
              {store.location ? (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4 text-primary" />
                  {store.location}
                </span>
              ) : null}
            </p>
          </div>

          {store.email || store.phone ? (
            <div className="flex gap-2 sm:pb-1">
              {store.email ? (
                <a href={`mailto:${store.email}`} className={actionClass}>
                  <Mail className="size-4" />
                  Email
                </a>
              ) : null}
              {store.phone ? (
                <a href={`tel:${store.phone}`} className={actionClass}>
                  <Phone className="size-4" />
                  Call
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        {store.description || store.categories.length > 0 ? (
          <div className="mt-5 space-y-4">
            {store.description ? (
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                {store.description}
              </p>
            ) : null}

            {store.categories.length > 0 ? (
              <ul
                aria-label="Store categories"
                className="flex flex-wrap gap-2"
              >
                {store.categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/categories/${category.slug}`}
                      className="inline-flex rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl bg-surface-muted p-3.5"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <div className="flex min-w-0 flex-col-reverse">
                <dt className="truncate text-xs text-muted-foreground">
                  {label}
                </dt>
                <dd className="truncate text-lg font-semibold tabular-nums">
                  {value}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}
