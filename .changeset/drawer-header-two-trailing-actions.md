---
'@razorpay/blade': minor
'@razorpay/blade-plugin': patch
'@razorpay/blade-mcp': patch
---

feat(Drawer): support up to two trailing actions in `DrawerHeader`

`DrawerHeader`'s `trailing` now accepts an array of up to two icon-only actions (`IconButton`, or `Button` with only an `icon`), shown before the close button. Use it for actions like moving between records (previous / next) without closing the drawer. A single trailing element works as before.
