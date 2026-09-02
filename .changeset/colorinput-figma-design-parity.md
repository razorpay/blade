---
"@razorpay/blade": patch
---

fix(ColorInput): align swatch sizing, spacing and radius with the Figma spec

- Resize the colour swatch to 16px (small), 20px (medium) and 24px (large), down from 24/28/40
- Inset the swatch 8px from the field edge, and 12px at large
- Reduce the swatch-to-hex gap to 8px at medium and large, so it is consistent across all sizes
- Use the 32% disabled opacity token instead of a hardcoded 50%
- Round the outer corners at 12px for `size="large"` instead of forcing 8px at every size
