import { Container, PageBreadcrumb } from "@/components/common";

import { statusLabel } from "../lib/form";
import type { VendorApplication } from "../types";

const copy: Record<VendorApplication["status"], string> = {
  draft: "Your application is still a draft.",
  submitted: "We have your application and will review it shortly.",
  under_review: "A reviewer is looking at your store application.",
  more_info_required: "We need a few more details before we can continue.",
  approved: "Your store is approved. You can start selling on NexCart.",
  rejected:
    "This application was not approved. You can update it and submit again.",
};

export function ApplicationStatus({
  application,
}: {
  application: VendorApplication;
}) {
  return (
    <Container className="py-8 sm:py-12">
      <PageBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Sell on NexCart" }]}
      />
      <div className="mx-auto mt-8 max-w-xl rounded-3xl border border-border bg-card px-6 py-8 sm:px-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          {statusLabel(application.status)}
        </p>
        <h1 className="mt-3 text-3xl sm:text-4xl">
          {application.business.storeName || "Your seller application"}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          {copy[application.status]}
        </p>
        {application.reviewNote ? (
          <p className="mt-6 rounded-2xl bg-brand-soft px-4 py-3 text-sm text-foreground">
            {application.reviewNote}
          </p>
        ) : null}
      </div>
    </Container>
  );
}
