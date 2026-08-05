---
'@razorpay/blade': patch
---

fix(DatePicker): allow reopening a controlled range `FilterChipDatePicker` after a range is selected

The auto-close effect that commits a selection when `showFooterActions` is false compared the selected value by reference. For `selectionType="range"` in controlled mode (`value` + `onChange`) the value is rebuilt into a new array on every render, so the effect re-ran on each render and immediately closed the flyout whenever the existing range was already complete, making the picker impossible to reopen. The selection is now compared by content so auto-close only happens on an actual selection change.
