---
'@razorpay/blade': minor
---

feat(Button): add `color="neutral"` (a primary button: black in light mode, white in dark), `hasRazorSense` (RazorSense on hover, on the neutral primary) and `hasRay` with `rayVariant` (on hover the secondary widens for Ray, at any size; `investigate`: his magnifying glass)

FloatingActionButton with `color="neutral"`, which shares the neutral surface: in dark mode it takes the white button's insets and ink, and disabled / loading it reads (its label, icon and spinner follow the theme on the faded surface). CardHeaderIconButton's `color` is now `"primary"` or `"white"` (the only colours its tertiary variant takes)
