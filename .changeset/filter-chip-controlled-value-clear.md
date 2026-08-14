---
'@razorpay/blade': patch
---

fix(FilterChipSelectInput): sync selection when the controlled `value` changes

`FilterChipSelectInput` only mapped its controlled `value` to the dropdown selection on mount, so
later updates from the consumer were ignored — a "Clear" action in the dropdown footer emptied the
consumer's state but left the options (and the chip label) selected. The controlled `value` is now
the source of truth on every change, including when it is emptied.
