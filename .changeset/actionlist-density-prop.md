---
"@razorpay/blade-svelte": minor
---

fix(ActionList): add `density` prop to control item row density

`ActionList` previously hardcoded item density via CSS — compact
`spacing-2` padding on mobile and roomier `spacing-3` on desktop — with no way
for consumers to control it. Add an opt-in `density?: 'normal' | 'dense'` prop
that pins every row to a single padding value across breakpoints. When omitted,
the existing responsive behavior is unchanged.
