---
"@razorpay/blade": minor
"@razorpay/blade-mcp": patch
---

feat(blade): add `variant` prop for primary and neutral backgrounds in TopNav

Added a new `variant` prop to `TopNav` component with two options:

- `variant="neutral"` (default) — existing dark/black background, fully backward-compatible
- `variant="primary"` — uses brand primary color background (Razorpay blue)

The explicit `backgroundColor` prop still takes precedence over `variant`, preserving the escape hatch for custom backgrounds.

**Usage:**

```jsx
// Default neutral variant (existing behavior)
<TopNav>...</TopNav>

// Primary brand color variant
<TopNav variant="primary">...</TopNav>

// Custom background still works
<TopNav backgroundColor="surface.background.gray.intense">...</TopNav>
```
