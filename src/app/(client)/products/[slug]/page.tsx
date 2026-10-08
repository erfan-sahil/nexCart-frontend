import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { products } from "@/data/mock";
import { ProductDetailView } from "@/features/products/product-detail-view";
import { getProductDetail } from "@/features/products/lib/detail";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductDetail(slug);

  if (!product) {
    return { title: "Product" };
  }

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductDetail(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
