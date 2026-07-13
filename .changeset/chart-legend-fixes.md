---
'@razorpay/blade': patch
---

fix(Charts): legend styling and spacing fixes

- Chart legend color swatches (web and native) now use `theme.border.radius['2xsmall']` (2px) instead of `theme.border.radius.small` (8px), aligning the legend dot styling with the design spec.
- Chart legend items (web) now have `theme.spacing[2]` (4px) padding on all sides, so each item's clickable/hoverable bounding box has 4px of breathing room around the color swatch and 4px after the label, in addition to the existing 8px gap between swatch and label and 16px gap between items.
- Fixed the gap between the X-axis and the legend (web) growing whenever `ChartXAxis` had a `label` prop set. The space for the axis label is now always reserved, so the legend's position relative to the axis stays constant whether or not an X-axis label is present.

Affects `BarChart`, `LineChart`, `AreaChart`, and `DonutChart`.
