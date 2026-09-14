import { Search } from "lucide-react";

export function SearchBar({ className }: { className?: string }) {
  return (
    <form action="/products" className={className} role="search">
      <label htmlFor="site-search" className="sr-only">
        Search products and stores
      </label>
      <div className="flex h-11 overflow-hidden rounded-full border border-border bg-surface-muted focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        <input
          id="site-search"
          name="q"
          type="search"
          placeholder="Search products, brands, or stores"
          className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground"
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
