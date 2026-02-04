---
"@razorpay/blade": minor
---

feat(DatePicker): add `showClearButton` and `onClearButtonClick` props

- **`showClearButton`**: When set to `true`, renders a clear icon button in the DatePicker input field. Clicking the button clears the selected date(s).
- **`onClearButtonClick`**: Event handler called when the clear button is clicked.

Example usage:

```jsx
<DatePicker
  label="Select date"
  selectionType="single"
  showClearButton
  onClearButtonClick={() => console.log('Cleared!')}
/>
```

**Change for FilterChipDatePicker:**

When using `FilterChipDatePicker` with `selectionType="single"`, clearing the date will now return `null` instead of `[null, null]`. This aligns the clear behavior with the selection type:

- `selectionType="single"` → clears to `null`
- `selectionType="range"` → clears to `[null, null]`
