---
'@razorpay/blade-plugin': patch
'@razorpay/blade-mcp': patch
---

docs(Dropdown): document `showClearButton` on `FilterChipSelectInput` and the Clear / Reset props on `FilterChipGroup`

- Fix the `onChange` and `onClearButtonClick` signatures of `FilterChipSelectInput` to match the component
- Add guidance and an example for filters that must always be applied (no cross button, Reset instead of Clear)
