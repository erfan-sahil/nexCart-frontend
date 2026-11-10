import { Check } from "@/lib/icons";

type ProductFeaturesProps = {
  features: string[];
};

export function ProductFeatures({ features }: ProductFeaturesProps) {
  if (features.length === 0) return null;

  return (
    <section className="mt-5">
      <h2 className="text-sm font-semibold">Specifications</h2>
      <ul className="mt-2 overflow-hidden rounded-2xl border border-border">
        {features.map((feature, index) => (
          <li
            key={`${index}-${feature}`}
            className="flex items-start gap-2.5 border-b border-border bg-card px-3.5 py-2.5 text-sm last:border-b-0 sm:px-4"
          >
            <Check
              className="mt-0.5 size-4 shrink-0 text-primary"
              aria-hidden
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
