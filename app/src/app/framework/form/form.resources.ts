import nls from "../resources/nls/generic";
import { FormFields } from "./form.interfaces";

export const addFieldFormFields: FormFields[] = [
  {
    name: "fieldName",
    label: nls.fieldName,
    required: true,
    type: "text",
    pattern: '^(?=.{1,18}$)[A-Za-z][A-Za-z\' \\-]*[A-Za-z]$',
    maxlength: 20,
    errorMessage: [
      {
        type: 'pattern',
        message: nls.FieldNameInvlaid
      }
    ]
  }, {
    name: "fieldType",
    label: nls.fieldType,
    required: true,
    type: 'select',
    options: [
      {
        label: 'TEXT',
        value: 'text',
      },
      {
        label: 'NUMBER',
        value: 'number',
      },
    ],
  }]