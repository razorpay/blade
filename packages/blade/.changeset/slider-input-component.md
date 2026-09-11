---
"@razorpay/blade": minor
---

feat(SliderInput): add SliderInput component (web)

Adds `SliderInput` for picking a number from a range by dragging, with optional step markers, a value scale, and a readout above the thumb.

```jsx
<SliderInput label="Volume" min={0} max={100} step={25} showMarkers showScale />
```

Use `onChange` to track the value live during a drag, and `onChangeEnd` for anything expensive, since it fires once when the interaction commits.
