---
'@razorpay/blade': patch
---

fix(PhoneNumberInput): tighten spacing around country selector and dial code

- Country selector to dial code: 12px → 2px; dial code to number: 8px → 4px
- Without dial code, the number sits 2px after the country selector
- Country selector to leading icon: 12px → 2px
- fix(BaseInput): prefix and suffix text now sit on the same baseline as the input text (fixes a 1px offset at medium size)
