---
"@razorpay/blade": minor
---

feat(DatePicker): support `displayFormat="compact"` in `FilterChipDatePicker`

The `FilterChipDatePicker` now accepts the `displayFormat="compact"` prop (previously only supported on `DatePicker`). In compact mode, selecting a named preset (e.g. "Past 7 days") shows the preset label inside the chip's selected state, while a custom range shows a humanised, easy-to-read date range (e.g. `7 Jun - 12 Jun 2026`) instead of the raw `DD/MM/YYYY` format.

The humanised compact format is also applied to the regular `DatePicker` input for custom range selections on the day picker (the field reverts to the editable `DD/MM/YYYY` format on focus, and the submitted form value is unchanged).
