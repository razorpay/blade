---
'@razorpay/blade': minor
---

feat(Pagination): hide boundary navigation buttons instead of disabling them

`Pagination` and `TablePagination` no longer render the previous page button on the first page, nor the next page button on the last page. Previously both were rendered in a permanently disabled state, which invites clicks and communicates nothing.

Setting `isDisabled` is unaffected — a disabled pagination still renders both buttons, disabled.
