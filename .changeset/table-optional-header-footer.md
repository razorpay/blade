---
'@razorpay/blade': minor
---

**Table:** Add `columnCount` prop and `isRowHeader` cell prop for headerless composition

- New `columnCount` prop on `<Table>` — required when `TableHeader` is omitted so the CSS grid knows how many columns to create.
- New `isRowHeader` prop on `<TableCell>` — renders with `role="rowheader"` for accessible row identification when no column header is present.
- `TableFooter` was always optional; added explicit story and tests documenting that pattern.
