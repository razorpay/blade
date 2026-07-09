---
'@razorpay/blade': patch
---

fix(Charts): update legend color swatch corner radius to `2xsmall`

Chart legend color swatches (web and native) now use `theme.border.radius['2xsmall']` (2px) instead of `theme.border.radius.small` (8px), aligning the legend dot styling with the design spec.
