---
"@razorpay/blade": patch
---

fix(LineChart): scope ChartReferenceBand export to LineChart and fix nested dataKey resolution in web tooltip

1. **Web tooltip nested dataKey fix** — The web tooltip resolved range bound values via direct property access (`item.payload?.[key]`), which doesn't support nested dot-notation data keys (e.g. `'metrics.min'`). Now uses `getIn()` to match the native tooltip's `getSeriesNumber` → `getIn` behaviour.

2. **ChartReferenceBand export scoping** — `ChartReferenceBand` is now exported from the `LineChart` module instead of the shared `CommonChartComponents` barrel, since the band-rendering layer only exists in `ChartLineWrapper`. This prevents the silent no-op/footgun of using `<ChartReferenceBand>` inside a `BarChart`/`AreaChart`.
