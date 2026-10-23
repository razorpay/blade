---
'@razorpay/blade': patch
---

fix(Table): keep the sticky first header/footer cell above sticky body cells

- When `isHeaderSticky` and `isFirstColumnSticky` are both set, the first header cell (the corner that is sticky in both directions) now has a higher z-index than the sticky first column body cells. Previously both used the same z-index and the body cells, being later in the DOM, painted over the header label.
- Header/footer cells in the sticky first column now stack above sticky body cells, while sticky body cells still sit above regular body cells.
- Same fix applies to the multi-select checkbox column (`nth-of-type(2)`).
- The `isRefreshing` overlay z-index moved above the new sticky scale (3 → 6) so a refreshing table still dims evenly — without this the sticky first column header/footer cells (z-index 4/5) would paint above the overlay and stay bright while the rest of the table dimmed.
