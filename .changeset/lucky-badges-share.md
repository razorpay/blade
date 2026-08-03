---
'@razorpay/blade': minor
---

feat(LineChart): add `ChartMinMaxRange` for a data-driven min-max range band

`LineChart` now supports `ChartMinMaxRange`, a shaded band that highlights the range (min–max) that other series fall in, so a trend line can be compared against that range. The band is data-driven — its bounds vary per data point — via two data keys:

```tsx
<ChartLineWrapper data={data}>
  <ChartMinMaxRange lowerDataKey="min" upperDataKey="max" name="Min-max range" />
  <ChartXAxis dataKey="month" />
  <ChartYAxis />
  <ChartLine dataKey="activeUsers" name="Active users" />
  <ChartLegend />
</ChartLineWrapper>
```

`ChartMinMaxRange` accepts `lowerDataKey` and `upperDataKey` (required), plus optional `name` (legend label, default `'Min-max range'`), `color` (band fill token, default a faint categorical blue) and `showLegend` (default `true`). It also supports **range labels** — `upperLabel` / `lowerLabel` (e.g. `p75` / `p25`) drawn at the band's edges, toggled with `showRangeLabels` (default `true`). The band renders behind the trend line and adds a swatch to the legend, on both web and React Native.
