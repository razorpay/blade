---
'@razorpay/blade': minor
'@razorpay/blade-core': minor
'@razorpay/blade-svelte': minor
---

feat: Button indefinite loading now uses the 3-dot loader from Figma

`Button`'s indefinite loading state now renders a 3-dot loader matching the `DotLoader` component in Figma on React web, React Native and Svelte: three 4px dots in a 24x24 frame that lift 5px and settle back in a staggered 1.2s wave, never dipping below the rest line. Under `prefers-reduced-motion` the loader holds the static Figma pose instead of animating.

The loader comes in two sizes. `size="large"` buttons are 48px tall, where the default loader reads as undersized, so they use a 1.5x-scaled loader (6px dots in a 36x36 frame); `xsmall` through `medium` buttons, at 28–36px tall, keep the default.

On React this replaces the spinner that `Button` rendered while `isLoading`. Loading colors are unchanged for every variant and color, and `FloatingActionButton`'s color override still applies. The standalone `Spinner` component is untouched.

On Svelte this fixes the existing dot loader, whose dot size, travel, opacity and timing did not match the design. The `--btn-dots-color` custom property continues to work as Button's dot-color hook.

The loader is available internally as a shared `DotLoader` component in both `@razorpay/blade` and `@razorpay/blade-svelte` so other components can reuse it. It is not part of either package's public API.

One note for tests that reach into the DOM: a React Button in its loading state no longer renders a `data-blade-component="spinner"` element. It renders `data-blade-component="dot-loader"` instead.
