---
'@razorpay/blade': minor
---

feat(SankeyChart): add `labelDensity` and `showColorIndicator` props; single-line labels on web

- `labelDensity="compact"` renders 20px label chips (4px vertical padding) instead of 28px, for charts whose columns stack many thin nodes
- `showColorIndicator` starts each label with a dot in the node's colour so a label can be matched to its bar and ribbons at a glance
- Labels on web are now always a single line: a name that does not fit the 200px label budget is truncated with an ellipsis (the tooltip keeps the full name) instead of wrapping onto a second line
- A share between 0 and 1 percent reads `<1%` instead of `0%`
- Right margin is reserved only for the last column's labels, measured from their actual text, so the chart no longer shrinks to make room for labels that sit between columns
