---
"@razorpay/blade": patch
---

feat(SideNav): add subtle press effect to SideNavLink

On press, the inner content of a `SideNavLink` (icon, text, badge, chevron, and
trailing button) gently scales down and springs back on release, while the
row/background stays full-size. Pure CSS, pointer-driven, with no re-renders.
