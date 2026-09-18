---
'@razorpay/blade': minor
'@razorpay/blade-mcp': patch
---

feat(BarChart): compare bars against a min–max reference range

`ChartBarWrapper` can now show a shaded min–max range behind its bars, in two shapes:

1. **One range for the whole chart** — drop a `<ChartReferenceBand lowerDataKey upperDataKey>` into a `ChartBarWrapper`. Previously this rendered nothing, since only `ChartLineWrapper` had a band layer. The band is always visible and gets a legend swatch.

2. **A range per bar** — `<ChartBar>` accepts `rangeLowerDataKey`, `rangeUpperDataKey`, `rangeName`, `rangeColor` and `showRangeLegend`. In a grouped chart each bar can carry its own range; bands are revealed **on hover, one at a time**, so several ranges don't overlap into an unreadable wash. The band is colour-matched to its bar and anchored to that series' own bar centres.

While a band is declared, hovering a bar also fades the other series and shades the hovered category, so the revealed band reads against its own bar. **This is scoped to charts that declare a band** — a bar chart without one keeps exactly the category-wide hover highlight it has today.

**Tooltip** — hovering a bar shows its value and, on a second row, the range's min–max at that same data point. A standalone `<ChartReferenceBand>` now contributes its bounds to that row; previously only a series' own `range*` props did, so a chart-level band drew the shaded area but showed no range row. A bar's own `range*` props still win.

`ChartReferenceBand` keeps its existing export from the shared chart components barrel — no import changes needed.

**Scope of the band** (each fails closed, rendering no band rather than one in the wrong place):

- Horizontal layout only — not drawn under `layout="vertical"`, whose geometry is not yet supported.
- Requires a string `dataKey` on the bar; recharts also allows a number or a function, which the band's DOM lookups can't name.
- Web only — the `range*` props are accepted but inert on React Native, and marked `@platform web`.
- Hover-revealed per-bar bands are a visual enhancement, not the carrier of the data: every value is also in the tooltip, which is reachable without a pointer.

Also fixes the alignment of the tooltip's range row, which affects **every chart** that shows one, LineChart included. Its indent was a hardcoded `spacing.5` (16px) standing in for the colour swatch plus its gap (`spacing.4` + `spacing.3` = 20px), so the range label sat 4px to the left of the series name above it.

The `blade-mcp` knowledgebase doc for BarChart is updated too, so AI agents know the band is available: its accepted-children constraint previously omitted `ChartReferenceBand` entirely.
