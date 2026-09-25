export type PaymentMethodType =
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'BANK_TRANSFER'
  | 'DIGITAL_WALLET'
  | 'PSE'
  | 'CASH';

export type PaymentMethodStatus = 'ACTIVE' | 'INACTIVE';

export interface PaymentMethodTypeOption {
  label: string;
  value: PaymentMethodType;
  icon?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: PaymentMethodType;
  description?: string;
  status: PaymentMethodStatus;
  created_at: string;
  updated_at?: string;
}

export interface CreatePaymentMethodItem {
  name: string;
  type: PaymentMethodType;
  description?: string;
  status?: PaymentMethodStatus;
}

export interface UpdatePaymentMethodItem {
  name?: string;
  type?: PaymentMethodType;
  description?: string;
  status?: PaymentMethodStatus;
}

export interface PaymentMethodFilters {
  name?: string;
  type?: PaymentMethodType | '';
  status?: PaymentMethodStatus | '';
}

export interface PaymentMethodsState {
  items: PaymentMethod[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  filters: PaymentMethodFilters;
}
