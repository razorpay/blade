---
'@razorpay/blade': minor
---

**Table:** Add `stickyColumns` prop for multi-column sticky support

Adds a new `stickyColumns` prop on `Table` that pins N columns from the left during horizontal scrolling. For example, `stickyColumns={2}` keeps the first two data columns fixed while the rest scroll horizontally. When `selectionType="multiple"`, the checkbox column is also automatically pinned without counting toward the `stickyColumns` number.

The existing `isFirstColumnSticky` prop is kept for backward compatibility but is now deprecated in favor of `stickyColumns={1}`.

```tsx
// Pin first 2 columns
<Table data={data} stickyColumns={2} height="500px">
  ...
</Table>
```
