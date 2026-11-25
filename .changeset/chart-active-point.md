---
'@razorpay/blade': minor
---

feat(Charts): `onActivePointChange` on the line, area, bar and donut wrappers

The chart reports the point that a pointer, a tap or the arrow keys make active, so the app can show it in its own UI, for example a headline above the chart. The callback gets `{ index, label, formattedLabel, items: [{ dataKey, name, value, formattedValue, color }] }` when the point changes, and `null` when the pointer leaves. The text matches the chart: the `ChartTooltip` formatters, else `valueFormat`, else the axis `tickFormatter`. It works in `v1` and `v2`, on web and native. With no callback, nothing changes. To show no tooltip, leave out `ChartTooltip`: the line keeps its active dot.
