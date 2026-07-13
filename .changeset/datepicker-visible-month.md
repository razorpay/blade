---
'@razorpay/blade': minor
---

feat(DatePicker): add `visibleMonth`/`defaultVisibleMonth` to control the rendered calendar month independently of `value`

`DatePicker`/`DateRangePicker` now accept `visibleMonth` (controlled) and `defaultVisibleMonth` (uncontrolled) props. These let the calendar open on a specific month without pre-selecting a date — useful for a "comparison" range picker that should default to the period immediately preceding a primary range picker's selection, while leaving the comparison `value` empty for the user to pick.

```tsx
<DatePicker
  selectionType="range"
  label={{ start: 'Compare to' }}
  defaultVisibleMonth={dayjs(primaryRangeStart)
    .subtract(rangeLengthInDays + 1, 'day')
    .toDate()}
/>
```

When using the controlled `visibleMonth`, keep it in sync via the existing `onChange` (date selection) and `onNext`/`onPrevious` (calendar navigation) callbacks — there is no dedicated `onVisibleMonthChange` callback.

Falls back to the existing behavior (first date of `value`/`defaultValue`, or today) when not set — fully backwards compatible.
