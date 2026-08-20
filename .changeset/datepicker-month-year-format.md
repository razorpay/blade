---
'@razorpay/blade': minor
---

feat(DatePicker): support 'MMM YYYY' and 'MMMM YYYY' display formats for the month picker

Previously the month picker input could only display the month (e.g. "Mar"), so the selected year was invisible once the calendar closed. The `format` prop now also accepts 'MMM YYYY' and 'MMMM YYYY' so the input can render "Mar 2026" / "March 2026". Typing these values directly into the input is parsed and validated too.
