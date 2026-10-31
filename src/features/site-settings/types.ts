export type SiteSettings = {
  deliveryFee: number;
  freeDeliveryEnabled: boolean;
  freeDeliveryMinAmount: number;
  currency: string;
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  deliveryFee: 100,
  freeDeliveryEnabled: false,
  freeDeliveryMinAmount: 0,
  currency: "BDT",
};
