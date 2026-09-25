export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  statusCode?: number;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: unknown;
}

export interface SelectOption<T = string | number> {
  label: string;
  value: T;
}