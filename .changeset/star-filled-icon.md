---
"@razorpay/blade": minor
---

feat(Icons): add StarFilledIcon

Adds a filled variant of the star icon, `StarFilledIcon`, alongside the existing outline `StarIcon`. The outline star can only show color on its stroke, so surfaces that need a solid star (for example a filled/selected rating or favourite state on the Reports page) had no Blade icon to use.

`StarFilledIcon` follows the same API as every other icon: it takes `size` and `color`, and the `color` fills the whole star shape rather than just the outline. It is exported from the icons barrel and registered in `iconMap`, so it works anywhere an `IconComponent` is accepted (including the `icon` prop on other components).
