---
'@razorpay/blade': minor
---

feat(native): flesh out DatePicker, BarChart, and CommonChartComponents native implementations

Builds out the native (React Native) implementations of components that previously shipped only as scaffolds:

- **DatePicker.native.tsx** — full Tier-1 native picker (was a stub)
- **Charts/BarChart/BarChart.native.tsx** — Tier-1 bar chart implementation (was a stub)
- **Charts/CommonChartComponents/** — native common-chart helpers and shared tokens

Driven by the Razorpay merchant mobile app's Blade v12 migration spike, where the prior native stubs were insufficient for the home/payments screens.
