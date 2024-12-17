export function toDatePickerString(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function toDatePickerStringNow() {
  return toDatePickerString(new Date());
}

export function toDatePickerStringDaysFromNow(daysOffset: number) {
  return toDatePickerString(new Date(Date.now() + daysOffset * 86_400_000));
}
