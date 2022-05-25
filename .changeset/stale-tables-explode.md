---
"@razorpay/blade": minor
---

fix: icon & other dot-notation types

## Breaking Changes
- Remove the following tokens from `paymentTheme` & `bankingTheme` theme of Blade:
  - `colors.surface.action.link.default.lowContrast`
  - `colors.surface.action.link.default.highContrast` 
  - `colors.surface.action.link.hover.lowContrast`
  - `colors.surface.action.link.hover.highContrast` 
  - `colors.surface.action.link.focus.lowContrast`
  - `colors.surface.action.link.focus.highContrast` 
  - `colors.surface.action.link.active.lowContrast`
  - `colors.surface.action.link.active.highContrast` 
  - `colors.surface.action.disabled.default.lowContrast`
  - `colors.surface.action.disabled.default.highContrast` 

  If you are using any of these tokens, they will no longer be available in your `theme`. Make sure you remove usage of these tokens from your codebase.

## Fixes
1. Fix incorrect Icon colors that were supported & suggested by TypeScript
