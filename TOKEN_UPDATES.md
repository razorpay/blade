# Design Token Updates

This document details all the design token updates made to the Blade design system.

## Table of Contents
- [Border Radius](#border-radius)
- [Elevation](#elevation)
- [Letter Spacing](#letter-spacing)
- [Line Height](#line-height)
- [Background Blur](#background-blur)

---

## Border Radius

**File:** `packages/blade/src/tokens/global/border.ts`

### Changes Summary

| Token | Old Value | New Value | Change |
|-------|-----------|-----------|--------|
| `none` | 0px | 0px | ✅ Unchanged |
| `2xsmall` | - | 2px | ➕ **New** |
| `xsmall` | 1px | 4px | 🔄 +3px |
| `small` | 2px | 8px | 🔄 +6px |
| `medium` | 4px | 12px | 🔄 +8px |
| `large` | 8px | 16px | 🔄 +8px |
| `xlarge` | 12px | 20px | 🔄 +8px |
| `2xlarge` | 16px | 24px | 🔄 +8px |
| `max` | 9999px | 9999px | ✅ Unchanged |
| `round` | 50% | 50% | ✅ Unchanged |

### Impact
- Added a new `2xsmall` token for smaller radius values
- All intermediate tokens have been increased to provide better visual hierarchy
- The `max` value remains unchanged at 9999px for fully rounded pill-shaped elements

---

## Elevation

### Web Elevation

**File:** `packages/blade/src/tokens/global/elevation/elevation.web.ts`

| Token | Property | Old Value | New Value | Change |
|-------|----------|-----------|-----------|--------|
| `lowRaised` | X offset | 0px | 0px | ✅ Unchanged |
| | Y offset | 2px | 2px | ✅ Unchanged |
| | Blur | 16px | 4px | 🔄 -12px |
| | Spread | 0px | 0px | ✅ Unchanged |
| `midRaised` | X offset | 0px | 0px | ✅ Unchanged |
| | Y offset | 8px | 2px | 🔄 -6px |
| | Blur | 24px | 8px | 🔄 -16px |
| | Spread | 0px | 0px | ✅ Unchanged |
| `highRaised` | X offset | 0px | 0px | ✅ Unchanged |
| | Y offset | 16px | 8px | 🔄 -8px |
| | Blur | 48px | 24px | 🔄 -24px |
| | Spread | -4px | -4px | ✅ Unchanged |

**CSS Box Shadow Format:**
```css
/* Old */
lowRaised: 0px 2px 16px 0px hsla(217, 56%, 17%, 0.10)
midRaised: 0px 8px 24px 0px hsla(217, 56%, 17%, 0.12)
highRaised: 0px 16px 48px -4px hsla(217, 56%, 17%, 0.18)

/* New */
lowRaised: 0px 2px 4px 0px hsla(217, 56%, 17%, 0.10)
midRaised: 0px 2px 8px 0px hsla(217, 56%, 17%, 0.12)
highRaised: 0px 8px 24px -4px hsla(217, 56%, 17%, 0.18)
```

### Native Elevation

**File:** `packages/blade/src/tokens/global/elevation/elevation.native.ts`

| Token | Property | Old Value | New Value | Change |
|-------|----------|-----------|-----------|--------|
| `lowRaised` | shadowRadius | 4 | 2 | 🔄 -2 |
| | shadowOffset.height | 2 | 2 | ✅ Unchanged |
| `midRaised` | shadowRadius | 6 | 4 | 🔄 -2 |
| | shadowOffset.height | 4 | 2 | 🔄 -2 |
| `highRaised` | shadowRadius | 14 | 12 | 🔄 -2 |
| | shadowOffset.height | 6 | 8 | 🔄 +2 |

**Note:** Changes applied to both `onLight` and `onDark` color modes.

### Impact
- Reduced blur radius across all elevation levels for sharper, more subtle shadows
- Adjusted Y offsets to create more consistent elevation hierarchy
- Creates a more refined and modern shadow system

---

## Letter Spacing

**File:** `packages/blade/src/tokens/global/typography.ts`

### Global Letter Spacing Tokens

| Token Name | Old Value | New Value | Change | Usage |
|------------|-----------|-----------|--------|-------|
| `global-ls-compressed` | - | -3.3% | ➕ **New** | Compressed text |
| `global-ls-condensed` | -1% | -1.3% | 🔄 -0.3% | Condensed text |
| `global-ls-normal` | 0% | 0% | ✅ Unchanged | Normal text |
| `global-ls-expanded` | 1% | 1.3% | ℹ️ Not implemented yet | Expanded text |
| `global-ls-extended` | 3% | 3.3% | ℹ️ Not implemented yet | Extended text |

### Letter Spacing Scale

**Desktop & Mobile (both platforms):**

| Token | Old Value | New Value | Change |
|-------|-----------|-----------|--------|
| `25` | - | -3.3 | ➕ **New** (compressed) |
| `50` | -1 | -1.3 | 🔄 -0.3 |
| `100` | 0 | 0 | ✅ Unchanged |

### Implementation Details

```typescript
// Type Definition
letterSpacings: {
  /** -3.3% */
  25: number;
  /** -1.3% */
  50: number;
  /** 0% */
  100: number;
}

// Values (onDesktop & onMobile)
letterSpacings: {
  25: -3.3,  // compressed
  50: -1.3,  // condensed
  100: 0,    // normal
}
```

### Impact
- Added new compressed letter spacing option for tighter text
- Fine-tuned condensed letter spacing for better readability
- Both desktop and mobile use the same letter spacing values

---

## Line Height

**File:** `packages/blade/src/tokens/global/typography.ts`

### Global Line Height Tokens

| Token Name | Value | Usage |
|------------|-------|-------|
| `global-lh-00` | 0px | No line height |
| `global-lh-13` | 13px | ➕ **New** - Compact text |
| `global-lh-14` | 14px | Small text |
| `global-lh-16` | 16px | Base text |
| `global-lh-17` | 17px | ➕ **New** - Medium text |
| `global-lh-18` | 18px | Standard text |
| `global-lh-20` | 20px | Large text |

### Line Height Scale Changes

#### Desktop (onDesktop)

| Token | Old Value | New Value | Global Token | Change |
|-------|-----------|-----------|--------------|--------|
| `0` | 0 | 0 | `global-lh-00` | ✅ Unchanged |
| `25` | 14 | 13 | `global-lh-13` | 🔄 -1px |
| `50` | 16 | 16 | `global-lh-16` | ✅ Unchanged |
| `75` | 18 | 17 | `global-lh-17` | 🔄 -1px |
| `100` | 20 | 20 | `global-lh-20` | ✅ Unchanged |
| `200+` | - | - | - | ✅ Unchanged |

#### Mobile (onMobile)

| Token | Old Value | New Value | Global Token | Change |
|-------|-----------|-----------|--------------|--------|
| `0` | 0 | 0 | `global-lh-00` | ✅ Unchanged |
| `25` | 14 | 13 | `global-lh-13` | 🔄 -1px |
| `50` | 16 | 16 | `global-lh-16` | ✅ Unchanged |
| `75` | 18 | 17 | `global-lh-17` | 🔄 -1px |
| `100` | 20 | 20 | `global-lh-20` | ✅ Unchanged |
| `200+` | - | - | - | ✅ Unchanged |

### Implementation Details

```typescript
// Type Definition
lineHeights: {
  /** desktop: 0(px/rem/pt), mobile: 0(px/rem/pt) */
  0: number;
  /** desktop: 13(px/rem/pt), mobile: 13(px/rem/pt) */
  25: number;
  /** desktop: 16(px/rem/pt), mobile: 16(px/rem/pt) */
  50: number;
  /** desktop: 17(px/rem/pt), mobile: 17(px/rem/pt) */
  75: number;
  /** desktop: 20(px/rem/pt), mobile: 20(px/rem/pt) */
  100: number;
  // ... higher values unchanged
}
```

### Impact
- Added two new global line height values (13px and 17px)
- Fine-tuned line heights for tokens 25 and 75 for better vertical rhythm
- Changes apply consistently across both desktop and mobile platforms
- Creates tighter, more precise typography spacing

---

## Background Blur

**Files:**
- `packages/blade/src/tokens/global/blur.ts` (new)
- `packages/blade/src/tokens/global/index.ts`
- `packages/blade/src/tokens/theme/theme.ts`
- `packages/blade/src/tokens/theme/bladeTheme.ts`

### New Tokens

| Token Name | Value | Usage |
|------------|-------|-------|
| `theme.backgroundBlur.low` | 4px | ➕ **New** - Subtle background blur effect |
| `theme.backgroundBlur.medium` | 8px | ➕ **New** - Moderate background blur effect |
| `theme.backgroundBlur.high` | 12px | ➕ **New** - Strong background blur effect |

### Implementation Details

```typescript
// Type Definition
export type BackgroundBlur = Readonly<{
  /** low: 4px - Subtle background blur effect */
  low: 4;
  /** medium: 8px - Moderate background blur effect */
  medium: 8;
  /** high: 12px - Strong background blur effect */
  high: 12;
}>;

// Values
export const backgroundBlur: BackgroundBlur = {
  low: 4,
  medium: 8,
  high: 12,
};
```

### Theme Integration

The `backgroundBlur` tokens are now available in the theme:

```typescript
const bladeTheme: ThemeTokens = {
  name: 'bladeTheme',
  border,
  backgroundBlur, // ← New
  breakpoints,
  colors,
  motion,
  spacing,
  elevation,
  typography,
};
```

### Impact
- New design token category for backdrop-filter blur effects
- Can be used with CSS `backdrop-filter: blur()` for glassmorphic UI elements
- Provides consistent blur values across the design system

---

## Summary

### Files Modified
1. `packages/blade/src/tokens/global/border.ts`
2. `packages/blade/src/tokens/global/elevation/elevation.web.ts`
3. `packages/blade/src/tokens/global/elevation/elevation.native.ts`
4. `packages/blade/src/tokens/global/typography.ts`
5. `packages/blade/src/tokens/global/blur.ts` (new)
6. `packages/blade/src/tokens/global/index.ts`
7. `packages/blade/src/tokens/theme/theme.ts`
8. `packages/blade/src/tokens/theme/bladeTheme.ts`

### Key Changes
- **Border Radius**: Added new `2xsmall` token, increased values across the scale for better visual hierarchy
- **Elevation**: Reduced blur radius and adjusted offsets for more refined shadows
- **Letter Spacing**: Added compressed option, fine-tuned condensed spacing
- **Line Height**: Added two new values, adjusted scale for better vertical rhythm
- **Background Blur**: Added new token category with three blur levels (low, medium, high)

### Migration Notes
- Components using `border.radius.xsmall` through `border.radius.2xlarge` will see increased radius values
- Shadows will appear sharper and more subtle
- Text with letter spacing tokens will be slightly more compressed
- Line heights for smaller text sizes will be tighter
- New `theme.backgroundBlur` tokens are now available for glassmorphic effects

---

**Date:** 2026-01-30
**Version:** Blade Design System Token Update
