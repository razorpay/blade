---
"@razorpay/blade": minor
---

feat: increase the CSS specificity of all components

> [!WARNING]
>
> **We've enhanced the specificity of styles for Blade components. If you've defined styles in separate CSS at a root level targeting blade components, please note that they may no longer take effect as expected.
> The styles within the blade components will now take precedence.**
>
> **Your existing component snapshots may update, there is no change in the visual appearance of components. Please feel free to add the updated snapshots.**
