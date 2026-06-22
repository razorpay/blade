# @razorpay/blade-core

## 0.7.1

### Patch Changes

- 19e2b963e: feat(blade-svelte): Accordion enhancements — card surface filled variant, AvatarGroup in titleSuffix, full-width divider, gray body background prop
- b05f5f919: feat(blade-svelte): add BottomSheet component
- b50dad37b: feat(blade-svelte): add IconButton component

## 0.7.0

### Minor Changes

- ea2d1d90b: feat(Badge): add checkout-scoped shape variants (intense=rectangle, subtle=pill)

### Patch Changes

- 884dfd7a4: feat(blade-svelte): add `density` prop to AvatarGroup and use typed Text/Heading for the +N overflow counter
- 1fce4dca1: fix(blade-svelte): add definite loader and avatar group to Button

  Adds a definite (left-to-right progress) loader and avatar group support to the
  Svelte `Button`, reworks the indefinite loader to a pure-CSS 3-dot animation, and
  removes the unused spinner styling/exports from `blade-core`.

## 0.6.0

### Minor Changes

- 0d86166df: feat(blade-svelte): Accordion component

### Patch Changes

- 2a93ee201: feat(blade-svelte): add Skeleton component
- b955db9c6: feat(blade-svelte): add Switch component
- 684ad1fe5: feat(blade-svelte): add Toast component
- 67150149c: feat(blade-svelte): add Tooltip component

## 0.5.0

### Minor Changes

- 7cd21cb8a: feat(blade-svelte): add Alert, Avatar, AvatarGroup and Breadcrumb components
- ae81d7723: feat(blade-svelte): adds card component to blade-svelte

### Patch Changes

- 97a47b788: feat(blade-svelte): add Chip component

## 0.4.1

### Patch Changes

- 8aedb0d26: feat(blade-svelte): add counter component

## 0.4.0

### Minor Changes

- 142949f30: feat: blade spark redesign for blade-core and blade-svelte.

## 0.3.0

### Minor Changes

- 46dc37f98: Added Divider component

## 0.2.0

### Minor Changes

- 79189b455: feat(blade-svelte): Add Badge component

  - Added Badge component with all props matching React implementation
  - Supports color variants: neutral, positive, negative, notice, information, primary
  - Supports emphasis: subtle, intense
  - Supports sizes: xsmall, small, medium, large
  - Added icon support (placeholder for when Icon component is available)
  - Added styled props and analytics attributes support
  - Added Badge styles to blade-core package

## 0.1.3

### Patch Changes

- 1aadb2245: Updated Svelte storybook configuration

## 0.1.2

### Patch Changes

- cdeccac95: Private package for blade svelte

## 0.1.1

### Patch Changes

- 823fb8bff: Release workflow fixed for blade-svelte

## 0.1.0

### Minor Changes

- 069a7163d: Releasing Blade components to Svelte with new packages Blade-core and Blade-svelte
- ac14ceb6a: Version mismatch issue fixed for blade svelte release
