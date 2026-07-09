---
'@razorpay/blade': patch
---

fix(DatePicker): collapse same-month ranges in compact display format

`displayFormat="compact"` now shows same-month date ranges as `1-23 Jun 2026` instead of repeating the month, e.g. `1 Jun - 23 Jun 2026`. Ranges spanning different months or years keep their existing format (`7 Jun - 12 Jul 2026`, `28 Dec 2025 - 3 Jan 2026`).
