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
  categorySlug: string;
  subcategorySlug: string;
  listedAt: string;
};

export type ProductSpecification = {
  label: string;
  value: string;
};

export type ProductReview = {
  id: string;
  author: string;
  rating: number;
  createdAt: string;
  comment: string;
};

export type ProductDetail = Product & {
  description: string;
  images: string[];
  specifications: ProductSpecification[];
  reviews: ProductReview[];
};

export type Subcategory = {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
  popular?: boolean;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
  description: string;
  subcategories: Subcategory[];
};

export type PopularAisle = Subcategory & {
  categorySlug: string;
  categoryName: string;
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

export type PromoSlot = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  href: string;
  image: string;
  productName: string;
  price: number;
  originalPrice?: number;
};
