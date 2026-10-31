import { serverGet } from "@/lib/api/server";
import type { PromoSlot } from "@/types";

export type SponsoredPromoDto = {
  slot: "1" | "2";
  section: "top-selling" | "trending" | "new-arrivals";
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  href: string;
  image: string;
  productName: string;
  price: number;
  originalPrice?: number;
};

export function mapSponsoredPromo(dto: SponsoredPromoDto): PromoSlot {
  return {
    id: `sponsored-${dto.slot}`,
    eyebrow: dto.eyebrow,
    title: dto.title,
    subtitle: dto.subtitle,
    ctaLabel: dto.ctaLabel,
    href: dto.href,
    image: dto.image,
    productName: dto.productName,
    price: dto.price,
    originalPrice: dto.originalPrice,
  };
}

export async function getSponsoredPlacements() {
  try {
    const body = await serverGet<SponsoredPromoDto[]>("/sponsored-placements");
    return body.data ?? [];
  } catch {
    return [];
  }
}

export function promosBySection(placements: SponsoredPromoDto[]) {
  const map: Partial<
    Record<"top-selling" | "trending" | "new-arrivals", PromoSlot>
  > = {};

  for (const placement of placements) {
    map[placement.section] = mapSponsoredPromo(placement);
  }

  return map;
}
