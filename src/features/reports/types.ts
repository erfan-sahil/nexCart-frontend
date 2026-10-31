import type { ProductReportStatus, ProductReportType } from "./constants";

export type ProductReportProduct = {
  id: string;
  name: string;
  slug: string;
};

export type ProductReportStore = {
  id: string;
  name: string;
};

export type ProductReportReporter = {
  id: string;
  displayName: string;
};

export type ProductReport = {
  id: string;
  type: ProductReportType;
  message: string;
  status: ProductReportStatus;
  createdAt: string;
  updatedAt: string;
  product: ProductReportProduct;
  store: ProductReportStore;
  reporter: ProductReportReporter;
  isMine: boolean;
};

export type ProductReportMinePayload = {
  report: ProductReport | null;
};

export type ProductReportListPayload = {
  reports: ProductReport[];
};
