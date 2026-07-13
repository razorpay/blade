---
'@razorpay/blade': minor
---

feat(DatePicker): add `defaultVisibleMonth` to anchor the rendered calendar month independently of `value`

`DatePicker`/`DateRangePicker` now accept a `defaultVisibleMonth` prop. This lets the calendar open on a specific month without pre-selecting a date — useful for a "comparison" range picker that should default to the period immediately preceding a primary range picker's selection, while leaving the comparison `value` empty for the user to pick.

```tsx
<DatePicker
  selectionType="range"
  label={{ start: 'Compare to' }}
  defaultVisibleMonth={dayjs(primaryRangeStart).subtract(rangeLengthInDays + 1, 'day').toDate()}
/>
```

`defaultVisibleMonth` only sets the initial anchor — subsequent calendar navigation is uncontrolled from that point on. Use the existing `onNext`/`onPrevious` callbacks to observe navigation, and `onChange` to observe date selection.

Falls back to the existing behavior (first date of `value`/`defaultValue`, or today) when not set — fully backwards compatible.
