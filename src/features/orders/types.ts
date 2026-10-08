export const TRACKING_STEPS = [
  { id: "placed", label: "Placed" },
  { id: "confirmed", label: "Confirmed" },
  { id: "shipped", label: "Shipped" },
  { id: "out_for_delivery", label: "On the way" },
  { id: "delivered", label: "Delivered" },
] as const;

export type TrackingStepId = (typeof TRACKING_STEPS)[number]["id"];

export type TrackingEvent = {
  id: string;
  title: string;
  detail: string;
  location: string;
  atLabel: string;
};

export type TrackedItem = {
  name: string;
  slug: string;
  image: string;
  quantity: number;
  price: number;
};

export type TrackedOrder = {
  id: string;
  email: string;
  status: TrackingStepId;
  eta: string;
  carrier: string;
  trackingNumber: string;
  shipTo: string;
  paymentLabel: string;
  events: TrackingEvent[];
  items: TrackedItem[];
};
