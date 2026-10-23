---
'@razorpay/blade': patch
---

fix(Table): keep the sticky first header/footer cell above sticky body cells

- When `isHeaderSticky` and `isFirstColumnSticky` are both set, the first header cell (the corner that is sticky in both directions) now has a higher z-index than the sticky first column body cells. Previously both used the same z-index and the body cells, being later in the DOM, painted over the header label.
- Header/footer cells in the sticky first column now stack above sticky body cells, while sticky body cells still sit above regular body cells.
- Same fix applies to the multi-select checkbox column (`nth-of-type(2)`). That cell shares the corner's z-index instead of a lower one, so when the checkbox column is wider than its 44px sticky offset (text in the checkbox column's footer cell, for example) the overlap is resolved by DOM order like on master and the first data column's header/footer stay visible. Body cells stay at the lower z-index, so the corner fix still holds.
- The Table wrapper now creates its own stacking context (`isolation: isolate`), so the sticky and refresh z-indexes never compete with app-level layers around the table.
- The `isRefreshing` overlay z-index moved above the new sticky scale (3 → 6) so a refreshing table still dims evenly — without this the sticky first column header/footer cells would paint above the overlay and stay bright while the rest of the table dimmed.
