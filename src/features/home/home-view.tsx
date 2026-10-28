import { Container } from "@/components/common";
import { getCatalogHome, toProduct, toStore } from "@/features/catalog";

import { FeaturedCategories } from "./components/featured-categories";
import { FlashDeals } from "./components/flash-deals";
import { HeroBanner } from "./components/hero-banner";
import { NewArrivals } from "./components/new-arrivals";
import { PopularStores } from "./components/popular-stores";
import { RecentlyViewed } from "./components/recently-viewed";
import { RecommendedForYou } from "./components/recommended-for-you";
import { TopSellingProducts } from "./components/top-selling-products";
import { TrendingProducts } from "./components/trending-products";

export async function HomeView() {
  const home = await getCatalogHome().catch(() => null);

  return (
    <>
      <HeroBanner />
      <FeaturedCategories />
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
          <RecentlyViewed />
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
