export type StoreSummary = {
  id: string;
  name: string;
  slug: string;
  logo: string;
  verified: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  store: StoreSummary;
  badge?: string;
  sold?: number;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
};

export type Store = StoreSummary & {
  cover: string;
  rating: number;
  productCount: number;
  followers: string;
};

export type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  href: string;
  image: string;
};
