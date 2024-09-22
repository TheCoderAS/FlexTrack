import { FormFields } from "../../framework/form/form.interfaces";
import nls from "../../framework/resources/nls/logging";

export const loggingViewFormFieldsInitial: FormFields[] = [
  {
    name: "scheduleId",
    label: nls.selectSchedule,
    required: true,
    type: "select",
    options: [],
    defaultValue: ''
  },
  {
    name: "loggingDate",
    label: nls.loggingDate,
    required: true,
    type: "date",
  }
]
export const loggingAddFormFieldsInitial: FormFields[] = [
  {
    name: "scheduleId",
    label: nls.selectSchedule,
    required: true,
    type: "select",
    options: [],
    defaultValue: '',
    disabled: true
  },
  {
    name: "loggingDate",
    label: nls.loggingDate,
    required: true,
    type: "date",
    disabled: true
  }
]