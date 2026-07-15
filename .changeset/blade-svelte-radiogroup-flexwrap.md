---
'@razorpay/blade-core': minor
'@razorpay/blade-svelte': minor
---

feat(blade-svelte): add `flexWrap` support to `RadioGroup`

`RadioGroup` now accepts a `flexWrap` prop (`'nowrap' | 'wrap' | 'wrap-reverse'`, default `'nowrap'`), mirroring `CheckboxGroup` and the React implementation. This is useful with `orientation="horizontal"` when radios (or radio-wrapped cards) should wrap onto multiple lines instead of overflowing.
