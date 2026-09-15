"use client";

import { Suspense, useId } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

type SearchBarProps = {
  className?: string;
};

function SearchForm({
  className,
  defaultQuery = "",
}: SearchBarProps & { defaultQuery?: string }) {
  const inputId = useId();

  return (
    <form action="/products" className={className} role="search">
      <label htmlFor={inputId} className="sr-only">
        Search products and stores
      </label>
      <div className="flex h-11 overflow-hidden rounded-full border border-border bg-surface-muted focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        <input
          id={inputId}
          key={defaultQuery}
          name="q"
          type="search"
          defaultValue={defaultQuery}
          placeholder="Search products, brands, or stores"
          className="min-w-0 flex-1 bg-transparent px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="m-1 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-brand-hover"
        >
          <Search className="size-4" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>
    </form>
  );
}

function SearchBarWithQuery({ className }: SearchBarProps) {
  const searchParams = useSearchParams();

  return (
    <SearchForm
      className={className}
      defaultQuery={searchParams.get("q") ?? ""}
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
