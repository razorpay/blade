---
'@razorpay/blade': patch
---

fix(PhoneNumberInput): tighten spacing around country selector and dial code

- Country selector to dial code: 12px → 2px; dial code to number: 8px → 4px
- Without dial code, the number sits 2px after the country selector
- With a leading icon and no dial code, the number sits 4px after the icon
- Country selector to leading icon: 12px → 2px
- Country selector has an even gap from the field edge on all sides (2px on small and xsmall, 4px on medium and large)
- fix(BaseInput): prefix and suffix text now sit on the same baseline as the input text (fixes a 1px offset at medium size)
