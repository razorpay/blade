---
"@razorpay/blade": patch
---

fix: add `flex`, `flexGrow`, `flexShrink`, `flexBasis` to styled props allowlist so they work on Blade components like `Button`, `TextInput`, etc.

Before this fix, passing `flex="1"` to `Button` / `TextInput` inside a flex `Box` container was silently dropped, causing children not to split width equally. Now styled-props correctly forward these flex properties.

Closes #1543
