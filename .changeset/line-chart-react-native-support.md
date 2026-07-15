---
'@razorpay/blade': minor
---

feat(rn): add React Native support for LineChart

- SVG-based native line rendering with monotone, linear, and step interpolation
- Tap-to-stay scrub tooltip on a single responder surface
- Reference lines with label placement matching web
- Opaque tooltip styled to match the web appearance
- Known limitation: custom `dot` and `activeDot` elements (ReactElement/object) are not supported on native — both props are coerced to boolean and a dev-mode warning is logged when a non-boolean value is passed
