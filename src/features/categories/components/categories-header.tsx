import { Container, PageBreadcrumb } from "@/components/common";
import { formatCount } from "@/lib/format";

type CategoriesHeaderProps = {
  departmentCount: number;
  aisleCount: number;
  productCount: number;
};

export function CategoriesHeader({
  departmentCount,
  aisleCount,
  productCount,
}: CategoriesHeaderProps) {
  return (
    <section className="border-b border-border bg-surface-muted">
      <Container className="py-8 sm:py-10">
        <PageBreadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Categories" }]}
        />
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              Shop the marketplace
            </p>
            <h1 className="mt-1.5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              All categories
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Jump into a department, then drill into an aisle — the same map
              shoppers use to find stores and deals fast.
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-6 sm:min-w-[20rem]">
            <div>
              <dt className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                Departments
              </dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums">
                {departmentCount}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                Aisles
              </dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums">
                {aisleCount}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                Products
              </dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums">
                {formatCount(productCount)}
              </dd>
            </div>
          </dl>
        </div>
      </Container>
    </section>
  );
}
