export type ProductVariantOption = {
  id: string;
  label: string;
  value: string;
};

export type ProductVariantAttribute = {
  attributeId: string;
  name: string;
  slug: string;
  options: ProductVariantOption[];
};

export type SellableVariant = {
  id: string;
  sku: string;
  price: number;
  currentPrice: number;
  originalPrice?: number;
  stock: number;
  isDefault: boolean;
  /** Absolute URL of the product image linked to this variant. */
  image: string | null;
  attributes: ProductVariantAttribute[];
};

export type VariantAxis = {
  attributeId: string;
  name: string;
  slug: string;
  options: ProductVariantOption[];
};
