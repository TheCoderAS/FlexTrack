import { FormFields } from "../../framework/form/form.interfaces"
import nls from "../../framework/resources/nls/schedules"

export const days = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 0
}

export const dayOptions = [
  { value: days.MONDAY, label: "Monday" },
  { value: days.TUESDAY, label: "Tuesday" },
  { value: days.WEDNESDAY, label: "Wednesday" },
  { value: days.THURSDAY, label: "Thursday" },
  { value: days.FRIDAY, label: "Friday" },
  { value: days.SATURDAY, label: "Saturday" },
  { value: days.SUNDAY, label: "Sunday" },
]

export const weeklyField: FormFields = {
  name: 'startDay', label: nls.startDay, type: 'select', required: true, options: dayOptions, defaultValue: ''
}