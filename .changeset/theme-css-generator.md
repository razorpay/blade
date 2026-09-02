---
'@razorpay/blade-core': patch
---

Auto-generate `theme.css` from the bladeTheme token sources instead of hand-editing it. Adds `yarn generate:tokens-css` and a drift-guard test so `theme.css` can't silently fall out of sync with the token TS files. The token-upload CI pipeline now regenerates it automatically as part of every Figma token push.
