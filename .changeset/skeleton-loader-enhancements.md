---
'@razorpay/blade': minor
---

Enhance Table skeleton loader to match loaded table geometry. Added `skeletonRowCount` and `skeletonRowMinHeight` props to control the skeleton placeholder appearance during loading state. Row count derives from `TablePagination.defaultPageSize`, row height respects `rowDensity`, and skeleton rows use the consumer's `gridTemplateColumns`. The existing `height` prop is now also applied to the skeleton, so a sized table reserves the same footprint while loading.
