export interface FormFields {
  name: string;
  label: string;
  errorMessage?: any[];
  required: boolean;
  id?: string;
  type: string;
  model?: string;
  pattern?: string;
  defaultValue?: string | '';
  disabled?: boolean,
  options?: any[]; //if type is select
  min?: number; // if type is number
  max?: number; // if type is number
  step?: number; // if type is slider
  maxlength?: number, // if type is text
  accept?: string, // if type is file
  maxSize?: number, // if type is file
  matching?: boolean, // if type is password and to match confirmpassword
  deletable?: boolean, // if form is dynamic
  multiple?: boolean // if type is select and needs to select multiple item
}
