import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getStoreBySlug,
  listProducts,
  toProduct,
  toStoreProfile,
} from "@/features/catalog";
import { StoreView } from "@/features/stores";
import { ApiError } from "@/lib/api/errors";
import type { Product } from "@/types";

type StorePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
};

const STORE_PRODUCT_PAGE_SIZE = 10;

function parsePage(value: string | string[] | undefined) {
  const raw = Number(Array.isArray(value) ? value[0] : value);
  if (!Number.isInteger(raw) || raw < 1) return 1;
  return raw;
}

export async function generateMetadata({
  params,
}: StorePageProps): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStoreBySlug(slug).catch(() => null);

  if (!store) {
    return { title: "Store" };
  }

  return {
    title: store.name,
    description: store.description || `Shop ${store.name} on NexCart.`,
  };
}

export default async function StorePage({
  params,
  searchParams,
}: StorePageProps) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug).catch(() => null);

  if (!store) {
    notFound();
  }

  const profile = toStoreProfile(store);
  const page = parsePage((await searchParams).page);
  let products: Product[] = [];
  let currentPage = 1;
  let total = 0;
  let totalPages = 0;
  let notice: string | undefined;

  try {
    const listing = await listProducts({
      storeId: store.id,
      page,
      limit: STORE_PRODUCT_PAGE_SIZE,
      sort: "featured",
    });
    products = listing.items.map((item) => {
      const product = toProduct(item);
      return {
        ...product,
        store: {
          ...product.store,
          name: profile.name,
          slug: profile.slug,
          logo: profile.logo,
        },
      };
    });
    currentPage = listing.pagination.page;
    total = listing.pagination.total;
    totalPages = listing.pagination.totalPages;
  } catch (error) {
    notice =
      error instanceof ApiError
        ? error.message
        : "This store's products could not be loaded.";
  }

  return (
    <StoreView
      store={profile}
      products={products}
      page={currentPage}
      total={total}
      totalPages={totalPages}
      notice={notice}
    />
  );
}
