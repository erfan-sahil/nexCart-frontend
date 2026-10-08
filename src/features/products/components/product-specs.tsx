import type { ProductSpecification } from "@/types";

type ProductSpecsProps = {
  specifications: ProductSpecification[];
};

export function ProductSpecs({ specifications }: ProductSpecsProps) {
  if (specifications.length === 0) return null;

  return (
    <section className="mt-5">
      <h2 className="text-sm font-semibold">Specifications</h2>
      <dl className="mt-2 grid gap-px overflow-hidden rounded-2xl border border-border bg-border">
        {specifications.map((item) => (
          <div
            key={item.label}
            className="grid grid-cols-[7.25rem_minmax(0,1fr)] items-baseline gap-3 bg-card px-3.5 py-2.5 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:px-4"
          >
            <dt className="text-sm text-muted-foreground">{item.label}</dt>
            <dd className="text-sm font-medium">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
