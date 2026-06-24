---
"@razorpay/blade": patch
---

fix(CounterInput): fix width clipping, add per-digit animation, use tabular numeric font

- **Width expansion**: Container now uses `minWidth` instead of a fixed `width` so it keeps two-digit space by default and grows automatically for longer numbers (applies to all sizes: xsmall, medium, large).
- **Per-digit animation**: Only the digit(s) that actually changed animate when + or - is clicked (slot-machine style). Unchanged digits stay still.
- **Tabular numbers**: Added `font-variant-numeric: tabular-nums` so all digits have uniform width, preventing layout shifts as the number changes.
