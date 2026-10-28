import { api } from "@/lib/api/client";
import type { ApiSuccess } from "@/lib/api/types";

import type { CatalogProduct } from "./types";

const LIMIT = 6;

async function fetchProducts(search: string) {
  const { data } = await api.get<ApiSuccess<CatalogProduct[]>>("/products", {
    params: { search, limit: LIMIT, page: 1, sort: "featured" },
  });

  return data.data ?? [];
}

function terms(query: string) {
  return [
    ...new Set(
      query
        .toLowerCase()
        .split(/\s+/)
        .filter((term) => term.length >= 2),
    ),
  ];
}

function score(product: CatalogProduct, query: string) {
  const name = product.name.toLowerCase();
  const q = query.trim().toLowerCase();
  const words = terms(query);
  let value = 40;

  if (name === q) value = 0;
  else if (name.startsWith(q)) value = 1;
  else if (name.includes(q)) value = 2;
  else if (words.length > 0 && words.every((word) => name.includes(word)))
    value = 3;
  else if (words.some((word) => name.startsWith(word))) value = 4;
  else if (words.some((word) => name.includes(word))) value = 6;
  else if (
    product.tags.some((tag) =>
      words.some((word) => tag.toLowerCase().includes(word)),
    )
  )
    value = 8;
  else if (product.shortDescription.toLowerCase().includes(q)) value = 10;

  if (product.isFeatured) value -= 0.25;
  if (product.offer.inStock) value -= 0.1;

  return value;
}

export async function suggestProducts(query: string) {
  const q = query.trim();
  if (q.length < 2) return [];

  const primary = await fetchProducts(q);
  const merged = new Map(primary.map((product) => [product.id, product]));

  if (merged.size < LIMIT) {
    const words = terms(q)
      .filter((word) => word !== q.toLowerCase())
      .sort((left, right) => right.length - left.length);

    for (const word of words.slice(0, 2)) {
      if (merged.size >= LIMIT) break;
      const extra = await fetchProducts(word);
      for (const product of extra) {
        if (!merged.has(product.id)) merged.set(product.id, product);
      }
    }
  }

  return [...merged.values()]
    .sort(
      (left, right) =>
        score(left, q) - score(right, q) || left.name.localeCompare(right.name),
    )
    .slice(0, LIMIT);
}
