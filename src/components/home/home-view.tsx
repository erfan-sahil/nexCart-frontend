import { FeaturedCategories } from "@/components/home/featured-categories";
import { FlashDeals } from "@/components/home/flash-deals";
import { HeroBanner } from "@/components/home/hero-banner";
import { NewArrivals } from "@/components/home/new-arrivals";
import { PopularStores } from "@/components/home/popular-stores";
import { RecentlyViewed } from "@/components/home/recently-viewed";
import { RecommendedForYou } from "@/components/home/recommended-for-you";
import { TopSellingProducts } from "@/components/home/top-selling-products";
import { TrendingProducts } from "@/components/home/trending-products";

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
