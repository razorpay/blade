---
"@razorpay/blade": patch
---

fix(blade): checkbox icon wrapper position

Fixed a bug in checkbox where the checkbox icon was flaoting outside it's wrapper because we've added `position: absolute` in the FadeIn animation component but forgot to add `position: relative` in the parent wrapper.
