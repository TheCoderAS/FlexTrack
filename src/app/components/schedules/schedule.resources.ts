import { FormFields } from "../../framework/form/form.interfaces"
import nls from "../../framework/resources/nls/schedules"

export const days = {
  MONDAY: "MONDAY",
  TUESDAY: "TUESDAY",
  WEDNESDAY: "WEDNESDAY",
  THURSDAY: "THURSDAY",
  FRIDAY: "FRIDAY",
  SATURDAY: "SATURDAY",
  SUNDAY: "SUNDAY"
}

export const dayOptions = [
  { value: days.MONDAY, label: "Monday" },
  { value: days.TUESDAY, label: "Tuesday" },
  { value: days.WEDNESDAY, label: "Wednesday" },
  { value: days.THURSDAY, label: "Thursday" },
  { value: days.FRIDAY, label: "FRIDAY" },
  { value: days.SATURDAY, label: "Saturday" },
  { value: days.SUNDAY, label: "Sunday" },
]

export const weeklyField: FormFields = {
  name: 'startDay', label: nls.startDay, type: 'select', required: true, options: dayOptions
}