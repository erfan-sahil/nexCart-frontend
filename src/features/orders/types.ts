import type { CustomerTimelineStep, OrderStatus } from "./api";

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
  status: OrderStatus;
  carrier: string;
  trackingNumber: string;
  shipTo: string;
  paymentLabel: string;
  total?: number;
  timeline: CustomerTimelineStep[];
  events: TrackingEvent[];
  items: TrackedItem[];
};
