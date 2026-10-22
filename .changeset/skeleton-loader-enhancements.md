---
'@razorpay/blade': minor
---

Enhance Table skeleton loader to match loaded table geometry. Added `skeletonRowCount`, `skeletonRowMinHeight`, and `skeletonMinHeight` props to control the skeleton placeholder appearance during loading state. Row count derives from `TablePagination.defaultPageSize`, row height respects `rowDensity`, and skeleton rows use the consumer's `gridTemplateColumns`. The new `skeletonMinHeight` prop is an opt-in way to reserve the loaded table's footprint while loading — existing consumers retain the original `flex: 1` default with no behavioral change.
