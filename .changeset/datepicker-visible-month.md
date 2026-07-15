---
'@razorpay/blade': minor
---

feat(DatePicker): add `visibleMonth`/`defaultVisibleMonth` to control the rendered calendar month independently of `value`

`DatePicker`/`DateRangePicker` now accept `visibleMonth` (controlled), `defaultVisibleMonth` (uncontrolled), and `onVisibleMonthChange` props. These let the calendar open on a specific month without pre-selecting a date — useful for a "comparison" range picker that should default to the period immediately preceding a primary range picker's selection, while leaving the comparison `value` empty for the user to pick.

```tsx
<DatePicker
  selectionType="range"
  label={{ start: 'Compare to' }}
  defaultVisibleMonth={dayjs(primaryRangeStart).subtract(rangeLengthInDays + 1, 'day').toDate()}
/>
```

Falls back to the existing behavior (first date of `value`/`defaultValue`, or today) when not set — fully backwards compatible.
