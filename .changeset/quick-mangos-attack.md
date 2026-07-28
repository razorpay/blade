---
'@razorpay/blade': minor
---

feat(AreaChart): add `connectNullsStyle` for a dashed no-data bridge on `ChartArea`

`ChartArea` now supports the same null-handling API as `ChartLine`:

- `connectNulls={false}` (default, unchanged): the area breaks at null points, leaving a hard gap. Use this for genuine data outages.
- `connectNulls={true}` + `connectNullsStyle="solid"` (default): real data renders as a solid area and the gap is bridged with a curved solid line, with no fill under the no-data stretch.
- `connectNulls={true}` + `connectNullsStyle="dashed"`: real data renders as a solid area and the gap is bridged with a curved dashed line, with no fill under the no-data stretch, signalling "no data for this period" without implying a measured value.

Available on both React web and React Native.

Also fixes a latent bug where multiple `AreaChart`s on the same page emitted gradients with the same id, causing every chart's fill to resolve to the first chart's gradient (and appear washed out / invisible). Gradient ids are now namespaced per chart instance.
