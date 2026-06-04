---
'@razorpay/blade': patch
---

fix(Tabs): center tab labels on React Native to match web

`TabItem.native`'s `StyledTabButton` was missing `justifyContent: 'center'`, so full-width tab items (`isFullWidthTabItem`) left-aligned their labels on React Native, while the web variant (`TabItem.web`) centers them. Added the missing property to restore web/native parity.
