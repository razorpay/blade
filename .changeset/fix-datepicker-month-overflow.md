---
'@razorpay/blade': patch
---

fix(DatePicker): resolve setMonth overflow causing month picker interaction test failures

Clamps the day-of-month to the target month's max days (via dayjs().daysInMonth()) before calling setFullYear(year, month, clampedDay) in the month and year change paths of useDatesState. parseSpecialSingleFormat now uses day 1 instead of today.getDate() for month/year-only formats (MMM, MMMM, YYYY) since the day is not part of the displayed value for these picker types. This fixes a JavaScript Date.setMonth overflow bug where selecting a month with fewer days than the current day-of-month (e.g. the 31st selecting November) silently rolled the date forward to the next month.
