---
"@razorpay/blade": minor
---

feat(DatePicker): add `showClearButton` and `onClearButtonClick` props

- **`showClearButton`**: When set to `true`, renders a clear icon button in the DatePicker input field. Clicking the button clears the selected date(s).
- **`onClearButtonClick`**: Event handler called when the clear button is clicked. In controlled mode, use this callback to reset your state to `null` (for single selection) or `[null, null]` (for range selection).

Example usage:

```jsx
// Uncontrolled
<DatePicker
  label="Select date"
  selectionType="single"
  showClearButton
  onClearButtonClick={() => console.log('Cleared!')}
/>

// Controlled
<DatePicker
  label="Select date"
  selectionType="single"
  value={date}
  onChange={setDate}
  showClearButton
  onClearButtonClick={() => setDate(null)}
/>
```

