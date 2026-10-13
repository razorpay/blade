# Blade Design Tokens

Token documentation covers the design tokens that power Blade's visual system — spacing, color, typography, motion, and more.

---

# Token Architecture

## Overview

Blade uses a **two-tier token architecture** to maintain a consistent design language across web and React Native platforms.

### Tier 1: Global Tokens (Raw Values)

Global tokens are foundational, context-free values. They define the raw design scales:

- **Spacing** — A 12-step numeric scale (0–56px)
- **Border** — Radius and width values
- **Breakpoints** — 6 responsive breakpoints (0–1200px)
- **Opacity** — 14-step opacity scale (0.0–1.0)
- **Motion** — Duration, delay, and easing curves
- **Typography** — Font sizes, weights, line heights, letter spacings, font families
- **Colors** — 11 chromatic palettes, 4 neutral palettes, static black/white
- **Elevation** — Shadow definitions for 4 elevation levels

### Tier 2: Theme/Semantic Tokens (Contextual Meanings)

Theme tokens map global values to **semantic purposes** and support light/dark modes:

- **Interactive colors** — For buttons, links, and actionable elements
- **Feedback colors** — For alerts, banners, and status messages
- **Surface colors** — For backgrounds, borders, and text on non-interactive surfaces
- **Overlay/Popup colors** — For modals, drawers, and tooltips
- **Data colors** — For charts and data visualization

## ThemeTokens Shape

The `ThemeTokens` object (provided to `BladeProvider`) has this top-level structure:

```ts
ThemeTokens = {
  name: string;           // "bladeTheme" or custom
  border: { radius, width }
  breakpoints: { base, xs, s, m, l, xl }
  colors: { onLight: {...}, onDark: {...} }
  motion: { duration, delay, easing }
  elevation: { onLight: {...}, onDark: {...} }
  spacing: { 0, 1, 2, ..., 11 }
  typography: { onDesktop: {...}, onMobile: {...}, fonts: {...} }
}
```

## Accessing Tokens

### In styled-components (full path via theme object)

```ts
const StyledDiv = styled.div(
  ({ theme }: { theme: Theme }) => `
    background-color: ${theme.colors.surface.background.gray.moderate};
    padding: ${theme.spacing[5]}px;
    border-radius: ${theme.border.radius.medium}px;
  `
);
```

### In component props (string token format)

Blade components accept string tokens for spacing, color, and other props:

```jsx
<Box
  padding="spacing.5"
  backgroundColor="surface.background.gray.moderate"
  borderRadius="medium"
/>
```

### Responsive props

Use object syntax with breakpoint keys for responsive values:

```jsx
<Box padding={{ base: 'spacing.3', m: 'spacing.5', xl: 'spacing.7' }} />
```

## Key Principles

| Principle | Description |
|---|---|
| **Use semantic tokens for colors** | Always use `theme.colors.surface.*`, `theme.colors.interactive.*`, etc. Never hardcode color values. |
| **Global tokens for spacing/border/motion** | Spacing, border, and motion tokens are shared across light/dark modes — access them directly. |
| **Platform-aware** | Typography and elevation have platform-specific values (desktop/mobile, web/native). Blade components handle this automatically. |
| **Never hardcode values** | Always reference tokens so updates propagate automatically. |

## Imports

```ts
import { bladeTheme } from '@razorpay/blade/tokens';
import { BladeProvider } from '@razorpay/blade/components';
```

---

# Theming Guide

## BladeProvider Setup

Every Blade application must be wrapped with `BladeProvider`:

```jsx
import { BladeProvider } from '@razorpay/blade/components';
import { bladeTheme } from '@razorpay/blade/tokens';

function App() {
  return (
    <BladeProvider themeTokens={bladeTheme} colorScheme="light">
      <YourApp />
    </BladeProvider>
  );
}
```

## Color Scheme

The `colorScheme` prop controls light/dark mode:

| Value | Behavior |
|---|---|
| `"light"` | Light mode |
| `"dark"` | Dark mode |
| `"system"` | Follows OS preference |

```jsx
<BladeProvider themeTokens={bladeTheme} colorScheme="dark">
  <App />
</BladeProvider>
```

### Nested BladeProvider for mixed modes

If a section needs a different color scheme (e.g., dark section on a light page), wrap it in another `BladeProvider`:

```jsx
<BladeProvider themeTokens={bladeTheme} colorScheme="light">
  <MainContent />
  <BladeProvider themeTokens={bladeTheme} colorScheme="dark">
    <DarkSection />
  </BladeProvider>
</BladeProvider>
```

Avoid unnecessary nesting — only use this when genuinely needed.

## How Theme Token Resolution Works

When `colorScheme="light"`, Blade resolves `theme.colors` from `theme.colors.onLight`. When `colorScheme="dark"`, it resolves from `theme.colors.onDark`. Consumers never need to specify `onLight`/`onDark` — they access `theme.colors.surface.*` and the correct values are provided automatically.

Similarly, `theme.elevation` resolves from `onLight` or `onDark` based on the active color scheme.

Tokens that are mode-independent (spacing, border, breakpoints, motion, typography) are the same in both modes.

## Accessing Tokens

### In styled-components

```ts
const StyledCard = styled.div(
  ({ theme }: { theme: Theme }) => `
    background-color: ${theme.colors.surface.background.gray.moderate};
    color: ${theme.colors.surface.text.gray.normal};
    padding: ${theme.spacing[5]}px;
    border-radius: ${theme.border.radius.large}px;
    transition: background-color ${theme.motion.duration.quick}ms ${theme.motion.easing.standard};
  `
);
```

### In Blade component props (string tokens)

```jsx
<Box
  backgroundColor="surface.background.gray.subtle"
  padding="spacing.5"
  borderRadius="medium"
  display="flex"
  gap="spacing.4"
/>
```

### useTheme hook

```ts
import { useTheme } from '@razorpay/blade/components';

const { theme } = useTheme();
const bgColor = theme.colors.surface.background.gray.moderate;
```

## Custom Themes (White Labelling)

For non-Razorpay brands, use `createTheme()` to generate a custom theme from a brand color. See the **WhiteLabelling** documentation for details on `createTheme()` API and usage.

---

# Color Tokens

## Overview

Blade's color system has two layers:
1. **Global color palettes** — Raw color scales (reference only, not for direct use)
2. **Semantic theme colors** — Contextual meanings that adapt to light/dark mode (always use these)

## Semantic Color Categories

### Interactive Colors (`theme.colors.interactive.*`)

For buttons, links, and actionable elements. Each has `background`, `border`, `text`, and `icon` sub-tokens.

**Color variants:** `primary`, `gray`, `positive`, `negative`, `notice`, `information`, `neutral`, `staticBlack`, `staticWhite`

**States:** `default`, `highlighted` (hover/focus), `disabled`, `faded`, `fadedHighlighted`

```ts
// Button background
theme.colors.interactive.background.primary.default
theme.colors.interactive.background.primary.highlighted  // hover state
theme.colors.interactive.background.primary.disabled

// Link text
theme.colors.interactive.text.primary.default
theme.colors.interactive.text.gray.default

// Icon in actionable context
theme.colors.interactive.icon.primary.default

// Text/icon on primary background
theme.colors.interactive.text.onPrimary.default
theme.colors.interactive.icon.onPrimary.default
```

### Feedback Colors (`theme.colors.feedback.*`)

For alerts, banners, toasts, and status messages. Each has `background`, `border`, `text`, and `icon` sub-tokens.

**Types:** `positive`, `negative`, `notice`, `information`, `neutral`

**Intensities:** `subtle`, `intense`

```ts
// Success banner
theme.colors.feedback.background.positive.subtle
theme.colors.feedback.border.positive.subtle
theme.colors.feedback.text.positive.subtle
theme.colors.feedback.icon.positive.subtle

// Error alert (strong emphasis)
theme.colors.feedback.background.negative.intense
theme.colors.feedback.text.negative.intense
```

### Surface Colors (`theme.colors.surface.*`)

For non-interactive backgrounds, borders, and text.

**Backgrounds:**

| Token Path | Use Case |
|---|---|
| `surface.background.gray.subtle` | Lightest background (e.g., page background) |
| `surface.background.gray.moderate` | Card backgrounds, secondary surfaces |
| `surface.background.gray.intense` | Emphasized backgrounds |
| `surface.background.primary.subtle` | Primary-tinted subtle background |
| `surface.background.primary.intense` | Primary-tinted strong background |
| `surface.background.sea` | Sea-tinted background |
| `surface.background.cloud` | Cloud-tinted background |

**Borders:**

| Token Path | Use Case |
|---|---|
| `surface.border.gray.normal` | Standard borders |
| `surface.border.gray.subtle` | Light borders |
| `surface.border.gray.muted` | Very subtle borders |
| `surface.border.primary.normal` | Primary-colored borders |
| `surface.border.primary.muted` | Subtle primary borders |

**Text & Icons:**

| Token Path | Use Case |
|---|---|
| `surface.text.gray.normal` | Primary text |
| `surface.text.gray.subtle` | Secondary text |
| `surface.text.gray.muted` | Tertiary/placeholder text |
| `surface.text.gray.disabled` | Disabled text |
| `surface.text.primary.normal` | Primary-colored text |
| `surface.text.staticWhite.normal` | White text (mode-independent) |
| `surface.text.staticBlack.normal` | Black text (mode-independent) |
| `surface.text.onSea.onSubtle` | Text on sea background |
| `surface.text.onCloud.onSubtle` | Text on cloud background |
| `surface.icon.gray.normal` | Standard icons |
| `surface.icon.gray.subtle` | Secondary icons |
| `surface.icon.gray.muted` | Tertiary icons |
| `surface.icon.gray.disabled` | Disabled icons |
| `surface.icon.primary.normal` | Primary-colored icons |
| `surface.icon.staticWhite.normal` | White icons (mode-independent) |
| `surface.icon.staticBlack.normal` | Black icons (mode-independent) |

### Overlay & Popup Colors

```ts
// Overlay (behind modals/drawers)
theme.colors.overlay.background.moderate   // Standard overlay
theme.colors.overlay.background.subtle     // Light overlay

// Popup surfaces (tooltips, popovers)
theme.colors.popup.background.subtle
theme.colors.popup.background.intense
theme.colors.popup.border.subtle
theme.colors.popup.border.intense
```

### Transparent

```ts
theme.colors.transparent   // Fully transparent
```

### Data Colors

For charts and data visualization — see **ChartColorSystem** documentation for full details.

## Light/Dark Mode

All color tokens exist in both `onLight` and `onDark` variants. The active mode is determined by the `colorScheme` prop on `BladeProvider`. Consumers access `theme.colors.surface.*` (without specifying the mode) and the correct values resolve automatically.

## Usage Examples

### In component props (string tokens)

```jsx
<Box backgroundColor="surface.background.gray.moderate">
  <Text color="surface.text.gray.normal">Primary text</Text>
  <Text color="surface.text.gray.subtle">Secondary text</Text>
</Box>
```

### In styled-components

```ts
const StyledCard = styled.div(
  ({ theme }: { theme: Theme }) => `
    background-color: ${theme.colors.surface.background.gray.moderate};
    border: 1px solid ${theme.colors.surface.border.gray.normal};
    color: ${theme.colors.surface.text.gray.normal};
  `
);
```

## Global Color Palettes (Reference)

These are the raw palettes that semantic tokens map to. **Do not use these directly** — always use semantic tokens above.

**11 Chromatic palettes:** azure, emerald, crimson, cider, sapphire, sea, cloud, forest, orchid, magenta, topaz
- Each has scales: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000
- Plus alpha variants: a50, a100, a150, a200, a400

**4 Neutral palettes:** blueGrayLight, blueGrayDark, ashGrayLight, ashGrayDark
- Each has scales: 0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300
- Plus alpha variants: a25, a50, a75, a100, a200, a400

**Static palettes:** white (10–500), black (10–500) — opacity-based variants

All global colors use HSLA format.

---

# Typography Tokens

## Font Families

| Category | Web | React Native (iOS) | React Native (Android) |
|---|---|---|---|
| Text | Inter | Inter | Inter |
| Heading | TASA Orbiter | TASA Orbiter Display | TASA Orbiter Display |
| Code | Menlo | Menlo | monospace |

## Font Weights

| Token | Value |
|---|---|
| `regular` | 400 |
| `medium` | 500 |
| `semibold` | 600 |
| `bold` | 700 |

## Font Sizes

Platform-responsive values. Smaller sizes (25–200) are identical across platforms; divergence starts at scale 300+.

| Scale | Desktop (px) | Mobile (px) |
|---|---|---|
| 25 | 10 | 10 |
| 50 | 11 | 11 |
| 75 | 12 | 12 |
| 100 | 14 | 14 |
| 200 | 16 | 16 |
| 300 | 18 | 16 |
| 400 | 20 | 18 |
| 500 | 24 | 20 |
| 600 | 32 | 24 |
| 700 | 40 | 32 |
| 800 | 48 | 34 |
| 900 | 56 | 36 |
| 1000 | 64 | 38 |
| 1100 | 72 | 40 |

## Line Heights

| Scale | Desktop (px) | Mobile (px) |
|---|---|---|
| 0 | 0 | 0 |
| 25 | 14 | 14 |
| 50 | 16 | 16 |
| 75 | 18 | 18 |
| 100 | 20 | 20 |
| 200 | 24 | 24 |
| 300 | 24 | 22 |
| 400 | 26 | 24 |
| 500 | 32 | 26 |
| 600 | 38 | 32 |
| 700 | 46 | 38 |
| 800 | 56 | 40 |
| 900 | 64 | 42 |
| 1000 | 70 | 46 |
| 1100 | 78 | 48 |

## Letter Spacings

| Scale | Value |
|---|---|
| 50 | -1% |
| 100 | 0% |

## Accessing Typography Tokens

### In styled-components

```ts
const StyledText = styled.span(
  ({ theme }: { theme: Theme }) => `
    font-size: ${theme.typography.onDesktop.fonts.size[200]}px;
    line-height: ${theme.typography.onDesktop.lineHeights[200]}px;
    font-weight: ${theme.typography.fonts.weight.medium};
  `
);
```

### Using Blade typography components (recommended)

Blade provides `Text`, `Heading`, `Display`, and `Code` components that automatically handle:
- Platform detection (desktop vs mobile sizes)
- Correct font family selection
- Proper line height pairing
- Responsive sizing

```jsx
<Heading size="large">Page Title</Heading>
<Text size="medium" weight="semibold">Bold body text</Text>
<Text size="small" color="surface.text.gray.subtle">Secondary text</Text>
<Code size="medium">const x = 42;</Code>
```

Using Blade typography components is strongly preferred over manually accessing typography tokens, as they handle platform-specific sizing automatically.

---

# Font Family Tokens

## Font Families

| Category | Web | React Native (iOS) | React Native (Android) |
|---|---|---|---|
| Text | Inter (with fallbacks) | Inter | Inter |
| Heading | TASA Orbiter (with fallbacks) | TASA Orbiter Display | TASA Orbiter Display |
| Code | Menlo + mono fallback stack | Menlo | monospace |

## Token Paths

- `theme.typography.fonts.family.text`
- `theme.typography.fonts.family.heading`
- `theme.typography.fonts.family.code`

## Usage

### In styled-components

```ts
const StyledHeading = styled.h2(
  ({ theme }: { theme: Theme }) => `
    font-family: ${theme.typography.fonts.family.heading};
  `
);
```

### In text components (recommended)

Blade `Text`, `Heading`, and `Code` components automatically choose the correct font family for the context and platform.

```jsx
<Heading size="large">Title</Heading>
<Text size="medium">Body content</Text>
<Code size="small">const x = 42;</Code>
```

## Notes

- Web font fallbacks are defined to avoid layout shifts before custom fonts load.
- React Native uses platform-specific values for `code` font (`Menlo` on iOS, `monospace` on Android).

---

# Spacing Tokens

## Scale

Blade uses a 12-step spacing scale built on a 4px base grid. Values are in pixels.

| Token | Value (px) | Common Use |
|---|---|---|
| `spacing.0` | 0 | No spacing |
| `spacing.1` | 2 | Hairline gaps |
| `spacing.2` | 4 | Tight inner spacing |
| `spacing.3` | 8 | Small padding, icon gaps |
| `spacing.4` | 12 | Medium-small padding |
| `spacing.5` | 16 | Standard padding |
| `spacing.6` | 20 | Medium padding |
| `spacing.7` | 24 | Section padding |
| `spacing.8` | 32 | Large section padding |
| `spacing.9` | 40 | Extra-large spacing |
| `spacing.10` | 48 | Page-level spacing |
| `spacing.11` | 56 | Maximum spacing |

## Usage

### In Blade component props (string tokens)

```jsx
<Box padding="spacing.5" marginBottom="spacing.3" gap="spacing.4">
  <Text>Content</Text>
</Box>
```

### In styled-components

```ts
const StyledDiv = styled.div(
  ({ theme }: { theme: Theme }) => `
    padding: ${theme.spacing[5]}px;
    margin-bottom: ${theme.spacing[3]}px;
    gap: ${theme.spacing[4]}px;
  `
);
```

### Responsive spacing

Use object syntax with breakpoint keys:

```jsx
<Box
  padding={{ base: 'spacing.3', m: 'spacing.5', xl: 'spacing.7' }}
  gap={{ base: 'spacing.2', m: 'spacing.4' }}
>
  <Text>Responsive content</Text>
</Box>
```

- `base` applies to all screen sizes (mobile-first)
- `m` (768px+) overrides for tablets and desktop
- `xl` (1200px+) overrides for HD desktop

## Design Rationale

- Most values are multiples of 4px, aligning with a 4pt grid system
- The scale provides consistent visual rhythm across all components
- `spacing.5` (16px) is the most commonly used standard padding value

---

# Breakpoint Tokens

## Values

Blade uses a mobile-first responsive system with 6 breakpoints.

| Token | Value (px) | Min-Width Query | Target Devices |
|---|---|---|---|
| `base` | 0 | None (default) | All devices |
| `xs` | 320 | `@media (min-width: 320px)` | Small mobiles |
| `s` | 480 | `@media (min-width: 480px)` | Mobiles, small tablets |
| `m` | 768 | `@media (min-width: 768px)` | Tablets, desktop |
| `l` | 1024 | `@media (min-width: 1024px)` | Desktop |
| `xl` | 1200 | `@media (min-width: 1200px)` | HD desktop |

## Mobile-First Approach

`base` styles apply to all screen sizes. Larger breakpoints **override** base styles at their min-width threshold. You only need to specify breakpoints where the layout changes.

## Responsive Props in Blade Components

Most layout-related props on `Box` and other components accept responsive objects:

```jsx
<Box
  padding={{ base: 'spacing.3', m: 'spacing.5', xl: 'spacing.7' }}
  display={{ base: 'flex', m: 'grid' }}
  flexDirection={{ base: 'column', m: 'row' }}
  gap={{ base: 'spacing.3', m: 'spacing.5' }}
>
  <Text size={{ base: 'small', m: 'medium' }}>Responsive text</Text>
</Box>
```

This translates to:
- **< 768px (mobile):** padding 8px, flex column, gap 8px, small text
- **768px–1199px (tablet/desktop):** padding 16px, grid row, gap 16px, medium text
- **1200px+ (HD desktop):** padding 24px (inherits grid row and gap from `m`)

## Best Practices

| Guideline | Details |
|---|---|
| **Use `m` as the mobile/desktop divider** | Most layouts need only `base` and `m` breakpoints |
| **Start from `base`** | Always define `base` styles first, then override at larger sizes |
| **Don't over-specify** | Only add breakpoints where the design actually changes |
| **Avoid `xs`** | Rarely needed; `base` covers most small-screen scenarios |

## Accessing in styled-components

```ts
const StyledLayout = styled.div(
  ({ theme }: { theme: Theme }) => `
    padding: ${theme.spacing[3]}px;

    @media (min-width: ${theme.breakpoints.m}px) {
      padding: ${theme.spacing[5]}px;
    }

    @media (min-width: ${theme.breakpoints.xl}px) {
      padding: ${theme.spacing[7]}px;
    }
  `
);
```

---

# Motion Tokens

## Duration

Controls how long an animation takes to complete.

| Token | Value (ms) | Use Case |
|---|---|---|
| `duration.2xquick` | 80 | Micro-interactions, button feedback |
| `duration.xquick` | 160 | Small transitions, icon changes |
| `duration.quick` | 200 | Standard hover effects, small reveals |
| `duration.moderate` | 280 | Medium transitions, panel slides |
| `duration.xmoderate` | 360 | Complex transitions |
| `duration.gentle` | 480 | Large reveals, page transitions |
| `duration.xgentle` | 640 | Elaborate animations |
| `duration.2xgentle` | 960 | Full-screen transitions |

## Delay

Controls wait time before an animation starts.

| Token | Value (ms) | Use Case |
|---|---|---|
| `delay.2xquick` | 80 | Minimal delay |
| `delay.xquick` | 160 | Short stagger |
| `delay.moderate` | 280 | Standard delay |
| `delay.gentle` | 480 | Noticeable pause |
| `delay.xgentle` | 960 | Long pause |
| `delay.long` | 2000 | Tooltip hover delay |
| `delay.xlong` | 3000 | Notification auto-dismiss |
| `delay.2xlong` | 5000 | Long auto-dismiss |

## Easing

Controls the acceleration curve of animations.

| Token | CSS Value | Use Case |
|---|---|---|
| `easing.linear` | `cubic-bezier(0, 0, 0, 0)` | Marquee, progress bars, continuous animations |
| `easing.entrance` | `cubic-bezier(0, 0, 0.2, 1)` | Entry of modals, drawers, dropdowns |
| `easing.exit` | `cubic-bezier(0.17, 0, 1, 1)` | Exit/dismissal of modals, drawers, dropdowns |
| `easing.standard` | `cubic-bezier(0.3, 0, 0.2, 1)` | Morph transitions, general state changes |
| `easing.emphasized` | `cubic-bezier(0.5, 0, 0, 1)` | Hover states, focused attention |
| `easing.overshoot` | `cubic-bezier(0.5, 0, 0.3, 1.5)` | Toast notifications, bouncy entries |
| `easing.shake` | `cubic-bezier(1, 0.5, 0, 0.5)` | Error shake, invalid input feedback |

## Platform Differences

- **Web:** Easing values are CSS `cubic-bezier()` strings
- **React Native:** Easing values are `EasingFactoryFn` from `react-native-reanimated`

Duration and delay values are plain numbers (milliseconds) on both platforms.

## Usage

### In styled-components

```ts
const StyledCard = styled.div(
  ({ theme }: { theme: Theme }) => `
    transition: transform ${theme.motion.duration.quick}ms ${theme.motion.easing.standard},
                opacity ${theme.motion.duration.quick}ms ${theme.motion.easing.standard};
  `
);
```

### In Blade animation components

Blade provides animation components (`Fade`, `Slide`, `Move`, `Scale`, `Stagger`, `Morph`) that use motion tokens internally. Prefer these over manual CSS transitions when possible.

```jsx
<Fade motionTriggers={['mount']}>
  <Card>Content appears with fade</Card>
</Fade>
```

### String token format

Motion tokens can be referenced as strings in animation component props:

- `"duration.quick"`
- `"easing.entrance"`
- `"delay.moderate"`

---

# Border Tokens

## Border Radius

| Token | Value | Use Case |
|---|---|---|
| `border.radius.none` | 0 | No rounding |
| `border.radius.xsmall` | 1px | Hairline rounding |
| `border.radius.small` | 2px | Subtle rounding |
| `border.radius.medium` | 4px | Standard rounding (inputs, small cards) |
| `border.radius.large` | 8px | Prominent rounding (cards, containers) |
| `border.radius.xlarge` | 12px | Large rounding (modals, panels) |
| `border.radius.2xlarge` | 16px | Extra-large rounding |
| `border.radius.max` | 9999px | Pill shape (badges, chips) |
| `border.radius.round` | 50% | Perfect circle (avatars) |

## Border Width

| Token | Value | Use Case |
|---|---|---|
| `border.width.none` | 0 | No border |
| `border.width.thinner` | 0.5px | Hairline border |
| `border.width.thin` | 1px | Standard border |
| `border.width.thick` | 1.5px | Emphasized border |
| `border.width.thicker` | 2px | Heavy border (focused inputs) |

## Usage

### In styled-components

```ts
const StyledCard = styled.div(
  ({ theme }: { theme: Theme }) => `
    border-radius: ${theme.border.radius.large}px;
    border: ${theme.border.width.thin}px solid ${theme.colors.surface.border.gray.normal};
  `
);
```

### In Box component props

```jsx
<Box borderRadius="medium" borderWidth="thin" borderColor="surface.border.gray.normal">
  <Text>Card content</Text>
</Box>
```

---

# Elevation Tokens

Elevation tokens control shadow depth for layered surfaces. Four levels are available.

## Web (box-shadow values)

**Light mode:**

| Token | Value |
|---|---|
| `elevation.none` | `none` |
| `elevation.lowRaised` | `0px 2px 16px 0px hsla(217, 56%, 17%, 0.10)` |
| `elevation.midRaised` | `0px 8px 24px 0px hsla(217, 56%, 17%, 0.12)` |
| `elevation.highRaised` | `0px 16px 48px -4px hsla(217, 56%, 17%, 0.18)` |

## React Native (shadow properties)

| Token | elevation | shadowOpacity | shadowRadius | shadowOffset |
|---|---|---|---|---|
| `none` | 0 | 0 | 0 | {0, 0} |
| `lowRaised` | 8 | 0.2 | 4 | {0, 2} |
| `midRaised` | 16 | 0.17 | 6 | {0, 4} |
| `highRaised` | 24 | 0.16 | 14 | {0, 6} |

Elevation tokens support `onLight`/`onDark` mode variants, resolved automatically by `BladeProvider`.

## Usage

Prefer the `Elevate` component for applying elevation:

```jsx
import { Elevate } from '@razorpay/blade/components';

<Elevate elevation="midRaised">
  <Card>Elevated card content</Card>
</Elevate>
```

In styled-components:

```ts
const StyledCard = styled.div(
  ({ theme }: { theme: Theme }) => `
    box-shadow: ${theme.elevation.midRaised};
  `
);
```

---

# Opacity Tokens

## Scale

A 14-step opacity scale used primarily by the color system internally.

| Token | Value |
|---|---|
| `opacity[0]` | 0.0 |
| `opacity[50]` | 0.06 |
| `opacity[100]` | 0.09 |
| `opacity[200]` | 0.12 |
| `opacity[300]` | 0.18 |
| `opacity[400]` | 0.24 |
| `opacity[500]` | 0.32 |
| `opacity[600]` | 0.48 |
| `opacity[700]` | 0.56 |
| `opacity[800]` | 0.64 |
| `opacity[900]` | 0.72 |
| `opacity[1000]` | 0.8 |
| `opacity[1100]` | 0.88 |
| `opacity[1200]` | 1.0 |

## How Opacity Tokens Are Used

Opacity tokens are **primarily internal** — they are used by the color system to generate alpha color variants (e.g., `azure.a50` uses `opacity[100]` = 0.09 as the alpha channel).

Consumers typically do not access opacity tokens directly. Instead, use:
- **Color tokens** with built-in opacity (e.g., `interactive.background.primary.faded`)
- **Overlay tokens** (e.g., `overlay.background.subtle`) which already incorporate correct opacity
- CSS `opacity` property directly when you need to fade an entire element

---

# Blur Tokens

## Scale

Blade currently exposes a backdrop blur scale with 3 levels:

| Token | Value (px) | Use Case |
|---|---|---|
| `backdropBlur.low` | 4 | Subtle backdrop blur |
| `backdropBlur.medium` | 8 | Moderate backdrop blur |
| `backdropBlur.high` | 12 | Strong backdrop blur |

## Usage

Blur tokens are intended for backdrop and frosted-surface effects.

### In styled-components

```ts
const StyledOverlay = styled.div(
  ({ theme }: { theme: Theme }) => `
    backdrop-filter: blur(${theme.backdropBlur.medium}px);
  `
);
```

### In CSS

```css
.frosted {
  backdrop-filter: blur(8px);
}
```

## Notes

- These tokens map to `theme.backdropBlur.*`.
- Use lower blur values for readability and better performance on large surfaces.

---

# Size Tokens

## Overview

Size tokens are a global px scale used across Blade internals for fixed dimensions.

> Size tokens are currently not exposed directly to consumers in the public theme API.

## Scale

The scale includes a broad set of pixel values from `0` to `1136`.

### Commonly used values

| Token | Value (px) |
|---|---|
| `size.0` | 0 |
| `size.1` | 1 |
| `size.2` | 2 |
| `size.4` | 4 |
| `size.8` | 8 |
| `size.12` | 12 |
| `size.16` | 16 |
| `size.20` | 20 |
| `size.24` | 24 |
| `size.32` | 32 |
| `size.40` | 40 |
| `size.48` | 48 |
| `size.56` | 56 |
| `size.64` | 64 |
| `size.80` | 80 |
| `size.96` | 96 |
| `size.100` | 100 |
| `size.120` | 120 |
| `size.160` | 160 |
| `size.200` | 200 |
| `size.240` | 240 |
| `size.256` | 256 |
| `size.300` | 300 |
| `size.400` | 400 |
| `size.640` | 640 |
| `size.800` | 800 |
| `size.1024` | 1024 |
| `size.1136` | 1136 |

## Usage Guidance

- Prefer semantic component props and spacing tokens for layout.
- Use size tokens for fixed dimensions where exact px values are required.
- Keep custom one-off pixel values to a minimum to preserve consistency.
