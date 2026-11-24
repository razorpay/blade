---
'@razorpay/blade': minor
---

feat(GenUI, Charts): opt-in responsive layout for GenUI charts, and opt-in minimal axes on the charts

Every change is opt-in. With no new prop or config, charts and GenUI charts draw as before.

**GenUI.** New `chartLayout` on the `GenUIProvider` config: `'fixed'` (default, the CHART as before) or `'responsive'`. With `'responsive'`, the `CHART`:

- takes its height from its width: `clamp(200px, width / 1.6, 350px)`. `tiny` stays 100px.
- labels a date axis on a calendar step that fits the width, as "1 Oct". The last label stays inside the plot.
- writes INR ticks in lakh and crore (₹1.5L), draws whole ticks for counts, and shows full values in the tooltip (₹1,23,450.00, 1,23,450, 12.5%). A date heading in the tooltip reads "4 Oct".
- takes `minimal` axes in a box of 640px or less, unless the node sets `axisStyle`. The node can also set `yLabelPlacement`.
- draws no legend for one series. A donut takes the `small` radius under 440px.
- shows a pie of more than 4 slices, or in a box under 300px, as a list of bars, scaled to the total, in categorical blue.
- shows the title and one line for a finished chart with no rows. While the answer streams, it keeps the skeleton.

**Charts.** New opt-in props on `ChartBarWrapper`, `ChartLineWrapper` and `ChartAreaWrapper`, each off by default:

- `axisStyle: 'lines' | 'minimal'`. `minimal`: no axis lines, 0.5px gridlines that run the full width, and no space kept under the X labels when there is no X axis label.
- `yLabelPlacement: 'overlap' | 'outside'`, for `minimal`. `overlap`: each Y label inside the plot, from the chart's left edge, just below its gridline, with a thin halo. `outside`: a label column right of the plot, each label centred on its gridline.
- `valueFormat: { type: 'currency' | 'count' | 'percent', currency? }`, also on `ChartDonutWrapper`: en-IN ticks, compact, and tooltip values in full.

`ChartTooltip` now shows what its `formatter` and `labelFormatter` props return. It accepted both before but showed the raw value and label.

`ChartAreaWrapper` now uses Blade's own `useId`, so area charts draw on React 17 hosts. Only the gradient ids change.
