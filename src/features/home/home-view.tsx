import { Container } from "@/components/common";
import { getFeaturedCategories } from "@/features/categories/api";
import { getCatalogHome, toProduct, toStore } from "@/features/catalog";
import {
  getSponsoredPlacements,
  promosBySection,
} from "@/features/sponsored-placements/api";

import { FeaturedCategories } from "./components/featured-categories";
import { HomeFlashDeals } from "./components/flash-deals/home-flash-deals";
import { HeroBanner } from "./components/hero-banner";
import { NewArrivals } from "./components/new-arrivals";
import { PopularStores } from "./components/popular-stores";
import { RecentlyViewedSection } from "@/features/recently-viewed";
import { RecommendedSection } from "@/features/recommendations";
import { TopSellingProducts } from "./components/top-selling-products";
import { TrendingProducts } from "./components/trending-products";
import { getHero } from "./get-hero";

export async function HomeView() {
  const [home, featuredCategories, hero, sponsored] = await Promise.all([
    getCatalogHome().catch(() => null),
    getFeaturedCategories(),
    getHero(),
    getSponsoredPlacements(),
  ]);
  const promos = promosBySection(sponsored);
  const slides = (hero?.slides ?? []).filter((slide) => slide.isActive);

  return (
    <>
      {slides.length > 0 ? <HeroBanner slides={slides} /> : null}
      {featuredCategories.length > 0 ? (
        <FeaturedCategories categories={featuredCategories} />
      ) : null}
      {home ? (
        <>
          <HomeFlashDeals
            products={home.flashDeals.items.map(toProduct)}
            endsAt={home.flashDeals.endsAt}
            title={home.flashDeals.sectionTitle}
          />
          <TopSellingProducts
            products={home.topSelling.items.map(toProduct)}
            promo={promos["top-selling"]}
          />
          <PopularStores stores={home.popularStores.items.map(toStore)} />
          <TrendingProducts products={home.trending.items.map(toProduct)} />
          <RecommendedSection />
          <RecentlyViewedSection />
          <NewArrivals
            products={home.newArrivals.items.map(toProduct)}
            promo={promos["new-arrivals"]}
          />
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
