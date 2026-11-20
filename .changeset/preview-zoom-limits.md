---
'@razorpay/blade': minor
'@razorpay/blade-plugin': patch
'@razorpay/blade-mcp': patch
---

feat(Preview): add `minZoom`, `maxZoom` and `PreviewBody` `isFullSize` to fit content to the frame

- `minZoom` (default `0.1`) and `maxZoom` (default `8`) on `Preview` set how far it can zoom. The defaults match the old fixed limits, so nothing changes unless you pass them.
- A `defaultZoom` outside `minZoom`–`maxZoom` is clamped into that range, for both the starting zoom and Reset.
- The footer's Zoom Out and Zoom In buttons now disable at these limits in both layouts. Before, the `ButtonGroup` layout (without `showZoomPercentage`) never disabled them.
- `isFullSize` on `PreviewBody` (default `false`) makes the body fill the frame and centre its child, so content can fit the frame with `max-width: 100%` and `max-height: 100%`. It is opt-in because it makes an `<img width="100%" height="100%">` child stretch to the frame's shape.
