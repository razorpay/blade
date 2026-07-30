---
'@razorpay/blade': minor
---

feat(Pagination): hide pagination controls that cannot do anything

- `Pagination` and `TablePagination` no longer render at all when every item already fits on a single page, so a table with fewer rows than a page stops showing an unusable `10 rows / page` picker and dead navigation arrows.
- The previous page button is no longer rendered on the first page, and the next page button is no longer rendered on the last page, instead of being rendered in a permanently disabled state. Setting `isDisabled` still renders both buttons, disabled.
- `Pagination` accepts a new optional `totalItemCount` prop so it can tell "one page because there are barely any items" apart from "one page because the page size is large". `TablePagination` forwards the table's item count automatically.
- A new optional `showOnSinglePage` prop (default `false`) lets consumers opt out of the auto-hide and keep the pagination footer always rendered, preserving prior behaviour when needed.
