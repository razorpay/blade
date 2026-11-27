---
'@razorpay/blade': patch
'@razorpay/blade-plugin': patch
'@razorpay/blade-mcp': patch
---

docs(DatePicker): describe humanised dates in `displayFormat="compact"`

- The `displayFormat` description and the DatePicker knowledgebase said compact mode only shows preset labels. It also shows humanised dates such as "11-17 Nov 2026" for custom selections, with or without presets, on both `DatePicker` and `FilterChipDatePicker`
- Add tests for `FilterChipDatePicker` compact and default display
