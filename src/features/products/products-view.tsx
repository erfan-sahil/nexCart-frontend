import { Container } from "@/components/common";
import { ProductGrid } from "@/components/product";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCount } from "@/lib/format";
import type { Product } from "@/types";

import {
  ProductsEmpty,
  ProductsFilters,
  ProductsHeader,
  ProductsMobileFilters,
  ProductsPagination,
  ProductsSearch,
  ProductsSort,
  SubcategoryChips,
} from "./components";
import {
  getProductPageCopy,
  type FilterCategory,
  type ProductQuery,
} from "./lib/query";

type ProductsViewProps = {
  query: ProductQuery;
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  categories: FilterCategory[];
  category?: FilterCategory | null;
  notice?: string;
};

export function ProductsView({
  query,
  products,
  total,
  page,
  totalPages,
  categories,
  category,
  notice,
}: ProductsViewProps) {
  const copy = getProductPageCopy(query, category);

  return (
    <>
      <ProductsHeader
        query={query}
        copy={copy}
        category={category}
        total={total}
      />
      <Container className="py-8 sm:py-10">
        <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start lg:gap-10">
          <aside className="sticky top-36 hidden lg:block">
            <ScrollArea className="max-h-[calc(100vh-10rem)] rounded-2xl border border-border bg-card">
              <div className="p-3">
                <ProductsFilters query={query} categories={categories} />
              </div>
            </ScrollArea>
          </aside>

          <div className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <ProductsSearch query={query} />
              <ProductsSort query={query} />
            </div>
            <ProductsMobileFilters query={query} categories={categories} />
            <SubcategoryChips query={query} category={category} />
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {formatCount(products.length)}
              </span>
              {total > products.length ? (
                <>
                  {" "}
                  of{" "}
                  <span className="font-medium text-foreground">
                    {formatCount(total)}
                  </span>
                </>
              ) : null}{" "}
              {total === 1 ? "item" : "items"}
            </p>
            {notice ? (
              <ProductsEmpty message={notice} />
            ) : products.length > 0 ? (
              <ProductGrid products={products} columns="catalog" />
            ) : (
              <ProductsEmpty
                queryLabel={query.q ? `“${query.q}”` : undefined}
              />
            )}
            <ProductsPagination
              query={query}
              page={page}
              totalPages={totalPages}
            />
          </div>
        </div>
      </Container>
    </>
  );
}
