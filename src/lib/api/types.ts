export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
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
