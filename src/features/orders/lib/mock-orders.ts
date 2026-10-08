import type { TrackedOrder, TrackingStepId } from "../types";

export const STATUS_COPY: Record<
  TrackingStepId,
  { label: string; summary: string }
> = {
  placed: {
    label: "Order placed",
    summary: "We received the order and are getting it ready.",
  },
  confirmed: {
    label: "Preparing to ship",
    summary: "The seller is packing these items.",
  },
  shipped: {
    label: "In transit",
    summary: "The package left the seller and is moving toward you.",
  },
  out_for_delivery: {
    label: "Out for delivery",
    summary: "The courier has the package and is on the way.",
  },
  delivered: {
    label: "Delivered",
    summary: "The package was left at the delivery address.",
  },
};

export const SAMPLE_ORDERS: TrackedOrder[] = [
  {
    id: "NX-48291",
    email: "aisha@example.com",
    status: "out_for_delivery",
    eta: "Today, 2:00–6:00 PM",
    carrier: "Pathao",
    trackingNumber: "PTH-9044182",
    shipTo: "12 Road 7, Dhanmondi, Dhaka",
    paymentLabel: "bKash",
    items: [
      {
        name: "Pulse ANC Wireless Headphones",
        slug: "pulse-anc-headphones",
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
        quantity: 1,
        price: 129,
      },
      {
        name: "Aero Run Knit Sneakers",
        slug: "aero-run-sneakers",
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80",
        quantity: 1,
        price: 89,
      },
    ],
    events: [
      {
        id: "e5",
        title: "Out for delivery",
        detail: "Courier is heading to Dhanmondi.",
        location: "Dhaka",
        atLabel: "Oct 8, 9:14 AM",
      },
      {
        id: "e4",
        title: "Arrived at local hub",
        detail: "Sorted at the Dhaka North facility.",
        location: "Dhaka",
        atLabel: "Oct 7, 10:40 PM",
      },
      {
        id: "e3",
        title: "Shipped",
        detail: "Handed to Pathao from the seller warehouse.",
        location: "Gazipur",
        atLabel: "Oct 6, 3:05 PM",
      },
      {
        id: "e2",
        title: "Confirmed",
        detail: "Pixelab packed both items.",
        location: "Gazipur",
        atLabel: "Oct 5, 8:12 PM",
      },
      {
        id: "e1",
        title: "Order placed",
        detail: "Payment confirmed.",
        location: "NexCart",
        atLabel: "Oct 5, 2:20 PM",
      },
    ],
  },
  {
    id: "NX-39014",
    email: "jordan@example.com",
    status: "shipped",
    eta: "Friday, Oct 10",
    carrier: "RedX",
    trackingNumber: "RDX-221908",
    shipTo: "88 Gulshan Avenue, Dhaka",
    paymentLabel: "Cash on delivery",
    items: [
      {
        name: "Nova Sport Smartwatch",
        slug: "nova-smartwatch",
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80",
        quantity: 1,
        price: 179,
      },
    ],
    events: [
      {
        id: "e3",
        title: "In transit",
        detail: "Departed the sorting center toward Dhaka.",
        location: "Narayanganj",
        atLabel: "Oct 7, 5:30 PM",
      },
      {
        id: "e2",
        title: "Shipped",
        detail: "RedX scanned the parcel at pickup.",
        location: "Uttara",
        atLabel: "Oct 6, 12:48 PM",
      },
      {
        id: "e1",
        title: "Order placed",
        detail: "Cash on delivery selected at checkout.",
        location: "NexCart",
        atLabel: "Oct 6, 12:02 AM",
      },
    ],
  },
  {
    id: "NX-11820",
    email: "mina@example.com",
    status: "delivered",
    eta: "Delivered Oct 6",
    carrier: "Steadfast",
    trackingNumber: "STF-771204",
    shipTo: "4 Agrabad C/A, Chattogram",
    paymentLabel: "bKash",
    items: [
      {
        name: "Washed Linen Throw Set",
        slug: "linen-throw-set",
        image:
          "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80",
        quantity: 1,
        price: 64,
      },
    ],
    events: [
      {
        id: "e4",
        title: "Delivered",
        detail: "Left with the front desk.",
        location: "Chattogram",
        atLabel: "Oct 6, 3:22 PM",
      },
      {
        id: "e3",
        title: "Out for delivery",
        detail: "Courier started the Agrabad route.",
        location: "Chattogram",
        atLabel: "Oct 6, 8:10 AM",
      },
      {
        id: "e2",
        title: "Shipped",
        detail: "Steadfast collected the parcel.",
        location: "Dhaka",
        atLabel: "Oct 4, 6:40 PM",
      },
      {
        id: "e1",
        title: "Order placed",
        detail: "Payment confirmed.",
        location: "NexCart",
        atLabel: "Oct 3, 9:05 PM",
      },
    ],
  },
  {
    id: "NX-55102",
    email: "aisha@example.com",
    status: "confirmed",
    eta: "Arriving Oct 12",
    carrier: "Pathao",
    trackingNumber: "PTH-118330",
    shipTo: "12 Road 7, Dhanmondi, Dhaka",
    paymentLabel: "bKash",
    items: [
      {
        name: "Carbon Low-Profile Keyboard",
        slug: "carbon-keyboard",
        image:
          "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=400&q=80",
        quantity: 1,
        price: 149,
      },
    ],
    events: [
      {
        id: "e2",
        title: "Confirmed",
        detail: "Pixelab is packing the keyboard.",
        location: "Gazipur",
        atLabel: "Oct 7, 6:15 PM",
      },
      {
        id: "e1",
        title: "Order placed",
        detail: "Payment confirmed.",
        location: "NexCart",
        atLabel: "Oct 7, 11:40 AM",
      },
    ],
  },
];

export type LookupResult =
  | { kind: "found"; order: TrackedOrder }
  | { kind: "missing" }
  | { kind: "mismatch" };

export function lookupOrder(orderId: string, email: string): LookupResult {
  const order = SAMPLE_ORDERS.find(
    (item) => item.id.toLowerCase() === orderId.trim().toLowerCase(),
  );

  if (!order) return { kind: "missing" };

  if (order.email.toLowerCase() !== email.trim().toLowerCase()) {
    return { kind: "mismatch" };
  }

  return { kind: "found", order };
}
