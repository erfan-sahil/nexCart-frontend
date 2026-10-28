"use client";

import {
  Suspense,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Loader2, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { MediaImage } from "@/components/common";
import { suggestProducts } from "@/features/catalog/suggest";
import { formatPrice } from "@/lib/format";
import { mediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  className?: string;
};

const MIN_QUERY = 2;

function useDebouncedValue(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function Highlight({ text, query }: { text: string; query: string }) {
  const words = query
    .trim()
    .split(/\s+/)
    .filter((word) => word.length >= MIN_QUERY);

  if (words.length === 0) return text;

  const pattern = new RegExp(`(${words.map(escapeRegExp).join("|")})`, "ig");
  const parts = text.split(pattern);

  return parts.map((part, index) =>
    words.some((word) => part.toLowerCase() === word.toLowerCase()) ? (
      <mark key={index} className="bg-transparent font-semibold text-primary">
        {part}
      </mark>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

function SearchForm({
  className,
  defaultQuery = "",
  hidden,
}: SearchBarProps & {
  defaultQuery?: string;
  hidden?: Record<string, string>;
}) {
  const inputId = useId();
  const listId = useId();
  const router = useRouter();
  const rootRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(defaultQuery);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debouncedQuery = useDebouncedValue(query.trim(), 220);
  const canSuggest = debouncedQuery.length >= MIN_QUERY;

  const suggestions = useQuery({
    queryKey: ["navbar-product-suggest", debouncedQuery],
    queryFn: () => suggestProducts(debouncedQuery),
    enabled: open && canSuggest,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });

  const items = canSuggest ? (suggestions.data ?? []) : [];
  const showPanel = open && query.trim().length >= MIN_QUERY;
  const optionCount = items.length + 1;
  const activeId =
    activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined;

  useEffect(() => {
    if (!showPanel) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [showPanel]);

  function onQueryChange(value: string) {
    setQuery(value);
    setActiveIndex(-1);
    setOpen(value.trim().length >= MIN_QUERY);
  }

  function goToProduct(slug: string) {
    setOpen(false);
    setActiveIndex(-1);
    router.push(`/products/${slug}`);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!showPanel) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % optionCount);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) =>
        current <= 0 ? optionCount - 1 : current - 1,
      );
      return;
    }

    if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (
      event.key === "Enter" &&
      activeIndex >= 0 &&
      activeIndex < items.length
    ) {
      event.preventDefault();
      const product = items[activeIndex];
      if (product) goToProduct(product.slug);
    }
  }

  return (
    <form
      ref={rootRef}
      action="/products"
      className={cn("relative z-30", className)}
      role="search"
      onSubmit={() => {
        setOpen(false);
        setActiveIndex(-1);
      }}
    >
      {Object.entries(hidden ?? {}).map(([name, value]) =>
        value ? (
          <input key={name} type="hidden" name={name} value={value} />
        ) : null,
      )}
      <label htmlFor={inputId} className="sr-only">
        Search products and stores
      </label>
      <div className="flex h-11 overflow-hidden rounded-full border border-primary/35 bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25">
        <input
          ref={inputRef}
          id={inputId}
          name="q"
          type="search"
          value={query}
          autoComplete="off"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeId}
          placeholder="Search products, brands, or stores"
          className="min-w-0 flex-1 bg-transparent px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:hidden"
          onChange={(event) => onQueryChange(event.target.value)}
          onInput={(event) => onQueryChange(event.currentTarget.value)}
          onFocus={() => {
            if (query.trim().length >= MIN_QUERY) setOpen(true);
          }}
          onKeyDown={onKeyDown}
        />
        {query ? (
          <button
            type="button"
            aria-label="Clear search"
            className="mr-0.5 inline-flex size-8 shrink-0 items-center justify-center self-center rounded-full text-muted-foreground hover:bg-surface-muted hover:text-foreground"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              onQueryChange("");
              inputRef.current?.focus();
            }}
          >
            <X className="size-4" />
          </button>
        ) : null}
        <button
          type="submit"
          className="m-1 inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 font-display text-sm font-semibold text-[#fff4f2] transition-colors duration-500 hover:bg-ink hover:text-[#fff4f2]"
        >
          <Search className="size-4" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>

      {showPanel ? (
        <div className="absolute top-[calc(100%+0.45rem)] right-0 left-0 overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
          <ul
            id={listId}
            role="listbox"
            className="max-h-80 overflow-y-auto py-1"
          >
            {suggestions.isPending && items.length === 0 ? (
              <li className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Looking for products…
              </li>
            ) : null}

            {items.map((product, index) => {
              const image = mediaUrl(
                product.thumbnail?.url ?? product.images[0]?.url,
              );
              const price = product.offer.minPrice;
              const selected = index === activeIndex;

              return (
                <li key={product.id} role="presentation">
                  <Link
                    id={`${listId}-option-${index}`}
                    role="option"
                    aria-selected={selected}
                    href={`/products/${product.slug}`}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-left",
                      selected ? "bg-brand-soft" : "hover:bg-surface-muted",
                    )}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => {
                      setOpen(false);
                      setActiveIndex(-1);
                    }}
                  >
                    <span className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                      {image ? (
                        <MediaImage
                          src={image}
                          alt=""
                          sizes="44px"
                          className="object-cover"
                        />
                      ) : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-foreground">
                        <Highlight text={product.name} query={debouncedQuery} />
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {product.category.name}
                        {product.store.name ? ` · ${product.store.name}` : ""}
                      </span>
                    </span>
                    {price !== null ? (
                      <span className="shrink-0 text-sm font-semibold text-foreground">
                        {formatPrice(price)}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}

            {suggestions.isError ? (
              <li className="px-4 py-3 text-sm text-muted-foreground">
                Suggestions are unavailable right now.
              </li>
            ) : null}

            {!suggestions.isPending &&
            !suggestions.isError &&
            items.length === 0 ? (
              <li className="px-4 py-3 text-sm text-muted-foreground">
                No close matches. Search the full catalog instead.
              </li>
            ) : null}

            <li role="presentation">
              <button
                id={`${listId}-option-${items.length}`}
                type="submit"
                role="option"
                aria-selected={activeIndex === items.length}
                className={cn(
                  "flex w-full items-center gap-2 border-t border-border px-4 py-2.5 text-left text-sm",
                  activeIndex === items.length
                    ? "bg-brand-soft text-foreground"
                    : "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
                )}
                onMouseEnter={() => setActiveIndex(items.length)}
              >
                <Search className="size-4 shrink-0 text-primary" />
                <span className="truncate">
                  See all results for “{query.trim()}”
                </span>
              </button>
            </li>
          </ul>
        </div>
      ) : null}
    </form>
  );
}

function SearchBarWithQuery({ className }: SearchBarProps) {
  const searchParams = useSearchParams();
  const hidden = {
    collection: searchParams.get("collection") ?? "",
    category: searchParams.get("category") ?? "",
    subcategory: searchParams.get("subcategory") ?? "",
    sort: searchParams.get("sort") ?? "",
    price: searchParams.get("price") ?? "",
    rating: searchParams.get("rating") ?? "",
  };

  return (
    <SearchForm
      key={searchParams.get("q") ?? ""}
      className={className}
      defaultQuery={searchParams.get("q") ?? ""}
      hidden={hidden}
    />
  );
}

export function SearchBar({ className }: SearchBarProps) {
  return (
    <Suspense fallback={<SearchForm className={className} />}>
      <SearchBarWithQuery className={className} />
    </Suspense>
  );
}
