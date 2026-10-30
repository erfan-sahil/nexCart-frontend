import type { Metadata } from "next";

import { OrderDetailView } from "@/features/orders/components/order-detail-view";

type PageProps = {
  params: Promise<{ orderId: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { orderId } = await params;
  return {
    title: `Order ${orderId.slice(0, 8)}…`,
    description: "View your NexCart order details.",
  };
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { orderId } = await params;
  return <OrderDetailView orderId={orderId} />;
}
