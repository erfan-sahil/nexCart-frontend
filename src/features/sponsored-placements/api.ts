import { serverGet } from "@/lib/api/server";
import type { PromoSlot } from "@/types";

export type SponsoredSection = "top-selling" | "new-arrivals";

export type SponsoredPromoDto = {
  slot: "1" | "2";
  section: SponsoredSection;
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
  const map: Partial<Record<SponsoredSection, PromoSlot>> = {};

  for (const placement of placements) {
    map[placement.section] = mapSponsoredPromo(placement);
  }

  return map;
}
