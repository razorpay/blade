---
'@razorpay/blade': minor
'@razorpay/blade-plugin': patch
'@razorpay/blade-mcp': patch
---

feat(FunnelChart): add `ChartFunnelWrapper` and `ChartFunnel`

A new chart that shows how many reach each step of a sequence and how many drop off between steps. Each step is a column on a percentage axis: who reached it is solid, who dropped since the previous step is hatched on top. The tooltip shows both counts and their share of the previous step, on hover and on keyboard focus. It composes with `ChartXAxis`, `ChartYAxis`, `ChartCartesianGrid` and `ChartTooltip`. Web only.
