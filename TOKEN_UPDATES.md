# Design Token Updates

This document details all the design token updates made to the Blade design system.

## Table of Contents
- [Opacity](#opacity)
- [Interactive Color States](#interactive-color-states)
- [Border Radius](#border-radius)
- [Elevation](#elevation)
- [Letter Spacing](#letter-spacing)
- [Line Height](#line-height)
- [Background Blur](#background-blur)

---

## Opacity

**File:** `packages/blade/src/tokens/global/opacity.ts`

### Changes Summary

| Token | Old Value | New Value | Change |
|-------|-----------|-----------|--------|
| `0` | 0.0 | 0.0 | ✅ Unchanged |
| `1` | - | 0.01 | ➕ **New** |
| `50` | 0.06 | 0.06 | ✅ Unchanged |
| `100` | 0.09 | 0.09 | ✅ Unchanged |
| `200` | 0.12 | 0.12 | ✅ Unchanged |
| `300` | 0.18 | 0.18 | ✅ Unchanged |
| `400` | 0.24 | 0.24 | ✅ Unchanged |
| `500` | 0.32 | 0.32 | ✅ Unchanged |
| `600` | 0.48 | 0.48 | ✅ Unchanged |
| `700` | 0.56 | 0.56 | ✅ Unchanged |
| `800` | 0.64 | 0.64 | ✅ Unchanged |
| `900` | 0.72 | 0.72 | ✅ Unchanged |
| `1000` | 0.8 | 0.8 | ✅ Unchanged |
| `1100` | 0.88 | 0.88 | ✅ Unchanged |
| `1200` | 1.0 | 0.94 | 🔄 -0.06 |
| `1300` | - | 1.0 | ➕ **New** |

### Implementation Details

```typescript
export const opacity: Opacity = {
  0: 0.0,
  1: 0.01,    // New - 1% opacity
  50: 0.06,
  100: 0.09,
  200: 0.12,
  300: 0.18,
  400: 0.24,
  500: 0.32,
  600: 0.48,
  700: 0.56,
  800: 0.64,
  900: 0.72,
  1000: 0.8,
  1100: 0.88,
  1200: 0.94,  // Changed from 1.0
  1300: 1.0,   // New - full opacity
};
```

### Impact
- Added new `1` token for 1% opacity (used for ghost/invisible states)
- Added new `1300` token for full opacity (100%)
- `1200` now represents 94% opacity instead of 100%
- Components using `opacity[1200]` for full opacity should be updated to use `opacity[1300]`

---

## Interactive Color States

**Files:**
- `packages/blade/src/tokens/theme/theme.ts`
- `packages/blade/src/tokens/theme/bladeTheme.ts`

### New Interactive Background States

Added `ghost` state to specific interactive background colors for transparent/invisible button states.

| Color Key | States Added |
|-----------|--------------|
| `gray` | `ghost` |
| `staticBlack` | `ghost` |
| `staticWhite` | `ghost` |

### Interactive Border States Update

`fadedHighlighted` state is only present on specific border colors:

| Color Key | Has `fadedHighlighted` |
|-----------|------------------------|
| `positive` | ❌ No |
| `negative` | ❌ No |
| `notice` | ❌ No |
| `information` | ❌ No |
| `neutral` | ❌ No |
| `gray` | ❌ No |
| `primary` | ❌ No |
| `staticWhite` | ✅ Yes |
| `staticBlack` | ✅ Yes |

### Type Definitions

```typescript
// New types added to theme.ts
type InteractiveStatesWithFadedHighlighted = InteractiveStates & {
  fadedHighlighted: string;
};

type InteractiveBackgroundStatesWithGhost = InteractiveStatesWithFadedHighlighted & {
  ghost: string;
};

type InteractiveBackgroundColorsWithGhost = 'gray' | 'staticBlack' | 'staticWhite';

type InteractiveBorderColorsWithFadedHighlighted = 'staticBlack' | 'staticWhite';
```

### Usage in bladeTheme.ts

```typescript
// interactive.background.gray (onLight)
gray: {
  default: globalColors.neutral.blueGrayLight.a906,
  highlighted: globalColors.neutral.blueGrayLight.a912,
  disabled: globalColors.neutral.blueGrayLight.a909,
  faded: globalColors.neutral.blueGrayLight.a906,
  fadedHighlighted: globalColors.neutral.blueGrayLight.a909,
  ghost: globalColors.neutral.blueGrayLight.a1  // New ghost state
}

// interactive.border.staticWhite (onLight)
staticWhite: {
  default: globalColors.neutral.white[500],
  highlighted: globalColors.neutral.white[400],
  disabled: globalColors.neutral.white[100],
  faded: globalColors.neutral.white[50],
  fadedHighlighted: globalColors.neutral.white[100]  // Only on staticWhite/staticBlack
}
```

### Impact
- New `ghost` state available for transparent button backgrounds
- Type system now correctly reflects which color keys have which states
- Improved type safety for interactive color token usage

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
| `theme.backdropBlur.low` | 4px | ➕ **New** - Subtle background blur effect |
| `theme.backdropBlur.medium` | 8px | ➕ **New** - Moderate background blur effect |
| `theme.backdropBlur.high` | 12px | ➕ **New** - Strong background blur effect |

### Implementation Details

```typescript
// Type Definition
export type BackdropBlur = Readonly<{
  /** low: 4px - Subtle background blur effect */
  low: 4;
  /** medium: 8px - Moderate background blur effect */
  medium: 8;
  /** high: 12px - Strong background blur effect */
  high: 12;
}>;

// Values
export const backdropBlur: BackdropBlur = {
  low: 4,
  medium: 8,
  high: 12,
};
```

### Theme Integration

The `backdropBlur` tokens are now available in the theme:

```typescript
const bladeTheme: ThemeTokens = {
  name: 'bladeTheme',
  border,
  backdropBlur, // ← New
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
6. `packages/blade/src/tokens/global/opacity.ts`
7. `packages/blade/src/tokens/global/index.ts`
8. `packages/blade/src/tokens/theme/theme.ts`
9. `packages/blade/src/tokens/theme/bladeTheme.ts`

### Key Changes
- **Opacity**: Added new `1` token (1% opacity) and `1300` token (full opacity), changed `1200` from 100% to 94%
- **Interactive Color States**: Added `ghost` state for transparent backgrounds, updated type definitions for accurate state representation
- **Border Radius**: Added new `2xsmall` token, increased values across the scale for better visual hierarchy
- **Elevation**: Reduced blur radius and adjusted offsets for more refined shadows
- **Letter Spacing**: Added compressed option, fine-tuned condensed spacing
- **Line Height**: Added two new values, adjusted scale for better vertical rhythm
- **Background Blur**: Added new token category with three blur levels (low, medium, high)

### Migration Notes
- Components using `opacity[1200]` for full opacity should update to `opacity[1300]`
- New `opacity[1]` (1% opacity) available for ghost/invisible states
- New `ghost` state available on `interactive.background.gray`, `interactive.background.staticBlack`, and `interactive.background.staticWhite`
- `fadedHighlighted` on `interactive.border` is only available for `staticWhite` and `staticBlack`
- Components using `border.radius.xsmall` through `border.radius.2xlarge` will see increased radius values
- Shadows will appear sharper and more subtle
- Text with letter spacing tokens will be slightly more compressed
- Line heights for smaller text sizes will be tighter
- New `theme.backdropBlur` tokens are now available for glassmorphic effects

---

**Date:** 2026-02-03
**Version:** Blade Design System Token Update
