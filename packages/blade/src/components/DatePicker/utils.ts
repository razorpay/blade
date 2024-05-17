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

export { pickerToLevel, levelToPicker };
