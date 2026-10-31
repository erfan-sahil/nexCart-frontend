import { Container } from "@/components/common";
import { getFeaturedCategories } from "@/features/categories/api";
import {
  getCatalogHome,
  getCategoryTree,
  toProduct,
  toStore,
} from "@/features/catalog";

import { FeaturedCategories } from "./components/featured-categories";
import { FlashDeals } from "./components/flash-deals";
import { HeroBanner } from "./components/hero-banner";
import { NewArrivals } from "./components/new-arrivals";
import { PopularStores } from "./components/popular-stores";
import { RecentlyViewedSection } from "@/features/recently-viewed";
import { RecommendedSection } from "@/features/recommendations";
import { TopSellingProducts } from "./components/top-selling-products";
import { TrendingProducts } from "./components/trending-products";
import { getHero } from "./get-hero";

export async function HomeView() {
  const [home, featuredCategories, hero] = await Promise.all([
    getCatalogHome().catch(() => null),
    getFeaturedCategories(),
    getHero(),
  ]);
  const slides = (hero?.slides ?? []).filter((slide) => slide.isActive);

  return (
    <>
      {slides.length > 0 ? <HeroBanner slides={slides} /> : null}
      {featuredCategories.length > 0 ? (
        <FeaturedCategories categories={featuredCategories} />
      ) : null}
      {home ? (
        <>
          <FlashDeals
            products={home.flashDeals.items.map(toProduct)}
            endsAt={home.flashDeals.endsAt}
          />
          <TopSellingProducts products={home.topSelling.items.map(toProduct)} />
          <PopularStores stores={home.popularStores.items.map(toStore)} />
          <TrendingProducts products={home.trending.items.map(toProduct)} />
          <RecommendedSection />
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
