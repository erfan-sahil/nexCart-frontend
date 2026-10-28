import { serverGet } from "@/lib/api/server";

export type StoreHero = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  isActive: boolean;
};

export type StoreHeroSection = {
  slides: StoreHero[];
};

export async function getHero() {
  try {
    const body = await serverGet<StoreHeroSection>("/hero");
    return body.data;
  } catch {
    return null;
  }
}
