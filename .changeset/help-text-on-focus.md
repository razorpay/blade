---
'@razorpay/blade': minor
---

feat(Input): add `showHelpTextOnFocus` to make help text contextual

- **TextInput, TextArea, PasswordInput, SearchInput, PhoneNumberInput**: added an opt-in `showHelpTextOnFocus` prop. When set, `helpText` stays collapsed at rest and eases in only while the input is focused, easing back out on blur — so it no longer occupies the row, or pushes content below it, when the user isn't in the field.
- `errorText` and `successText` are deliberately unaffected: validation feedback must never depend on focus, so it continues to render persistently and untransitioned.
- Defaults to `false`. With the prop unset, help text renders exactly as before — same markup, no transition — so this is fully backwards compatible.
- Motion is tokenised as `formHintMotion` in `formTokens.ts` (`duration.moderate` — 280ms — with `easing.entrance` in and `easing.exit` out), matching the shape of `baseInputBorderBackgroundMotion` so the border and the hint below it read as one coordinated focus transition.
- The help text is clipped rather than unmounted while collapsed, so the id referenced by `aria-describedby` / `accessibilityDescribedBy` stays resolvable and screen readers still announce it on focus.
- Additive and optional, so this is a `minor` bump rather than `major`: no public prop or prop value is removed or narrowed, and no default behaviour changes.
- **`@razorpay/blade-svelte` parity is intentionally deferred, not overlooked.** blade-svelte now ships the same input family (BaseInput, TextInput, PasswordInput, SearchInput, PhoneNumberInput, OTPInput) with its own `helpText`, so this prop is a cross-package API divergence until it lands there too. React is deliberately first so the API is settled here before being mirrored; a follow-up should port `showHelpTextOnFocus` to blade-svelte.
- **`OTPInput` and `ColorInput` are out of scope**: both compose their own `FormHint` outside `BaseInput`'s footer, so they need separate wiring rather than inheriting the prop.
- **`SelectInput` / `AutoComplete` are out of scope**: their focus semantics are coupled to the dropdown's open state and they already offer `showHintsAsTooltip` as an alternative hint treatment, so gating their help text on focus needs its own design decision.
- Rationale for the prop name, the `BaseInput`-over-`FormHint` placement, and why the motion avoids the framer-motion primitives is documented in `BaseInput/_decisions/_decisions.md`.
