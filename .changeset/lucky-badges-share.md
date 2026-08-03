---
'@razorpay/blade': minor
---

feat(LineChart): add `ChartReferenceBand` for a data-driven reference band

`LineChart` now supports `ChartReferenceBand`, a shaded band that highlights the bounded range (e.g. min–max, p25–p75) that other series fall in, so a trend line can be compared against that range. The band is data-driven — its bounds vary per data point — via two data keys:

```tsx
<ChartLineWrapper data={data}>
  <ChartReferenceBand lowerDataKey="min" upperDataKey="max" name="Reference band" />
  <ChartXAxis dataKey="month" />
  <ChartYAxis />
  <ChartLine dataKey="activeUsers" name="Active users" />
  <ChartLegend />
</ChartLineWrapper>
```

`ChartReferenceBand` accepts `lowerDataKey` and `upperDataKey` (required), plus optional `name` (legend label, default `'Reference band'`), `color` (band fill token, default a faint categorical blue) and `showLegend` (default `true`). It also supports **range labels** — `upperLabel` / `lowerLabel` (e.g. `p75` / `p25`) drawn at the band's edges, toggled with `showRangeLabels` (default `true`). The band renders behind the trend line and adds a swatch to the legend, on both web and React Native.
