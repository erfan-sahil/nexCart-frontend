import type { Metadata } from "next";

import { CATALOG_PAGE_SIZE, listStores, toStore } from "@/features/catalog";
import { StoresView } from "@/features/stores";
import { ApiError } from "@/lib/api/errors";

export const metadata: Metadata = {
  title: "Stores",
  description:
    "Browse independent stores on NexCart and open a shop to see its images and products.",
};

type StoresPageProps = {
  searchParams: Promise<{ page?: string | string[] }>;
};

function parsePage(value: string | string[] | undefined) {
  const raw = Number(Array.isArray(value) ? value[0] : value);
  if (!Number.isInteger(raw) || raw < 1) return 1;
  return raw;
}

export default async function StoresPage({ searchParams }: StoresPageProps) {
  const page = parsePage((await searchParams).page);
  let stores: ReturnType<typeof toStore>[] = [];
  let currentPage = 1;
  let total = 0;
  let totalPages = 0;
  let notice: string | undefined;

  try {
    const result = await listStores({
      page,
      limit: CATALOG_PAGE_SIZE,
      sort: "popular",
    });
    stores = result.items.map(toStore);
    currentPage = result.pagination.page;
    total = result.pagination.total;
    totalPages = result.pagination.totalPages;
  } catch (error) {
    notice =
      error instanceof ApiError
        ? error.message
        : "Stores could not be loaded. Check that the API is running.";
  }

  return (
    <StoresView
      stores={stores}
      page={currentPage}
      total={total}
      totalPages={totalPages}
      notice={notice}
    />
  );
}
