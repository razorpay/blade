---
"@razorpay/blade": patch
---

fix(Table): show row hover gradient when only `hoverActions` is passed

Previously a `TableRow` only rendered the hover gradient / background when
`onHover` or `onClick` was provided. Rows that showed `hoverActions`
without either callback had the actions reveal on hover but no row
highlight underneath, which was visually inconsistent.

`hoverActions` now participates in the hoverable check alongside
`onHover` and `onClick`, so the row gradient shows whenever any
hover-driven UI is attached.

Closes #3281
