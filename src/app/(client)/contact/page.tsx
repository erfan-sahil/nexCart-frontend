import type { Metadata } from "next";

import { ContactView } from "@/features/contact";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Send a message to NexCart support about an order, return, or store.",
};

export default function ContactPage() {
  return <ContactView />;
}
