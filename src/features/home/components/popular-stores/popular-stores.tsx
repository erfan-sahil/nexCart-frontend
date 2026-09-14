import { Container, SectionHeader } from "@/components/common";
import { StoreCard } from "@/components/store";
import { stores } from "@/data/mock";

export function PopularStores() {
  return (
    <section className="bg-surface-muted py-12 sm:py-16">
      <Container>
        <SectionHeader
          eyebrow="Vendors"
          title="Popular stores"
          description="Independent shops with the strongest followings this week."
          href="/stores"
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
