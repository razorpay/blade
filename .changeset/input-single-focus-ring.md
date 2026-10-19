---
'@razorpay/blade': patch
---

fix(Input): show a single focus ring when a button inside an input is focused

The input's outer focus ring now only shows while its own text field is focused. Buttons inside the input, like the clear button, the show password button and the phone number country selector, keep their own focus ring, so the two no longer show together. ColorInput's swatch now has its own focus ring, and the country selector button shows its ring only for keyboard focus.

**If you pass a custom focusable element to `leading` or `trailing`:** the input's outer ring no longer shows while that element has focus, so the element needs its own visible focus ring. Blade's `Button`, `IconButton` and `Link` already have one, so nothing changes when you use those. If you pass a hand-built element, such as a `div` with `tabIndex` or an unstyled `button`, give it a `:focus-visible` style so keyboard users can still see where focus is. Component props are unchanged.
