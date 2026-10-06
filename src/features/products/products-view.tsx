import { Container } from "@/components/common";
import { ProductGrid } from "@/components/product";
import { formatCount } from "@/lib/format";

import {
  ProductsEmpty,
  ProductsFilters,
  ProductsHeader,
  ProductsMobileFilters,
  ProductsSort,
  SubcategoryChips,
} from "./components";
import { queryProducts } from "./lib/catalog";
import { getProductPageCopy, type ProductQuery } from "./lib/query";

type ProductsViewProps = {
  query: ProductQuery;
};

export function ProductsView({ query }: ProductsViewProps) {
  const products = queryProducts(query);
  const copy = getProductPageCopy(query);

  return (
    <>
      <ProductsHeader query={query} copy={copy} resultCount={products.length} />
      <Container className="py-8 sm:py-10">
        <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start lg:gap-10">
          <aside className="sticky top-36 hidden max-h-[calc(100vh-10rem)] overflow-y-auto rounded-2xl border border-border bg-card p-3 lg:block">
            <ProductsFilters query={query} />
          </aside>

          <div className="space-y-5">
            <ProductsMobileFilters query={query} />
            <SubcategoryChips query={query} />
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {formatCount(products.length)}
                </span>{" "}
                {products.length === 1 ? "item" : "items"}
              </p>
              <ProductsSort query={query} />
            </div>
            {products.length > 0 ? (
              <ProductGrid products={products} columns="catalog" />
            ) : (
              <ProductsEmpty
                queryLabel={query.q ? `“${query.q}”` : undefined}
              />
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
