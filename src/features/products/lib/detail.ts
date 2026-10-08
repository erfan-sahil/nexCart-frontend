import { getCategoryBySlug, getProductBySlug, products } from "@/data/mock";
import { productDetails } from "@/data/mock/product-details";
import type { Product, ProductDetail, ProductReview } from "@/types";

function withReviewIds(
  slug: string,
  reviews: {
    author: string;
    rating: number;
    createdAt: string;
    comment: string;
  }[],
): ProductReview[] {
  return reviews.map((review, index) => ({
    ...review,
    id: `${slug}-${index + 1}`,
  }));
}

export function getProductDetail(slug: string): ProductDetail | undefined {
  const product = getProductBySlug(slug);
  if (!product) return undefined;

  const extra = productDetails[slug];
  const description =
    extra?.description ?? `${product.name} from ${product.store.name}.`;
  const images = [product.image, ...(extra?.images ?? [])].filter(
    (src, index, all) => all.indexOf(src) === index,
  );

  return {
    ...product,
    description,
    images,
    specifications: extra?.specifications ?? [
      { label: "Seller", value: product.store.name },
      { label: "Condition", value: "New" },
    ],
    reviews: withReviewIds(slug, extra?.reviews ?? []),
  };
}

export function getRelatedProducts(product: Product, limit = 4) {
  const sameCategory = products.filter(
    (item) =>
      item.id !== product.id && item.categorySlug === product.categorySlug,
  );
  const sameStore = products.filter(
    (item) =>
      item.id !== product.id &&
      item.store.id === product.store.id &&
      !sameCategory.some((related) => related.id === item.id),
  );

  return [...sameCategory, ...sameStore].slice(0, limit);
}

export function getProductCategoryLabel(product: Product) {
  const category = getCategoryBySlug(product.categorySlug);
  const subcategory = category?.subcategories.find(
    (item) => item.slug === product.subcategorySlug,
  );

  return { category, subcategory };
}
