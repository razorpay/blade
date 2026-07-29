---
"@razorpay/blade": minor
---

Enhance Table skeleton loader to match loaded table geometry. Added `skeletonRowCount`, `skeletonRowHeight`, and `skeletonMinHeight` props to control the skeleton placeholder appearance during loading state. Row count derives from `TablePagination.defaultPageSize`, row height respects `rowDensity`, and skeleton rows use the consumer's `gridTemplateColumns`.
