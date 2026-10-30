import { api } from "@/lib/api/client";
import { toApiError } from "@/lib/api/errors";
import type { ApiSuccess, PaginationMeta } from "@/lib/api/types";

export type OrderPaymentMethod = "prepaid" | "cod";

export type OrderStatus =
  "awaiting_payment" | "confirmed" | "shipped" | "delivered" | "expired";

export type OrderPaymentStatus = "unpaid" | "partially_paid" | "paid";

export type OrderShipping = {
  recipientName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type OrderItem = {
  variantId: string;
  productId: string;
  storeId: string;
  productName: string;
  storeName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type OrderTotals = {
  itemsSubtotal: number;
  deliveryFee: number;
  grandTotal: number;
  amountDueNow: number;
  amountPaid: number;
  balanceDue: number;
  refundableAmount: number;
  currency: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  paymentMethod: OrderPaymentMethod;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  codCollectionStatus: string;
  shipping: OrderShipping;
  note: string;
  items: OrderItem[];
  totals: OrderTotals;
  stockHoldExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OrderQuote = {
  paymentMethod: OrderPaymentMethod;
  items: OrderItem[];
  totals: OrderTotals;
};

export type CreateOrderInput = {
  paymentMethod: OrderPaymentMethod;
  items: { variantId: string; quantity: number }[];
  shipping: OrderShipping;
  note?: string;
};

export type PaymentInitiate = {
  attemptId: string;
  tranId: string;
  orderId: string;
  amount: number;
  currency: string;
  purpose: string;
  gatewayPageUrl: string;
  mode: "mock" | "sandbox" | "live";
};

type PaginatedOrders = ApiSuccess<Order[]> & {
  meta?: { pagination: PaginationMeta };
};

export async function quoteOrder(input: CreateOrderInput) {
  const { data } = await api.post<ApiSuccess<OrderQuote>>(
    "/orders/quote",
    input,
  );
  return data.data;
}

export async function createOrder(
  input: CreateOrderInput,
  idempotencyKey: string,
) {
  const { data } = await api.post<ApiSuccess<Order>>("/orders", input, {
    headers: { "Idempotency-Key": idempotencyKey },
  });
  return data.data;
}

export async function initiatePayment(orderId: string, idempotencyKey: string) {
  const { data } = await api.post<ApiSuccess<PaymentInitiate>>(
    `/orders/${orderId}/payments`,
    {},
    { headers: { "Idempotency-Key": idempotencyKey } },
  );
  return data.data;
}

export async function listOrders(page = 1, limit = 20) {
  const { data } = await api.get<PaginatedOrders>("/orders", {
    params: { page, limit },
  });
  return {
    items: data.data,
    pagination: data.meta?.pagination,
  };
}

export async function getOrder(orderId: string) {
  const { data } = await api.get<ApiSuccess<Order>>(`/orders/${orderId}`);
  return data.data;
}

export type OrderTrackingItem = {
  name: string;
  slug: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
};

export type OrderTracking = {
  orderNumber: string;
  status: OrderStatus;
  paymentMethod: OrderPaymentMethod;
  paymentStatus: OrderPaymentStatus;
  placedAt: string;
  shipTo: Omit<OrderShipping, "phone">;
  carrier: string;
  trackingNumber: string;
  packedAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  fulfillmentStartedAt: string | null;
  grandTotal: number;
  currency: string;
  items: OrderTrackingItem[];
};

export async function trackOrder(input: {
  orderNumber: string;
  email: string;
}) {
  try {
    const { data } = await api.post<ApiSuccess<OrderTracking>>(
      "/orders/track",
      {
        orderNumber: input.orderNumber.trim().toUpperCase(),
        email: input.email.trim().toLowerCase(),
      },
    );
    return data.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export function buildCheckoutPayload(
  values: {
    firstName: string;
    lastName: string;
    phone: string;
    line1: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
    paymentMethod: OrderPaymentMethod;
    note?: string;
  },
  items: { variantId: string; quantity: number }[],
): CreateOrderInput {
  return {
    paymentMethod: values.paymentMethod,
    items,
    shipping: {
      recipientName:
        `${values.firstName.trim()} ${values.lastName.trim()}`.trim(),
      phone: values.phone.replace(/\s/g, ""),
      line1: values.line1.trim(),
      line2: "",
      city: values.city.trim(),
      state: values.region.trim(),
      postalCode: values.postalCode.trim(),
      country: values.country.trim() || "Bangladesh",
    },
    note: values.note?.trim() || undefined,
  };
}
