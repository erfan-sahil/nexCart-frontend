import { FeaturedCategories } from "./components/featured-categories";
import { FlashDeals } from "./components/flash-deals";
import { HeroBanner } from "./components/hero-banner";
import { NewArrivals } from "./components/new-arrivals";
import { PopularStores } from "./components/popular-stores";
import { RecentlyViewed } from "./components/recently-viewed";
import { RecommendedForYou } from "./components/recommended-for-you";
import { TopSellingProducts } from "./components/top-selling-products";
import { TrendingProducts } from "./components/trending-products";

export function HomeView() {
  return (
    <>
      <HeroBanner />
      <FeaturedCategories />
      <FlashDeals />
      <TopSellingProducts />
      <PopularStores />
      <TrendingProducts />
      <RecommendedForYou />
      <RecentlyViewed />
      <NewArrivals />
    </>
  );
}
