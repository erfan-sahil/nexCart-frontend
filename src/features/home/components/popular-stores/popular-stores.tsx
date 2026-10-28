import { Container, SectionHeader } from "@/components/common";
import { StoreCard } from "@/components/store";
import type { Store } from "@/types";

type PopularStoresProps = {
  stores: Store[];
};

export function PopularStores({ stores }: PopularStoresProps) {
  if (stores.length === 0) return null;

  return (
    <section className="bg-surface-muted py-12 sm:py-16">
      <Container>
        <SectionHeader
          eyebrow="Vendors"
          title="Popular stores"
          description="Independent shops with the strongest sales right now."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </Container>
    </section>
  );
}
