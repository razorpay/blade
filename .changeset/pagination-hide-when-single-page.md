---
'@razorpay/blade': minor
---

feat(Pagination): hide pagination when all items fit on a single page

`Pagination` and `TablePagination` no longer render at all when every item already fits on one page, so a table with fewer rows than a page stops showing an unusable `10 rows / page` picker and navigation controls that cannot do anything.

`Pagination` accepts a new optional `totalItemCount` prop so it can tell "one page because there are barely any items" apart from "one page because the page size is large" — 30 items at 50 / page keeps the size picker, since switching to 10 / page would still produce multiple pages. `TablePagination` forwards the table's item count automatically, so tables get the fix without any code change.
