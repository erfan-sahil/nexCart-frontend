import { categories, getCategoryBySlug } from "@/data/mock";
import type { BreadcrumbItem } from "@/components/common/page-breadcrumb";

export const PRODUCT_COLLECTIONS = [
  "bestsellers",
  "new-arrivals",
  "trending",
  "flash-deals",
  "recommended",
  "recently-viewed",
] as const;

export type ProductCollection = (typeof PRODUCT_COLLECTIONS)[number];

export const PRODUCT_SORTS = [
  "featured",
  "newest",
  "bestsellers",
  "price-asc",
  "price-desc",
  "rating",
] as const;

export type ProductSort = (typeof PRODUCT_SORTS)[number];

export const PRICE_FILTERS = [
  { id: "0-50", label: "Under $50", min: 0, max: 50 },
  { id: "50-100", label: "$50 – $100", min: 50, max: 100 },
  { id: "100-200", label: "$100 – $200", min: 100, max: 200 },
  { id: "200-", label: "$200 & up", min: 200, max: Number.POSITIVE_INFINITY },
] as const;

export type PriceFilterId = (typeof PRICE_FILTERS)[number]["id"];

export const RATING_FILTERS = [
  { value: 4, label: "4 stars & up" },
  { value: 3, label: "3 stars & up" },
] as const;

export const PRODUCT_SORT_OPTIONS: { id: ProductSort; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "bestsellers", label: "Best selling" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "rating", label: "Top rated" },
];

export type ProductQuery = {
  q?: string;
  collection?: ProductCollection;
  category?: string;
  subcategory?: string;
  sort: ProductSort;
  price?: PriceFilterId;
  rating?: number;
};

export type ProductSearchParams = Record<string, string | string[] | undefined>;

const COLLECTION_SET = new Set<string>(PRODUCT_COLLECTIONS);
const SORT_SET = new Set<string>(PRODUCT_SORTS);
const PRICE_SET = new Set<string>(PRICE_FILTERS.map((item) => item.id));

function first(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

function isCollection(value: string): value is ProductCollection {
  return COLLECTION_SET.has(value);
}

function isSort(value: string): value is ProductSort {
  return SORT_SET.has(value);
}

function isPrice(value: string): value is PriceFilterId {
  return PRICE_SET.has(value);
}

export function parseProductSearchParams(
  searchParams: ProductSearchParams,
  defaults: Partial<ProductQuery> = {},
): ProductQuery {
  const q = first(searchParams.q)?.trim() || defaults.q;
  const rawCollection = first(searchParams.collection) || defaults.collection;
  const rawSort = first(searchParams.sort);
  const category = first(searchParams.category) || defaults.category;
  const subcategory = first(searchParams.subcategory) || defaults.subcategory;
  const rawPrice = first(searchParams.price);
  const rawRating = first(searchParams.rating);

  let collection: ProductCollection | undefined;
  if (rawCollection && isCollection(rawCollection)) {
    collection = rawCollection;
  } else if (rawSort && isCollection(rawSort)) {
    collection = rawSort;
  }

  let sort: ProductSort = defaults.sort ?? "featured";
  if (rawSort && isSort(rawSort)) {
    sort = rawSort;
  } else if (collection === "bestsellers" && !rawSort) {
    sort = "bestsellers";
  }

  const ratingValue = rawRating ? Number(rawRating) : defaults.rating;
  const rating =
    ratingValue === 3 || ratingValue === 4 ? ratingValue : undefined;

  return {
    q: q || undefined,
    collection,
    category: category || undefined,
    subcategory: subcategory || undefined,
    sort,
    price: rawPrice && isPrice(rawPrice) ? rawPrice : defaults.price,
    rating,
  };
}

export function productsHref(query: Partial<ProductQuery>): string {
  const params = new URLSearchParams();

  if (query.q) params.set("q", query.q);
  if (query.collection) params.set("collection", query.collection);
  if (query.category) params.set("category", query.category);
  if (query.subcategory) params.set("subcategory", query.subcategory);
  if (query.sort && query.sort !== "featured") params.set("sort", query.sort);
  if (query.price) params.set("price", query.price);
  if (query.rating) params.set("rating", String(query.rating));

  const qs = params.toString();
  return qs ? `/products?${qs}` : "/products";
}

export function queryWithout(
  query: ProductQuery,
  keys: (keyof ProductQuery)[],
): Partial<ProductQuery> {
  const next: Partial<ProductQuery> = { ...query };
  for (const key of keys) {
    delete next[key];
  }
  return next;
}

type CollectionCopy = {
  eyebrow: string;
  title: string;
  description: string;
};

const COLLECTION_COPY: Record<ProductCollection, CollectionCopy> = {
  bestsellers: {
    eyebrow: "Bestsellers",
    title: "Top selling products",
    description: "What the marketplace cannot keep in stock.",
  },
  "new-arrivals": {
    eyebrow: "Just landed",
    title: "New arrivals",
    description: "Fresh inventory from vendors who listed this week.",
  },
  trending: {
    eyebrow: "Right now",
    title: "Trending products",
    description: "Rising fast across stores in the last 24 hours.",
  },
  "flash-deals": {
    eyebrow: "Limited time",
    title: "Flash deals",
    description: "Prices drop hard, then they are gone.",
  },
  recommended: {
    eyebrow: "For you",
    title: "Recommended for you",
    description: "Picked from stores and categories you tend to open.",
  },
  "recently-viewed": {
    eyebrow: "Pick up where you left",
    title: "Recently viewed",
    description: "Jump back into products you already opened.",
  },
};

export type ProductPageCopy = {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
};

export function getProductPageCopy(query: ProductQuery): ProductPageCopy {
  const category = query.category
    ? getCategoryBySlug(query.category)
    : undefined;
  const subcategory = category?.subcategories.find(
    (item) => item.slug === query.subcategory,
  );

  if (query.q) {
    return {
      eyebrow: "Search",
      title: `Results for “${query.q}”`,
      description: category
        ? `Matching products in ${category.name.toLowerCase()}.`
        : "Products, brands, and stores across the marketplace.",
      breadcrumbs: [
        { label: "Home", href: "/" },
        { label: "Products", href: "/products" },
        { label: query.q },
      ],
    };
  }

  if (category) {
    return {
      eyebrow: subcategory ? category.name : "Department",
      title: subcategory?.name ?? category.name,
      description: subcategory
        ? `Shop ${subcategory.name.toLowerCase()} from ${category.name.toLowerCase()} stores.`
        : category.description,
      breadcrumbs: [
        { label: "Home", href: "/" },
        { label: "Categories", href: "/categories" },
        {
          label: category.name,
          href: subcategory
            ? productsHref({ category: category.slug })
            : undefined,
        },
        ...(subcategory ? [{ label: subcategory.name }] : []),
      ],
    };
  }

  if (query.collection) {
    const copy = COLLECTION_COPY[query.collection];
    return {
      ...copy,
      breadcrumbs: [
        { label: "Home", href: "/" },
        { label: "Products", href: "/products" },
        { label: copy.title },
      ],
    };
  }

  return {
    eyebrow: "Marketplace",
    title: "All products",
    description: `Browse ${categories.length} departments from independent stores on NexCart.`,
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Products" }],
  };
}

export function getCollectionCopy(collection: ProductCollection) {
  return COLLECTION_COPY[collection];
}

export function hasActiveFilters(query: ProductQuery) {
  return Boolean(
    query.q ||
    query.collection ||
    query.category ||
    query.subcategory ||
    query.price ||
    query.rating,
  );
}
