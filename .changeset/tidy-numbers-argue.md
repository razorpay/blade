---
'@razorpay/blade': minor
---

feat(LineChart): per-line reference bands + tooltip ranges (Industry SR)

`ChartLine` now supports a per-line reference band via `rangeLowerDataKey` / `rangeUpperDataKey`, so a chart can show multiple trend lines each paired with its own color-matched industry range band — the pattern used by Optimizer's Industry SR view.

```tsx
<ChartLineWrapper data={data}>
  <ChartLine dataKey="payments" name="Payments" rangeLowerDataKey="paymentsMin" rangeUpperDataKey="paymentsMax" rangeName="Payments industry range" />
  <ChartLine dataKey="refunds"  name="Refunds"  rangeLowerDataKey="refundsMin"  rangeUpperDataKey="refundsMax"  rangeName="Refunds industry range" />
  <ChartXAxis dataKey="month" />
  <ChartLegend />
</ChartLineWrapper>
```

Each line's band auto-matches the line color (override with `rangeColor`), the tooltip shows an "industry range" (`low–high`) row per series, and the legend gets a swatch per band. Optional inline edge labels (`rangeUpperLabel` / `rangeLowerLabel`, toggled with `showRangeLabels`). The standalone `ChartReferenceBand` remains for the single-band case. Web + React Native. A new *KitchenSink (Industry SR)* story exposes `numberOfLines` (1–5) and `showReferenceBand` controls.
