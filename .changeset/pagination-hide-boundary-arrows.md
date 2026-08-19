---
'@razorpay/blade': minor
---

feat(Pagination): hide boundary navigation buttons instead of disabling them

`Pagination` and `TablePagination` no longer render the previous page button on the first page, nor the next page button on the last page. Previously both were rendered in a permanently disabled state, which invites clicks and communicates nothing.

The rule holds regardless of `isDisabled`: the boundary button stays unrendered on a disabled pagination too, since it could not act either way. `isDisabled` continues to disable every control that is rendered, including the opposite navigation button.
