---
"@razorpay/blade": minor
---

feat(LineChart): add `ChartReferenceBand` and per-line reference bands for industry comparison

`LineChart` now supports reference bands — shaded min–max ranges drawn behind the trend line so a trend can be compared against an industry comparison range. Two capabilities:

1. **Standalone `ChartReferenceBand`** — a single data-driven band via `lowerDataKey`/`upperDataKey`:

```tsx
<ChartLineWrapper data={data}>
  <ChartReferenceBand lowerDataKey="min" upperDataKey="max" name="Reference band" />
  <ChartXAxis dataKey="month" />
  <ChartYAxis />
  <ChartLine dataKey="activeUsers" name="Active users" />
  <ChartLegend />
</ChartLineWrapper>
```

`ChartReferenceBand` accepts `lowerDataKey` and `upperDataKey` (required), plus optional `name` (legend label, default `'Reference band'`), `color` (band fill token, default a faint categorical blue) and `showLegend` (default `true`).

2. **Per-line bands on `ChartLine`** — each line can declare its own `rangeLowerDataKey` / `rangeUpperDataKey` so a chart shows multiple trend lines, each with its own color-matched industry range band:

```tsx
<ChartLineWrapper data={data}>
  <ChartLine dataKey="payments" name="Payments" rangeLowerDataKey="paymentsMin" rangeUpperDataKey="paymentsMax" rangeName="Payments industry range" />
  <ChartLine dataKey="refunds"  name="Refunds"  rangeLowerDataKey="refundsMin"  rangeUpperDataKey="refundsMax"  rangeName="Refunds industry range" />
  <ChartXAxis dataKey="month" />
  <ChartLegend />
</ChartLineWrapper>
```

Each line's band auto-matches the line color (override with `rangeColor`), the tooltip shows an "industry range" (`low–high`) row per series, and the legend gets a swatch per band. The band renders behind the trend line on both web and React Native. A new *KitchenSink (Industry SR)* story exposes `numberOfLines` (1–5) and `showReferenceBand` controls.
