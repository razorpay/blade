const classes = {
  levelsGroup: 'DatePicker-levelsGroup',
  dayCell: 'DatePicker-cell',
  monthsListControl: 'DatePicker-cell',
  yearsListControl: 'DatePicker-cell',
  calendarHeader: 'DatePicker-header',
  row: 'DatePicker-row',
  weekday: 'DatePicker-weekday',
} as const;

const pickerToLevel = {
  day: 'month',
  month: 'year',
  year: 'decade',
} as const;

const levelToPicker = {
  month: 'day',
  year: 'month',
  decade: 'year',
} as const;

export { levelToPicker, pickerToLevel, classes };
