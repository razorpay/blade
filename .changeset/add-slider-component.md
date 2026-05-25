---
'@razorpay/blade': minor
---

feat(Slider): Add Slider component

Adds a new `Slider` component that allows users to select a numeric value from a continuous range by dragging a thumb along a track.

**Features:**
- Controlled and uncontrolled modes via `value` / `defaultValue` props
- Configurable `min`, `max`, and `step` values
- `isDisabled` support
- Form integration: `label`, `helpText`, `errorText`, `successText`, `validationState`
- Necessity indicators: `required` / `optional`
- Optional tooltip on thumb via `showTooltip`
- Two sizes: `small` and `medium`
- Full accessibility support with ARIA attributes (`role="slider"`, `aria-valuenow`, etc.)
- Cross-platform: React Web and React Native
