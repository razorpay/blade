---
'@razorpay/blade': minor
'@razorpay/blade-mcp': patch
---

feat(BarChart): compare bars against a min–max reference range

`ChartBarWrapper` can now show a shaded min–max range behind its bars, in two shapes:

1. **One range for the whole chart** — drop a `<ChartReferenceBand lowerDataKey upperDataKey>` into a `ChartBarWrapper`. Previously this rendered nothing, since only `ChartLineWrapper` had a band layer. The band is always visible and gets a legend swatch.

2. **A range per bar** — `<ChartBar>` accepts `rangeLowerDataKey`, `rangeUpperDataKey`, `rangeName`, `rangeColor` and `showRangeLegend`. In a grouped chart each bar can carry its own range; bands are revealed **on hover, one at a time**, so several ranges don't overlap into an unreadable wash. The band is colour-matched to its bar and anchored to that series' own bar centres.

Hovering a bar in a grouped chart now also fades the other series and shades the hovered category, so the revealed band reads against its own bar.

**Tooltip** — hovering a bar shows its value and, on a second row, the range's min–max at that same data point. Two supporting fixes to the shared `ChartTooltip`:

- It now honours the `formatter` prop it already accepted (`ChartTooltipProps` is `ComponentProps<typeof RechartsTooltip>`) but silently ignored, because the custom `content` dropped it. Pass `formatter` to add units — `<ChartTooltip formatter={(value) => `${value}%`} />` renders `62%` and a `48%–70%` range row. Applies to every chart using `ChartTooltip`.
- A standalone `<ChartReferenceBand>` now contributes its bounds to the tooltip. Previously only a series' own `range*` props did, so a chart-level band drew the shaded area but showed no range row. A bar's own `range*` props still win.

`ChartReferenceBand` keeps its existing export from the shared chart components barrel — no import changes needed.

The `blade-mcp` knowledgebase doc for BarChart is updated too, so AI agents know the band is available: its accepted-children constraint previously omitted `ChartReferenceBand` entirely.
