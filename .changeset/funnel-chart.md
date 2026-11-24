---
'@razorpay/blade': minor
'@razorpay/blade-plugin': patch
'@razorpay/blade-mcp': patch
---

feat(FunnelChart): add `ChartFunnelWrapper` and `ChartFunnel`

A new chart that shows how many reach each step of a sequence. It wraps Recharts' `FunnelChart` and `Funnel` with Blade tokens: each step is a trapezoid labelled with its name and share of the first step, and hovering a step shows its count in `ChartTooltip`. Web only.
