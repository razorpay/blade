---
"@razorpay/blade": patch
---

fix(DatePicker): open on a selectable month when today is outside the `minDate`/`maxDate` range

Previously the calendar always opened on today's month even when every date in it was disabled by `minDate`/`maxDate`. Now, when no value or `visibleMonth`/`defaultVisibleMonth` is set, the initial month is clamped into the allowed range — opening on `maxDate`'s month when today is after `maxDate`, or `minDate`'s month when today is before `minDate`. Applies to both web and native.
