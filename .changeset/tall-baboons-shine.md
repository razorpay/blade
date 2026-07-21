---
'@razorpay/blade': minor
---

feat(ChartLine): add `connectNullsStyle` to draw a dashed bridge across null values

`ChartLine` now accepts a `connectNullsStyle` prop (`'solid' | 'dashed'`, default `'solid'`) that controls how the line is drawn across null points when `connectNulls` is `true`. With `'dashed'`, real data renders as a solid line while the stretch across `null` points renders dashed — signalling "no data for this period" without implying a measured value. `connectNulls={false}` (default) continues to leave a hard gap for genuine data outages, and `connectNulls={true}` remains a solid bridge by default.
