---
'@razorpay/blade': minor
---

feat(Charts): `onActivePointChange` on the line, area, bar and donut wrappers

The chart reports the point that a pointer, a tap or the arrow keys make active, so the app can show it in its own UI, for example a headline above the chart. The callback gets `{ index, label, formattedLabel, items: [{ dataKey, name, value, formattedValue, color, colorToken }] }` when the point changes, and `null` when the pointer leaves. The text matches the chart: the `ChartTooltip` `formatter` and `labelFormatter` (with the arguments the tooltip gives them), else `valueFormat`, else the axis `tickFormatter`. A custom `ChartTooltip` `content` is not mirrored. A series with no value at the point is left out, as in the tooltip, unless `ChartTooltip` has `filterNull={false}`. Funnel and sankey do not take the prop. It sends the point again when the same point reads differently, for example after a legend toggle, and sends `null` on unmount. It works in `v1` and `v2`, on web and native. With no callback, nothing changes. To show no tooltip, leave out `ChartTooltip`: the line keeps its active dot.
