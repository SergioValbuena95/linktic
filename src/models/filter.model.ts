export type FilterFieldType = 'text' | 'select' | 'date' | 'number';

export interface FilterSelectOption<T = string | number | boolean> {
  label: string;
  value: T;
  icon?: string;
  disable?: boolean;
}

export interface FilterFieldConfig<T = unknown> {
  key: string;
  label: string;
  type: FilterFieldType;
  placeholder?: string;
  options?: FilterSelectOption[];
  multiple?: boolean;
  required?: boolean;
  requiredErrorMessage?: string;
  defaultValue?: T;
  icon?: string;
  colClass?: string;
  clearable?: boolean;
}

export type FilterValues = Record<string, unknown>;

export interface FilterComponentEmits {
  (e: 'search', values: FilterValues): void;
  (e: 'reset'): void;
}
