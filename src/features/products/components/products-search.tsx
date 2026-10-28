import { Search } from "lucide-react";

import type { ProductQuery } from "../lib/query";

type ProductsSearchProps = {
  query: ProductQuery;
};

export function ProductsSearch({ query }: ProductsSearchProps) {
  return (
    <form action="/products" role="search" className="min-w-0 flex-1">
      {query.collection ? (
        <input type="hidden" name="collection" value={query.collection} />
      ) : null}
      {query.category ? (
        <input type="hidden" name="category" value={query.category} />
      ) : null}
      {query.subcategory ? (
        <input type="hidden" name="subcategory" value={query.subcategory} />
      ) : null}
      {query.sort && (query.sortExplicit || query.sort !== "featured") ? (
        <input type="hidden" name="sort" value={query.sort} />
      ) : null}
      {query.price ? (
        <input type="hidden" name="price" value={query.price} />
      ) : null}
      {query.rating ? (
        <input type="hidden" name="rating" value={String(query.rating)} />
      ) : null}
      <label htmlFor="catalog-search" className="sr-only">
        Search products
      </label>
      <div className="flex h-11 overflow-hidden rounded-full border border-border bg-card focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25">
        <input
          id="catalog-search"
          name="q"
          type="search"
          defaultValue={query.q ?? ""}
          placeholder="Search this catalog"
          className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="m-1 inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 font-display text-sm font-semibold text-[#fff4f2] transition-colors hover:bg-ink"
        >
          <Search className="size-4" />
          Search
        </button>
      </div>
    </form>
  );
}
