---
'@razorpay/blade': minor
---

# ✨ Blade Spark

This document covers changes, deprecations, and notable additions introduced in the Blade Spark update.

> NOTE: 
> This is a minor change, it doesn't introduce any breaking changes.
> 
> Though consumers may need to update snapshots & test cases in particular scenarios.


---

## Deprecated APIs

### Theme — Popup Color Tokens

The shorthand `popup.background.subtle`, `popup.background.intense`, `popup.border.subtle`, and `popup.border.intense` color tokens are **deprecated**. They are still functional but will be removed in a future major version.

**Migration:** Use the namespaced `popup.[background|border].[color]` form instead.

```ts
// Before (deprecated)
theme.colors.popup.background.subtle
theme.colors.popup.background.intense
theme.colors.popup.border.subtle
theme.colors.popup.border.intense

// After
theme.colors.popup.background.gray.subtle
theme.colors.popup.background.gray.intense
theme.colors.popup.border.gray.subtle
theme.colors.popup.border.gray.intense
```

---

### `Card` — `backgroundColor` prop

The `backgroundColor` prop on `Card` is **deprecated and is now a no-op**. `Card` always renders with `surface.background.gray.intense` as its background, regardless of the value passed. The prop will be removed in a future major version.

```tsx
// Before (deprecated — value was applied)
<Card backgroundColor="surface.background.gray.subtle">...</Card>

// After — prop is ignored, remove it
<Card>...</Card>
```

---

### `Card` — `elevation` prop

The `elevation` prop on `Card` is **deprecated and is now a no-op**. `Card` always uses its own custom elevation style. The prop will be removed in a future major version.

```tsx
// Before (deprecated — value was applied)
<Card elevation="midRaised">...</Card>

// After — prop is ignored, remove it
<Card>...</Card>
```

### `Card` — `borderRadius` prop

The `borderRadius` prop on `Card` is **deprecated and is now a no-op**. `Card` always uses `medium` borderRadius now. The prop will be removed in a future major version.

```tsx
// Before (deprecated — value was applied)
<Card borderRadius="small">...</Card>

// After — prop is ignored, remove it
<Card>...</Card>
```

---

## Visual Changes

### `TopNav` — Always Renders in Dark / Black Theme

`TopNav` now **always forces a dark color scheme** (`colorScheme="dark"`) internally, regardless of the app's active color scheme. Its background is always `interactive.background.staticBlack.default`, giving it a permanent black appearance.

Previously, `TopNav` would inherit the app's color scheme. Any customization of `TopNav`'s background color via props no longer has the same effect because the internal `BladeProvider` forces dark mode for all children.

**Impact:**
- All components rendered inside `TopNav` (buttons, icons, inputs, etc.) will always use dark-mode token values.
- Overlay components portalled *outside* `TopNav` (e.g. `Popover`, `Menu`, `Dropdown`) correctly reset back to the app's original color scheme using the new `TopNavOverlayThemeOverride` wrapper — no action needed for those.
- If you render a `SearchInput` or similar focusable input inside `TopNav`, it switches to the app's original color scheme on focus (handled automatically by `TopNavOverlayThemeOverride`).

**Migration:** Remove any manual `backgroundColor` or color-scheme overrides applied to `TopNav` or its children, as these are now managed internally.

```tsx
// Before — may have relied on inheriting app theme
<TopNav backgroundColor="surface.background.primary.intense">
  ...
</TopNav>

// After — TopNav is always dark/black; pass no background override
<TopNav>
  ...
</TopNav>
```

---

## New Additions

### Interactive Background — `ghost` State

A new `ghost` interactive state has been added to specific `interactive.background` color keys for transparent/invisible button backgrounds.

| Color Key | `ghost` State Available |
|---|---|
| `interactive.background.gray` | ✅ |
| `interactive.background.staticBlack` | ✅ |
| `interactive.background.staticWhite` | ✅ |

```ts
// Available via theme tokens
theme.colors.interactive.background.gray.ghost
theme.colors.interactive.background.staticBlack.ghost
theme.colors.interactive.background.staticWhite.ghost
```

---

### `theme.backdropBlur` Tokens

A new `backdropBlur` token category is now available in the theme for use with CSS `backdrop-filter: blur()`. This enables consistent glassmorphic effects across the design system.

| Token | Value | Usage |
|---|---|---|
| `theme.backdropBlur.low` | 4px | Subtle background blur |
| `theme.backdropBlur.medium` | 8px | Moderate background blur |
| `theme.backdropBlur.high` | 12px | Strong background blur |

```tsx
import { useTheme } from '@razorpay/blade/components';

const { theme } = useTheme();

// Use in styled components or inline styles
backdropFilter: `blur(${theme.backdropBlur.medium}px)`
```
