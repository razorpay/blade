---
'@razorpay/blade': minor
---

feat(AreaChart): add `connectNullsStyle` for a dashed no-data bridge on `ChartArea`

`ChartArea` now supports the same null-handling API as `ChartLine`:

- `connectNulls={false}` (default, unchanged): the area breaks at null points, leaving a hard gap. Use this for genuine data outages.
- `connectNulls={true}` + `connectNullsStyle="solid"` (default): the area fills and strokes across nulls using Recharts' built-in `connectNulls` — backward compatible with existing usage.
- `connectNulls={true}` + `connectNullsStyle="dashed"`: the area is gapped at nulls (no fill under the no-data stretch) and a curved dashed bridge line is drawn across the gap, signalling "no data for this period" without implying a measured value.

Available on both React web and React Native.

Also fixes a latent bug where multiple `AreaChart`s on the same page emitted gradients with the same id, causing every chart's fill to resolve to the first chart's gradient (and appear washed out / invisible). Gradient ids are now namespaced per chart instance.
