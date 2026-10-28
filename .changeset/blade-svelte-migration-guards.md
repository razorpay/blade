---
'@razorpay/blade-svelte': patch
'@razorpay/blade-plugin': patch
---

fix(blade-svelte): guard the paths a 0.x app trips on

- **PhoneNumberInput**: `country` defaults to `'IN'`, as Blade React's, instead of the first country by name (Afghanistan); `countryLabel` is optional, `'Country'` by default, instead of rendering `undefined` into the button's name.
- **OTPInput**: a composing soft keyboard's keydown (`Unidentified`, keyCode 229, `Process`, `isComposing`) is left to `input`, so Android keyboards fill the cells.
- **Button**: hover, press and focus looks apply only while enabled; a disabled or busy button under a pointer no longer paints as enabled, and a busy one shows no focus ring.
- **Overlays**: `onDismiss`'s event takes `preventDefault()`, which keeps a dismissible modal, sheet or drawer open for that dismissal (ask first, then `close()`), without hiding the close button as `isDismissible={false}` does.
- **Overlays**: focus returns to the opener without the browser's scroll jump, as it moved in.
- **README**: a migration table from 0.x, pointing at the lint `allow` option and token repointing.
