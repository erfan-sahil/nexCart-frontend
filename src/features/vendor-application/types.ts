export const APPLICATION_STATUSES = [
  "draft",
  "submitted",
  "under_review",
  "more_info_required",
  "approved",
  "rejected",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export type DocumentType = "nid" | "passport";

export type BusinessType = "individual" | "company";

export type Address = {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type VendorApplication = {
  id: string;
  userId: string;
  status: ApplicationStatus;
  personal: {
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string | null;
    address: Address;
  };
  identity: {
    documentType: DocumentType | null;
    documentNumber: string;
    documentImages: string[];
    selfieUrl: string;
  };
  business: {
    storeName: string;
    businessType: BusinessType | null;
    address: Address;
    tradeLicense: { number: string; documentUrl: string } | null;
    tax: { taxId: string; documentUrl: string } | null;
  };
  selling: {
    categoryIds: string[];
    description: string;
  };
  reviewNote: string;
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SellingCategory = {
  id: string;
  name: string;
  slug: string;
};

export type AddressInput = Partial<Address>;

export type SaveVendorApplicationPayload = {
  personal?: {
    fullName?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    address?: AddressInput;
  };
  identity?: {
    documentType?: DocumentType;
    documentNumber?: string;
    documentImages?: string[];
    selfieUrl?: string;
  };
  business?: {
    storeName?: string;
    businessType?: BusinessType;
    address?: AddressInput;
    tradeLicense?: { number?: string; documentUrl?: string } | null;
    tax?: { taxId?: string; documentUrl?: string } | null;
  };
  selling?: {
    categoryIds?: string[];
    description?: string;
  };
};
