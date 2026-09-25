---
'@razorpay/blade-core': minor
'@razorpay/blade-svelte': minor
---

feat(blade-svelte): add `useBreakpoint()` as the Svelte equivalent of React Blade's `useBreakpoint`

`BladeProvider` now tracks the matched viewport breakpoint once and exposes it through context.
Call `useBreakpoint()` inside the provider tree to read `{ matchedBreakpoint, matchedDeviceType }`
reactively. `ToastContainer` and typography platform selection now consume the same source, so a
single breakpoint crossing flips both together.

`blade-core` gains framework-agnostic helpers under `utils`: `getMediaQuery`, `getBreakpointQueries`,
`getDeviceType`, and `subscribeToBreakpoint`.

During SSR the device type now resolves to `desktop` (matching React Blade) instead of `mobile`.
