---
'@razorpay/blade-svelte': patch
---

fix(blade-svelte): focus and error no longer move what a TextInput, TextArea or OTPInput holds

- The frame keeps its 1px border in every state. The focused and error states drew Blade's thick border as a 1.5px `border-width`, which shrank the frame's content box by 1px, so the control, the leading icon and the text moved 0.5px on focus in Safari and on any 2x screen.
- The remaining 0.5px is now a ring around the border, from two new utilities, `shadow-input-active` and `shadow-input-error`. Blade React and `blade-core` draw the input border as a `box-shadow` for the same reason.
