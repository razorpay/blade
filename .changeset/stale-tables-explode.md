---
"@razorpay/blade": minor
---

fix: icon colors & remove `surface.action.icon.link.*` colors

## Breaking Changes
- Remove the following tokens from `paymentTheme` & `bankingTheme` theme of Blade:
  - `colors.surface.action.icon.link.default.lowContrast`
  - `colors.surface.action.icon.link.default.highContrast` 
  - `colors.surface.action.icon.link.hover.lowContrast`
  - `colors.surface.action.icon.link.hover.highContrast` 
  - `colors.surface.action.icon.link.focus.lowContrast`
  - `colors.surface.action.icon.link.focus.highContrast` 
  - `colors.surface.action.icon.link.active.lowContrast`
  - `colors.surface.action.icon.link.active.highContrast` 
  - `colors.surface.action.icon.link.disabled.lowContrast`
  - `colors.surface.action.icon.link.disabled.highContrast` 

  If you are using any of these tokens, they will no longer be available in your `theme`. Make sure you remove usage of these tokens from your codebase.

## Fixes
1. Fix incorrect Icon colors that were supported & suggested by TypeScript
