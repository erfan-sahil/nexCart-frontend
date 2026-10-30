import { Container } from "@/components/common";
import {
  getCatalogHome,
  getCategoryTree,
  toProduct,
  toStore,
} from "@/features/catalog";
import { toStorefrontCategories } from "@/features/categories/lib/map";

import { FeaturedCategories } from "./components/featured-categories";
import { FlashDeals } from "./components/flash-deals";
import { HeroBanner } from "./components/hero-banner";
import { NewArrivals } from "./components/new-arrivals";
import { PopularStores } from "./components/popular-stores";
import { RecentlyViewedSection } from "@/features/recently-viewed";
import { RecommendedForYou } from "./components/recommended-for-you";
import { TopSellingProducts } from "./components/top-selling-products";
import { TrendingProducts } from "./components/trending-products";
import { getHero } from "./get-hero";

export async function HomeView() {
  const [home, tree, hero] = await Promise.all([
    getCatalogHome().catch(() => null),
    getCategoryTree(),
    getHero(),
  ]);
  const categories = toStorefrontCategories(tree);
  const slides = (hero?.slides ?? []).filter((slide) => slide.isActive);

  return (
    <>
      {slides.length > 0 ? <HeroBanner slides={slides} /> : null}
      <FeaturedCategories categories={categories} />
      {home ? (
        <>
          <FlashDeals
            products={home.flashDeals.items.map(toProduct)}
            endsAt={home.flashDeals.endsAt}
          />
          <TopSellingProducts products={home.topSelling.items.map(toProduct)} />
          <PopularStores stores={home.popularStores.items.map(toStore)} />
          <TrendingProducts products={home.trending.items.map(toProduct)} />
          <RecommendedForYou />
          <RecentlyViewedSection />
          <NewArrivals products={home.newArrivals.items.map(toProduct)} />
        </>
      ) : (
        <Container className="py-16 text-center">
          <h2 className="text-2xl">Catalog unavailable</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Homepage products could not be loaded. Check that the API is
            running.
          </p>
        </Container>
      )}
    </>
  );
}
