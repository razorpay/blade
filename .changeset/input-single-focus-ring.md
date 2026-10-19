---
'@razorpay/blade': patch
---

fix(Input): show a single focus ring when a button inside an input is focused

The input's outer focus ring now only shows while its own text field is focused. Buttons inside the input, like the clear button, the show password button and the phone number country selector, keep their own focus ring, so the two no longer show together. ColorInput's swatch now has its own focus ring, and the country selector button shows its ring only for keyboard focus.
