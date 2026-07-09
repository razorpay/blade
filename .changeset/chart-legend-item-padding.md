---
'@razorpay/blade': patch
---

fix(Charts): add 4px padding to chart legend items

Chart legend items (web) now have `theme.spacing[2]` (4px) padding on all sides, so each item's clickable/hoverable bounding box has 4px of breathing room around the color swatch and 4px after the label, in addition to the existing 8px gap between swatch and label and 16px gap between items.
