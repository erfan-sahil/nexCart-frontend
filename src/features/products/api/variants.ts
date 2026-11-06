import { api } from "@/lib/api/client";
import type { ApiSuccess, PaginationMeta } from "@/lib/api/types";

import type { SellableVariant } from "../types/variant";

type VariantDto = {
  id: string;
  sku: string;
  price: number;
  discountType: "percent" | "amount" | null;
  discountValue: number | null;
  currentPrice: number;
  stock: number;
  isDefault: boolean;
  attributes: {
    attributeId: string;
    name: string;
    slug: string;
    role: string;
    options: { id: string; label: string; value: string }[];
  }[];
};

function toSellableVariant(dto: VariantDto): SellableVariant {
  const originalPrice = dto.currentPrice < dto.price ? dto.price : undefined;

  return {
    id: dto.id,
    sku: dto.sku,
    price: dto.currentPrice,
    currentPrice: dto.currentPrice,
    originalPrice,
    stock: dto.stock,
    isDefault: dto.isDefault,
    attributes: dto.attributes
      .filter((attribute) => attribute.role === "variant")
      .map((attribute) => ({
        attributeId: attribute.attributeId,
        name: attribute.name,
        slug: attribute.slug,
        options: attribute.options,
      })),
  };
}

export async function listProductVariants(productId: string, limit = 40) {
  const { data } = await api.get<ApiSuccess<VariantDto[]>>(
    `/products/${productId}/variants`,
    { params: { page: 1, limit, sort: "sku" } },
  );

  const pagination = data.meta?.pagination as PaginationMeta | undefined;

  return {
    items: data.data.map(toSellableVariant),
    total: pagination?.total ?? data.data.length,
  };
}
