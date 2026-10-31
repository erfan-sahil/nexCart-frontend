export const CATALOG_COLLECTIONS = [
  "flash-deals",
  "bestsellers",
  "trending",
  "new-arrivals",
] as const;

export type CatalogCollection = (typeof CATALOG_COLLECTIONS)[number];

export type CatalogSort =
  "newest" | "bestsellers" | "price-asc" | "price-desc" | "rating" | "featured";

export type CatalogProductImage = {
  id: string;
  url: string;
  alt: string;
  sortOrder: number;
};

export type CatalogAttribute = {
  name: string;
  role: string;
  unit: string;
  text: string | null;
  number: number | null;
  boolean: boolean | null;
  options: { id: string; label: string; value: string }[];
};

export type CatalogRef = {
  id: string;
  name: string;
  slug: string;
};

export type CatalogProduct = {
  id: string;
  storeId: string;
  categoryId: string;
  store: CatalogRef;
  category: CatalogRef;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  images: CatalogProductImage[];
  thumbnail: CatalogProductImage | null;
  attributes: CatalogAttribute[];
  offer: {
    minPrice: number | null;
    maxPrice: number | null;
    minOriginalPrice: number | null;
    maxOriginalPrice: number | null;
    inStock: boolean;
    variantCount: number;
    defaultVariantId: string | null;
  };
  tags: string[];
  isFeatured: boolean;
  publishedAt: string | null;
  ratingSummary: {
    average: number;
    count: number;
  };
  createdAt: string;
};

export type CatalogStore = {
  id: string;
  slug: string;
  name: string;
  logo: string;
  banner?: string;
  rating: {
    average: number;
    count: number;
  };
  totalProducts: number;
  totalOrders: number;
  totalSales: number;
};

export type CatalogStoreAddress = {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type CatalogStoreDetail = CatalogStore & {
  banner: string;
  description: string;
  joinedAt: string;
  contact: {
    email: string;
    phone: string;
  };
  address: CatalogStoreAddress;
  categories: CatalogRef[];
  returnPolicy: string;
  shippingPolicy: string;
};

export type CatalogHome = {
  flashDeals: {
    endsAt: string | null;
    items: CatalogProduct[];
  };
  topSelling: { items: CatalogProduct[] };
  popularStores: { items: CatalogStore[] };
  trending: { items: CatalogProduct[] };
  newArrivals: { items: CatalogProduct[] };
};

export type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  level: number;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
  children: CategoryNode[];
};
