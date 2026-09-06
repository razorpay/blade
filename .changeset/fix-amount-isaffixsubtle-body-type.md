---
"@razorpay/blade": patch
---

fix(Amount): isAffixSubtle=false now correctly renders body type currency prefix at full size

Previously, body entries in `currencyHardcodedSizes` mapped to subtle-sized values (10–12px), which were applied as inline style overrides. This caused the currency prefix to remain small even when `isAffixSubtle={false}`. The fix removes the incorrect body entries so body type uses `normalAmountSizes` (same font size as the number) without any hardcoded pixel override.
