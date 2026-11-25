---
'@razorpay/blade': minor
'@razorpay/blade-plugin': patch
---

feat(GenUI, Charts): chart versions, the v2 chart look, and responsive GenUI charts

**Charts.** New `version: 'v1' | 'v2'` on `ChartLineWrapper`, `ChartAreaWrapper`, `ChartBarWrapper` and `ChartDonutWrapper`. Default `v1`: the chart renders as before, and the display props below have no effect. A display prop on a `v1` chart logs a warning in development.

`version="v2"`:

- puts the Y labels in a `left` column as wide as the widest label plus `spacing.3`, with no fixed gutter. A bar chart with `layout="vertical"` puts its category names in the same column.
- spaces the chart with tokens: `legendGap` (default `spacing.5`) between the legend and the nearest chart element (the top Y label or the top gridline on top, the X labels at the bottom), `spacing.3` between the plot and the X labels, no chart margin, and no space under the X labels unless the X axis has a `label`. The plot height is the same with and without a border.
- draws no axis lines. The bottom gridline is the baseline. Gridlines are `thinner` by default.
- ends the last X label of a number X axis, as on a horizontal bar chart, inside the plot. A category name on a horizontal bar chart is cut with an ellipsis at 40% of the chart width.
- shows as many X labels as fit on a category axis with no `interval`, each on one line, with at least `spacing.3` between two labels.
- shows a line swatch in the legend of a line chart, in the line's `strokeStyle`. The dash comes from the new `border.dash` theme token.
- spaces the legend items `spacing.4` apart, with `spacing.3` between two rows of text.
- fits the donut ring to its box, at most the `radius` size. The ring and the legend are one group, centred in the box, with `legendGap` between them.
- takes the display props: `showBorder` (a line on the left, the right and the bottom of the plot, each drawn once, in the gridline colour and width; default off), `yLabelPlacement` (`left`, `right`, `overlap`; `overlap` with `showBorder` shows as `left`), `yGridlines`, `gridlineWidth` (`thin`, `thinner`), `legendPlacement` (`top`, `bottom`), `showLegend` (unset is auto: a `ChartLegend` child shows, even for one series, and with no `ChartLegend` child the chart adds a legend for 2 or more series or donut slices and none for one; `true` always shows a legend, `false` never does) and `legendGap` (`spacing.3` to `spacing.8`). The donut takes the legend props, and `legendPlacement` also takes `left` and `right`.

`valueFormat: { type: 'currency' | 'count' | 'percent', currency? }` works in both versions, also on `ChartDonutWrapper`: en-IN ticks, compact, on the Y axis and on a number X axis, and tooltip values in full.

**Behaviour change, in `v1` too:** `ChartTooltip` now shows what its `formatter` and `labelFormatter` props return. It accepted both before but showed the raw value and label. A tooltip with neither prop does not change.

`ChartAreaWrapper` now uses Blade's own `useId`, so area charts draw on React 17 hosts. Only the gradient ids change.

**GenUI.** New `chartVersion: 'v1' | 'v2'` on the `GenUIProvider` config. Default `v2`. `v1` draws the CHART as before, with `v1` charts. With `v2`, the `CHART` uses `v2` charts and:

- takes its height from its width: `clamp(200px, width / 1.6, 350px)`. `tiny` stays 100px.
- labels a date axis on a calendar step that fits the width, as "1 Oct". The last label stays inside the plot. A category axis shows the labels that fit.
- writes INR ticks in lakh and crore (₹1.5L), draws whole ticks for counts, and shows full values in the tooltip (₹1,23,450.00, 1,23,450, 12.5%). A date heading in the tooltip reads "4 Oct".
- has no border in a box of 640px or less and a border above, unless the node sets `showBorder`. The node can set `yLabelPlacement`: `left` (the default), `right` or `overlap`. An old `outside` from a model is `right`.
- leaves the legend to the chart's auto rule: a legend for 2 or more series or pie slices, none for one, unless the node sets `showLegend`. A donut takes the `small` radius under 440px.
- shows a pie of more than 4 slices, or in a box under 300px, as a list of bars, scaled to the total, in categorical blue.
- shows the title and one line for a finished chart with no rows. While the answer streams, it keeps the skeleton.
