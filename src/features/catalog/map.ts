import { formatCount } from "@/lib/format";
import { mediaUrl } from "@/lib/media";
import type {
  Product,
  ProductDetail,
  ProductSpecification,
  Store,
} from "@/types";

import type {
  CatalogAttribute,
  CatalogProduct,
  CatalogStore,
  CatalogStoreAddress,
  CatalogStoreDetail,
} from "./types";

function attributeValue(attribute: CatalogAttribute) {
  if (attribute.options.length > 0) {
    return attribute.options.map((option) => option.label).join(", ");
  }

  if (attribute.text) {
    return attribute.unit
      ? `${attribute.text} ${attribute.unit}`
      : attribute.text;
  }

  if (attribute.number !== null) {
    return attribute.unit
      ? `${attribute.number} ${attribute.unit}`
      : String(attribute.number);
  }

  if (attribute.boolean !== null) {
    return attribute.boolean ? "Yes" : "No";
  }

  return "";
}

export function toProduct(dto: CatalogProduct): Product {
  const price = dto.offer.minPrice ?? 0;
  const original = dto.offer.minOriginalPrice;
  const image = mediaUrl(dto.thumbnail?.url ?? dto.images[0]?.url);

  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    price,
    originalPrice: original && original > price ? original : undefined,
    rating: dto.ratingSummary.average,
    reviewCount: dto.ratingSummary.count,
    image,
    store: {
      id: dto.store.id,
      name: dto.store.name,
      slug: dto.store.slug,
      logo: "",
      verified: false,
    },
    badge: dto.isFeatured ? "Featured" : undefined,
    categorySlug: dto.category.slug,
    categoryName: dto.category.name,
    subcategorySlug: "",
    listedAt: dto.publishedAt ?? dto.createdAt,
    inStock: dto.offer.inStock,
    defaultVariantId: dto.offer.defaultVariantId,
  };
}

export function toProductDetail(
  dto: CatalogProduct,
  store?: CatalogStore | null,
): ProductDetail {
  const product = toProduct(dto);
  const images = dto.images
    .slice()
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((image) => mediaUrl(image.url))
    .filter(Boolean);

  if (store) {
    product.store.logo = mediaUrl(store.logo);
  }

  const specifications: ProductSpecification[] = dto.attributes
    .filter((attribute) => attribute.role === "spec")
    .map((attribute) => ({
      label: attribute.name,
      value: attributeValue(attribute),
    }))
    .filter((item) => item.value);

  return {
    ...product,
    description: dto.description || dto.shortDescription,
    images: images.length > 0 ? images : product.image ? [product.image] : [],
    specifications,
  };
}

export function toStore(dto: CatalogStore): Store {
  const logo = mediaUrl(dto.logo);

  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    logo,
    cover: mediaUrl(dto.banner) || logo,
    verified: false,
    rating: dto.rating.average,
    productCount: dto.totalProducts,
    followers: formatCount(dto.totalOrders),
  };
}

function formatStoreAddress(address: CatalogStoreAddress) {
  return [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(", ");
}

export type StoreProfile = {
  id: string;
  slug: string;
  name: string;
  logo: string;
  banner: string;
  description: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  orderCount: number;
  joinedAt: string;
  email: string;
  phone: string;
  address: string;
  returnPolicy: string;
  shippingPolicy: string;
};

export function toStoreProfile(dto: CatalogStoreDetail): StoreProfile {
  const summary = toStore(dto);

  return {
    id: summary.id,
    slug: summary.slug,
    name: summary.name,
    logo: summary.logo,
    banner: mediaUrl(dto.banner),
    description: dto.description.trim(),
    rating: summary.rating,
    reviewCount: dto.rating.count,
    productCount: summary.productCount,
    orderCount: dto.totalOrders,
    joinedAt: dto.joinedAt,
    email: dto.contact.email.trim(),
    phone: dto.contact.phone.trim(),
    address: formatStoreAddress(dto.address),
    returnPolicy: dto.returnPolicy.trim(),
    shippingPolicy: dto.shippingPolicy.trim(),
  };
}
