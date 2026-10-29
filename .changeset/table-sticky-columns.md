---
'@razorpay/blade': minor
'@razorpay/blade-plugin': patch
'@razorpay/blade-mcp': patch
---

feat(Table): add `stickyColumns` to pin more than one column

- New `stickyColumns={N}` prop on `Table` keeps the first N columns in view while the table scrolls horizontally. With `selectionType="multiple"` the checkbox column is pinned too and isn't counted.
- Each sticky column is offset by the measured widths of the columns before it, so it works with any `gridTemplateColumns`. This also fixes the sticky first data column in multi-select tables, which used a fixed 44px offset even when the checkbox column was wider.
- A divider is drawn after the last sticky column, and it casts a `midRaised` shadow over the scrolling columns as soon as the table is scrolled horizontally. In rows below a cell that spans rows, only the first column stays pinned and there is no divider, rather than cells pinned at the wrong offset.
- On mobile, only the first column stays sticky so the pinned columns don't fill the screen.
- Works in virtualized tables: the rows and header now grow to the width of their columns so sticky cells don't slide out of view when scrolled far right.
- `isFirstColumnSticky` keeps working and is now deprecated in favour of `stickyColumns={1}`. `stickyColumns` takes precedence when both are set. The divider and scroll shadow only come with `stickyColumns`, so tables using `isFirstColumnSticky` look the same as before.
