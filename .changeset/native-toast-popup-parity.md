---
'@razorpay/blade': minor
---

fix(Toast): web visual parity for the native Toast + `offsetBottom` on native ToastContainer

- Native `Toast` now uses the same `popup.background.*` / `popup.border.*` tokens as web (solid-looking saturated backgrounds with staticWhite content) instead of 9%-alpha `feedback.background.*.subtle` tints, which let underlying screen content bleed through the toast. Since RN has no `backdropFilter: blur()`, the semi-transparent popup token is backed by an opaque surface view (same workaround as `TooltipContentWrapper.native`).
- Native `ToastContainer` now honors the existing web `offsetBottom` prop so apps can lift the toast stack above bottom tab bars and safe-area insets (previously hardcoded to `theme.spacing[8]` from the screen bottom).
