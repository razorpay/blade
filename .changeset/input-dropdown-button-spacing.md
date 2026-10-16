---
'@razorpay/blade': patch
---

fix(InputDropdownButton): update horizontal spacing to match Figma

- Inner left/right padding is now size-based: large 8/4px, medium 6/4px, small and xsmall 5/2px
- Gap between items reduced from 4px to 2px
- Chevron is 12px (medium, large) and 8px (small, xsmall); leading icon is 20px on large
- Label text is 12px on small and xsmall
- PhoneNumberInput flag is 18px wide on small and xsmall
- Button height and its gap to the input edge are unchanged
