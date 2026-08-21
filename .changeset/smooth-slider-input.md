---
'@razorpay/blade': minor
---

Add SliderInput component: a slider track coupled with a numeric input for bounded value selection.

- The numeric field is composed from Blade's TextInput, with the unit (e.g. px, %) rendered inside the field via its trailing `suffix`.
- No validation/error state by design: values self-correct into `[min, max]` (typing past max resets to max; the thumb stops at the bounds), matching CounterInput. An optional `helpText` line is supported.
- Keyboard navigation follows the WAI-ARIA slider pattern; the optional help text is announced once, from the slider.
- Web-only in v1 — the React Native implementation is intentionally out of scope and throws a Blade error if rendered.
