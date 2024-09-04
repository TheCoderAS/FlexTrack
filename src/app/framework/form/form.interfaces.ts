export interface FormFields {
  name: string;
  label: string;
  errorMessage?: any[];
  required: boolean;
  id?: string;
  type: string;
  model?: string;
  pattern?: string;
  options?: any[];
  defaultValue?: string | '';
  min?: number;
  max?: number;
  step?: number
  maxlength?: number,
  accept?: string,
  maxSize?: number,
  matching?: boolean,
  disabled?: boolean,
  deletable?: boolean
}
