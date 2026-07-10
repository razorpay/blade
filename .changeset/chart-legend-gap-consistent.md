---
'@razorpay/blade': patch
---

fix(Charts): keep X-axis to legend gap constant regardless of `label` prop

Previously, the gap between the X-axis tick labels and the chart legend increased when `ChartXAxis` had a `label` prop (e.g. "Month"), because the space reserved for the axis label was only added when the prop was present. Now the space is always reserved, so the legend's vertical position relative to the axis is consistent whether or not an X-axis label is set. Affects `BarChart`, `LineChart`, `AreaChart`, and `DonutChart` (web).
