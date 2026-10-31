import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getProductBySlug,
  getRelatedProducts,
  getStoreBySlug,
  toProduct,
  toProductDetail,
} from "@/features/catalog";
import { ProductDetailView } from "@/features/products/product-detail-view";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);

  if (!product) {
    return { title: "Product" };
  }

  return {
    title: product.name,
    description: product.shortDescription || product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);

  if (!product) {
    notFound();
  }

  const [related, store] = await Promise.all([
    getRelatedProducts(slug, 12).catch(() => []),
    getStoreBySlug(product.store.slug).catch(() => null),
  ]);

  return (
    <ProductDetailView
      product={toProductDetail(product, store)}
      related={related.map(toProduct)}
    />
  );
}
