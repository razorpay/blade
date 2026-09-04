# @razorpay/blade-svelte

## 0.15.0

### Minor Changes

- 8bb1c2efd: feat(blade-svelte): add `backdropPortalTarget` to BottomSheet

  Adds an optional `backdropPortalTarget` prop so the dim overlay can mount into a wider ancestor while the sheet surface stays in a nested container. When the targets differ, backdrop and surface render in separate portals with stacking tuned so the surface still paints above the dim layer.

### Patch Changes

- 08b3ddc5c: feat(blade-svelte): add country search to PhoneNumberInput selector

  Adds a `SearchInput` inside `CountrySelector`'s `BottomSheetHeader` for `PhoneNumberInput`. Filters the country list by name or dial code (case-insensitive substring match) and shows a "No countries found" empty state when the filter matches nothing.

- a12fdbe9f: fix(blade-svelte): budget grab handle and empty header in BottomSheet height

  Measure empty `BottomSheetHeader` height instead of skipping it, and always budget grab-handle height in snap/scroll math. Zero both only when the header floats (zero body padding). Fixes spurious body scroll (~28px) on short sheets with an empty header and drag handle.

## 0.14.0

### Minor Changes

- 6b908dc7f: fix(blade-svelte): friction fixes for TextInput, OTPInput & BottomSheet

  - `TextInput`/`BaseInput`: added `isReadOnly` and `spellCheck` props
  - `OTPInput`: added `onKeyDown` callback (with field `inputIndex`) for custom keyboard navigation; consumers can call `event.preventDefault()` to opt out of internal Backspace/Arrow navigation
  - `BottomSheet`: made `isOpen` `$bindable`

### Patch Changes

- 05b9981a5: - **TextInput**: `format` is now reactive — pattern changes reformat the current value instead of freezing at mount.
  - **TextInput**: added `keyboardType` prop + `'numeric'` to `KeyboardType` for digit-only virtual keyboards.
  - **OTPInput**: `otpLength` widened to `4 | 6 | 8` for 8-digit bank OTPs.
  - **OTPInput**: `onOTPFilled` now latches the last-fired value, firing once per completed OTP instead of re-firing on every reactive update.
  - **Accordion**: added `allowMultiple` + `expandedIndices`/`defaultExpandedIndices` for multi-expand support. Existing single-expand API unchanged.
- 049760516: fix(blade-svelte): TextInput onChange per keystroke + controlled value fixes
- Updated dependencies [bb7fec430]
  - @razorpay/blade-core@0.14.1

## 0.13.0

### Minor Changes

- 29ca5194c: feat: add `black` color variant to Button

  fix: focus-ring transition and offset flash on inputs

  fix: use `bladeTheme` as default Storybook theme in blade-svelte

### Patch Changes

- a98fed065: fix(Button): use `interactive.border.neutral.faded` for the neutral variant's focus ring instead of the shared blue ring used by primary/positive/negative

  fix: correct several Button Storybook stories where Controls didn't drive the rendered output (hardcoded `asChild` demos, dead `variant`/`color` controls on loading-matrix stories)

- a61f11e3d: fix(Button): remove redundant focus-ring-parent/child classes so secondary button shows a single focus ring instead of an extra box around the text
- Updated dependencies [a98fed065]
- Updated dependencies [29ca5194c]
  - @razorpay/blade-core@0.14.0

## 0.12.1

### Patch Changes

- 2d5b85d86: feat(blade-svelte): add Modal component

  Adds `Modal`, `ModalHeader`, `ModalBody`, and `ModalFooter` to `@razorpay/blade-svelte`. Focus is trapped within the surface while open, moves to the close button (or a caller-supplied `initialFocusRef`) on open, and returns to the previously focused element on close — including when a controlled `isOpen` prop flips to `false` directly. Background content is marked `inert` (falling back to `aria-hidden` where unsupported) while the modal is mounted, and a dev-only warning is logged if `accessibilityLabel` is missing.

## 0.12.0

### Minor Changes

- 26428686f: feat(blade-svelte): add `showDragHandle` prop to BottomSheet to optionally hide the drag handle

  `BottomSheet` now accepts a `showDragHandle` boolean prop (default `true`). Set it to `false` to hide the drag handle (the pill affordance at the top of the sheet) and disable drag-to-move/dismiss gestures — useful for desktop flows where dragging is not expected. The sheet can still be dismissed via the backdrop, `esc`, or programmatically.

### Patch Changes

- Updated dependencies [73f7e9655]
  - @razorpay/blade-core@0.12.1

## 0.11.8

### Patch Changes

- fd3e1e2d1: fix(blade-svelte): prevent BottomSheet focus from scrolling host content

  Use `focus({ preventScroll: true })` when moving focus into the sheet on open and when returning focus to the trigger on dismiss. Stops the browser from scrolling scrollable ancestors (e.g. Checkout modals) while preserving keyboard and screen-reader focus behavior.

- 788641ea1: fix(blade-svelte): export Link and CardHeaderLink prop types from components barrel

  Export `LinkProps`, `BaseLinkProps`, and `CardHeaderLinkProps` from `@razorpay/blade-svelte/components` so consumers can import them without deep paths.

## 0.11.7

### Patch Changes

- 2b2f8ec0e: fix(blade-svelte): constrain BottomSheet portalTarget to container bounds

  Fixed BottomSheet `portalTarget` so backdrop and surface render inside the target container instead of escaping to the viewport. Adds portal root wrapper styles in blade-core that switch surface/backdrop from `position: fixed` to `position: absolute` when portaling into a bounded element.

- Updated dependencies [59f21bda8]
- Updated dependencies [2b2f8ec0e]
  - @razorpay/blade-core@0.12.0

## 0.11.6

### Patch Changes

- d7e6f4c5b: fix: bump Svelte to 5.56.3 and update optional parameter defaults for compatibility with checkout

## 0.11.5

### Patch Changes

- 41ff76ed3: Remove unintended border and shadow on standalone ActionList in blade-svelte to match React web. Drop unused `getActionListBoxClasses`, `actionListBoxCva`, and `ActionListBoxVariants` exports from blade-core.
- 84923f364: fix: resolve avatar addon clipping by separating root positioning context from clipped body
- 349e25f85: fix: add optional `portalTarget` prop to BottomSheet and PhoneNumberInput for custom portal mounting
- Updated dependencies [41ff76ed3]
- Updated dependencies [84923f364]
  - @razorpay/blade-core@0.11.0

## 0.11.4

### Patch Changes

- bad271b0f: fix(TrustBadge): restore flat layout to fix icon and label vertical alignment within the pill
- Updated dependencies [bad271b0f]
  - @razorpay/blade-core@0.10.3

## 0.11.3

### Patch Changes

- 937bc4c40: fix: run tsc after sveld so the components type barrel is not overwritten

## 0.11.2

### Patch Changes

- 59b039ff8: fix: blade-svelte type pipeline - add sveld for svelte component type generation
- Updated dependencies [a5d2dc639]
  - @razorpay/blade-core@0.10.2

## 0.11.1

### Patch Changes

- 7ec4868c5: feat: reduce blade-svelte bundle size
- Updated dependencies [7ec4868c5]
  - @razorpay/blade-core@0.10.1

## 0.11.0

### Minor Changes

- b8e8c4687: feat(blade-svelte): add BladeProvider theme context and style overrides

  Adds BladeProvider with theme context, color scheme management, and typography platform support for blade-svelte. Adds theme runtime utilities in blade-core (themeToCSSVariables, createTheme overrides, data-blade-color-scheme selectors), CSS cascade layers, component style override APIs, and button brand CSS vars.

### Patch Changes

- Updated dependencies [b8e8c4687]
  - @razorpay/blade-core@0.10.0

## 0.10.0

### Minor Changes

- 5a6fd8882: feat(blade-svelte): add `flexWrap` support to `RadioGroup`

  `RadioGroup` now accepts a `flexWrap` prop (`'nowrap' | 'wrap' | 'wrap-reverse'`, default `'nowrap'`), mirroring `CheckboxGroup` and the React implementation. This is useful with `orientation="horizontal"` when radios (or radio-wrapped cards) should wrap onto multiple lines instead of overflowing.

- 7a7c21d09: feat(Card): add `ticket` and `info` card variants

  Adds `TicketCard` and `InfoCard` with `Body` + `Footer` subcomponents.

- 3c9addbe4: fix(TrustBadge): remove `emphasis` prop and align with Blade DSL trust marker design

  The `emphasis` prop (`'subtle' | 'intense'`) and the `TrustBadgeEmphasis` type have been removed from TrustBadge. The new Blade DSL design uses a single sea-subtle pill treatment regardless of surface color. Migrate by removing any `emphasis` prop usage — the updated component renders correctly on all surfaces.

  - `@razorpay/blade`: `emphasis` prop removed from `TrustBadgeProps`
  - `@razorpay/blade-svelte`: `emphasis` prop removed from `TrustBadgeProps`
  - `@razorpay/blade-core`: `TrustBadgeEmphasis` type and `getTrustBadgePillEmphasisClass` removed; replaced by `getTrustBadgeVariantClass`

### Patch Changes

- 431f52f20: chore(blade-svelte): add BrowserStack cross-browser test infrastructure

  Adds BrowserStack Playwright test setup for blade-svelte, including desktop and mobile test configurations and CI workflow integration.

- e616a3de2: feat(blade-svelte): add CounterInput component
- de1c5b24f: feat(blade-svelte): add PasswordInput component

  Adds the Svelte PasswordInput (mask/reveal toggle, character counter, size/validation variants) built on the existing BaseInput. Also fixes BaseInput so `type="password"` reaches the DOM `<input>` for masking while keyboard/inputmode/autocomplete props stay on the coerced `text` type, and adds the `EyeIcon`/`EyeOffIcon` icons.

- bbe9e0034: feat(blade-svelte): add Tabs component
- 73b15cea1: feat(blade-svelte): add SegmentedControl component
- 21de8bc90: fix(Tabs): align small filled horizontal tab corner radius with Blade React

  - TabList container: 16px → 8px (`border.radius.small`)
  - TabItem: 12px → 4px (`border.radius.xsmall`, mirrors SegmentedControl item)
  - TabIndicator: 12px → 4px (`border.radius.xsmall`, mirrors SegmentedControl indicator)
  - Focus ring: 12px → 8px (`border.radius.small` — intentionally larger than item radius to prevent 4px box-shadow inset clipping, consistent with Blade React)

- 361b0605d: fix(Card): refactor ticket card outline with SVG for accurate notch UI
- Updated dependencies [e616a3de2]
- Updated dependencies [5a6fd8882]
- Updated dependencies [7a7c21d09]
- Updated dependencies [bbe9e0034]
- Updated dependencies [73b15cea1]
- Updated dependencies [21de8bc90]
- Updated dependencies [361b0605d]
- Updated dependencies [3c9addbe4]
  - @razorpay/blade-core@0.9.0

## 0.9.0

### Minor Changes

- adff0f113: feat(AnnouncementBanner): add AnnouncementBanner component to blade, blade-core, and blade-svelte
- 75288e989: feat(AppBar, TrustBadge): add AppBar and TrustBadge components

  TrustBadge renders the "Razorpay Trusted Business" trust marker; its label is configurable
  via a `label` prop (default: "Razorpay Trusted Business") so it can evolve (e.g. "Razorpay
  Verified") without a breaking API change. AppBar surfaces it through the `trustBadgeVariant`
  prop on `AppBarLeading`.

### Patch Changes

- 0724d3d38: feat(blade-svelte): add ActionList component

  Also fixes a React BaseMenu hover style: the hover background is now suppressed when `aria-selected=true` so a selected row's `fadedHighlighted` background is not overridden on pointer-enter. This intentional fix applies to all React `BaseMenu`-based consumers (ActionList, Select, etc.) and matches the expected selected-item UX.

- ec73575f0: feat(blade-svelte): add Card variant prop with primary, secondary, and theme treatments
- 7fe2a5a65: feat(blade-svelte): add Checkbox and CheckboxGroup components
- db72ca068: feat(blade-svelte): add Input family (BaseInput, TextInput, SearchInput, OTPInput, PhoneNumberInput)
- ee333ee75: feat(blade-svelte): add InputGroup component
- 5715dc29c: fix(blade-svelte): add Playground stories so Storybook Controls work
- 3b9d0466c: fix(blade-svelte): close gap between Tooltip arrow and bubble on left/right placements

  The arrow SVG was rendered non-square (14×8). Left/right placements rotate the arrow ±90° about its center, which shifted the flat base off the bubble edge by `(width - height) / 2` (3px), leaving a visible gap. The SVG box is now square (14×14), mirroring `@floating-ui/react`'s `FloatingArrow`, so the base stays flush on every side.

- 39f33f521: feat(blade-svelte): compose Accordion on Collapsible primitive and add CollapsibleText

  - `AccordionItem` now wraps its content in `<Collapsible>` so expand/collapse animation, body `id`, and `role="region"` accessibility are owned by `CollapsibleBody` instead of duplicated in the Accordion.
  - `AccordionItemHeader` reads the Collapsible context for toggle + `aria-controls`/`aria-expanded` and renders `<CollapsibleChevronIcon>` (chevron rotation now lives in `collapsible.module.css`).
  - `AccordionItemBody` delegates animation to `<CollapsibleBody>` and only renders the body content + gray-body styling.
  - Add `CollapsibleText` (text + chevron trigger, keyboard accessible) and accept `_dangerouslyDisableValidations` on `Collapsible` for API parity with React.

- Updated dependencies [adff0f113]
- Updated dependencies [75288e989]
- Updated dependencies [0724d3d38]
- Updated dependencies [ec73575f0]
- Updated dependencies [7fe2a5a65]
- Updated dependencies [db72ca068]
- Updated dependencies [ee333ee75]
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
