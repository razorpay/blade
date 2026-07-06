---
"@razorpay/blade": patch
---

fix(DonutChart): update legend selection behavior and center total calculation

- Keep uncontrolled donut chart legends fully selected when data keys arrive after initial render
- Add strikethrough styling for deselected legend items
- Update donut chart center total to reflect currently visible selected slices when center label is Total
