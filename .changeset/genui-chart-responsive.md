---
'@razorpay/blade': minor
---

feat(GenUI, Charts): chart versions, the v2 chart look, and responsive GenUI charts

**Charts.** New `version: 'v1' | 'v2'` on `ChartLineWrapper`, `ChartAreaWrapper`, `ChartBarWrapper` and `ChartDonutWrapper`. Default `v1`: the chart renders as before, and the display props below have no effect. A display prop on a `v1` chart logs a warning in development.

`version="v2"`:

- puts the Y labels in a `left` column as wide as the widest label plus `spacing.3`, with no fixed gutter. A bar chart with `layout="vertical"` puts its category names in the same column.
- spaces the chart with tokens: `spacing.4` between the legend and the plot, `spacing.3` between the plot and the X labels, no chart margin, and no space under the X labels unless the X axis has a `label`. The plot height is the same in every `axisStyle`.
- shows as many X labels as fit on a category axis with no `interval`, each on one line, with at least `spacing.3` between two labels.
- shows a line swatch in the legend of a line chart, in the line's `strokeStyle`. The dash comes from the new `border.dash` theme token.
- takes the display props: `axisStyle` (`lines`, `minimal`), `yAxisLine` (a line on both sides of the plot), `yLabelPlacement` (`left`, `right`, `overlap`; `outside` is `right`), `yGridlines`, `gridlineWidth` (`thin`, `thinner`) and `legendPlacement` (`top`, `bottom`). The donut takes `legendPlacement`.

`valueFormat: { type: 'currency' | 'count' | 'percent', currency? }` works in both versions, also on `ChartDonutWrapper`: en-IN ticks, compact, and tooltip values in full.

`ChartTooltip` now shows what its `formatter` and `labelFormatter` props return. It accepted both before but showed the raw value and label.

`ChartAreaWrapper` now uses Blade's own `useId`, so area charts draw on React 17 hosts. Only the gradient ids change.

**GenUI.** New `chartVersion: 'v1' | 'v2'` on the `GenUIProvider` config. Default `v2`. `v1` draws the CHART as before, with `v1` charts. With `v2`, the `CHART` uses `v2` charts and:

- takes its height from its width: `clamp(200px, width / 1.6, 350px)`. `tiny` stays 100px.
- labels a date axis on a calendar step that fits the width, as "1 Oct". The last label stays inside the plot. A category axis shows the labels that fit.
- writes INR ticks in lakh and crore (₹1.5L), draws whole ticks for counts, and shows full values in the tooltip (₹1,23,450.00, 1,23,450, 12.5%). A date heading in the tooltip reads "4 Oct".
- takes `minimal` axes in a box of 640px or less, unless the node sets `axisStyle`. The node can also set `yLabelPlacement`.
- draws no legend for one series. A donut takes the `small` radius under 440px.
- shows a pie of more than 4 slices, or in a box under 300px, as a list of bars, scaled to the total, in categorical blue.
- shows the title and one line for a finished chart with no rows. While the answer streams, it keeps the skeleton.

`chartLayout` stays as a deprecated alias: `responsive` is `v2` and `fixed` is `v1`. It can go before merge.
