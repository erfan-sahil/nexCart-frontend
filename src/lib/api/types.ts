export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
  meta?: {
    pagination?: PaginationMeta;
    personalized?: boolean;
  };
  requestId: string;
};

export type ApiFieldError = {
  path: string;
  message: string;
};

export type ApiErrorBody = {
  success: false;
  message: string;
  code: string;
  requestId?: string;
  errors?: ApiFieldError[];
};
