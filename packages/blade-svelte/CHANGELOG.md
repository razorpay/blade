# @razorpay/blade-svelte

## 0.9.0

### Minor Changes

- adff0f113: feat(AnnouncementBanner): add AnnouncementBanner component to blade, blade-core, and blade-svelte
- fce89c19c: feat(AppBar, RTBBadge): add AppBar and RTBBadge components

### Patch Changes

- 0724d3d38: feat(blade-svelte): add ActionList component

  Also fixes a React BaseMenu hover style: the hover background is now suppressed when `aria-selected=true` so a selected row's `fadedHighlighted` background is not overridden on pointer-enter. This intentional fix applies to all React `BaseMenu`-based consumers (ActionList, Select, etc.) and matches the expected selected-item UX.

- ec73575f0: feat(blade-svelte): add Card variant prop with primary, secondary, and theme treatments
- 7fe2a5a65: feat(blade-svelte): add Checkbox and CheckboxGroup components
- 5715dc29c: fix(blade-svelte): add Playground stories so Storybook Controls work
- 39f33f521: feat(blade-svelte): compose Accordion on Collapsible primitive and add CollapsibleText

  - `AccordionItem` now wraps its content in `<Collapsible>` so expand/collapse animation, body `id`, and `role="region"` accessibility are owned by `CollapsibleBody` instead of duplicated in the Accordion.
  - `AccordionItemHeader` reads the Collapsible context for toggle + `aria-controls`/`aria-expanded` and renders `<CollapsibleChevronIcon>` (chevron rotation now lives in `collapsible.module.css`).
  - `AccordionItemBody` delegates animation to `<CollapsibleBody>` and only renders the body content + gray-body styling.
  - Add `CollapsibleText` (text + chevron trigger, keyboard accessible) and accept `_dangerouslyDisableValidations` on `Collapsible` for API parity with React.

- Updated dependencies [adff0f113]
- Updated dependencies [fce89c19c]
- Updated dependencies [0724d3d38]
- Updated dependencies [ec73575f0]
- Updated dependencies [7fe2a5a65]
- Updated dependencies [39f33f521]
  - @razorpay/blade-core@0.8.0

## 0.8.1

### Patch Changes

- 19e2b963e: feat(blade-svelte): Accordion enhancements — card surface filled variant, AvatarGroup in titleSuffix, full-width divider, gray body background prop
- b05f5f919: feat(blade-svelte): add BottomSheet component
- b50dad37b: feat(blade-svelte): add IconButton component
- Updated dependencies [19e2b963e]
- Updated dependencies [b05f5f919]
- Updated dependencies [b50dad37b]
  - @razorpay/blade-core@0.7.1

## 0.8.0

### Minor Changes

- ea2d1d90b: feat(Badge): add checkout-scoped shape variants (intense=rectangle, subtle=pill)

### Patch Changes

- 884dfd7a4: feat(blade-svelte): add `density` prop to AvatarGroup and use typed Text/Heading for the +N overflow counter
- 1fce4dca1: fix(blade-svelte): add definite loader and avatar group to Button

  Adds a definite (left-to-right progress) loader and avatar group support to the
  Svelte `Button`, reworks the indefinite loader to a pure-CSS 3-dot animation, and
  removes the unused spinner styling/exports from `blade-core`.

- Updated dependencies [884dfd7a4]
- Updated dependencies [1fce4dca1]
- Updated dependencies [ea2d1d90b]
  - @razorpay/blade-core@0.7.0

## 0.7.0

### Minor Changes

- 0d86166df: feat(blade-svelte): Accordion component

### Patch Changes

- 2a93ee201: feat(blade-svelte): add Skeleton component
- b955db9c6: feat(blade-svelte): add Switch component
- 684ad1fe5: feat(blade-svelte): add Toast component
- 67150149c: feat(blade-svelte): add Tooltip component
- Updated dependencies [2a93ee201]
- Updated dependencies [b955db9c6]
- Updated dependencies [684ad1fe5]
- Updated dependencies [67150149c]
- Updated dependencies [0d86166df]
  - @razorpay/blade-core@0.6.0

## 0.6.0

### Minor Changes

- 7cd21cb8a: feat(blade-svelte): add Alert, Avatar, AvatarGroup and Breadcrumb components
- ae81d7723: feat(blade-svelte): adds card component to blade-svelte

### Patch Changes

- 97a47b788: feat(blade-svelte): add Chip component
- Updated dependencies [97a47b788]
- Updated dependencies [7cd21cb8a]
- Updated dependencies [ae81d7723]
  - @razorpay/blade-core@0.5.0

## 0.5.1

### Patch Changes

- 8aedb0d26: feat(blade-svelte): add counter component
- Updated dependencies [8aedb0d26]
  - @razorpay/blade-core@0.4.1

## 0.5.0

### Minor Changes

- 142949f30: feat: blade spark redesign for blade-core and blade-svelte.

### Patch Changes

- Updated dependencies [142949f30]
  - @razorpay/blade-core@0.4.0

## 0.4.0

### Minor Changes

- 46dc37f98: Added Divider component

### Patch Changes

- Updated dependencies [46dc37f98]
  - @razorpay/blade-core@0.3.0

## 0.3.0

### Minor Changes

- 79189b455: feat(blade-svelte): Add Badge component

  - Added Badge component with all props matching React implementation
  - Supports color variants: neutral, positive, negative, notice, information, primary
  - Supports emphasis: subtle, intense
  - Supports sizes: xsmall, small, medium, large
  - Added icon support (placeholder for when Icon component is available)
  - Added styled props and analytics attributes support
  - Added Badge styles to blade-core package

### Patch Changes

- Updated dependencies [79189b455]
  - @razorpay/blade-core@0.2.0

## 0.2.3

### Patch Changes

- 1aadb2245: Updated Svelte storybook configuration
- Updated dependencies [1aadb2245]
  - @razorpay/blade-core@0.1.3

## 0.2.2

### Patch Changes

- cdeccac95: Private package for blade svelte
- Updated dependencies [cdeccac95]
  - @razorpay/blade-core@0.1.2

## 0.2.1

### Patch Changes

- 823fb8bff: Release workflow fixed for blade-svelte
- Updated dependencies [823fb8bff]
  - @razorpay/blade-core@0.1.1

## 0.2.0

### Minor Changes

- 069a7163d: Releasing Blade components to Svelte with new packages Blade-core and Blade-svelte
- ac14ceb6a: Version mismatch issue fixed for blade svelte release

### Patch Changes

- Updated dependencies [069a7163d]
- Updated dependencies [ac14ceb6a]
  - @razorpay/blade-core@0.1.0
