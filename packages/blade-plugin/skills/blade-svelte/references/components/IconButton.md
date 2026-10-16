## Component Name

IconButton

## Description

IconButton is a clickable icon with a transparent background for compact actions such as closing a modal, clearing an input or dismissing a banner. Emphasis sets the contrast for light (`intense`) or dark (`subtle`, `moderate`) surfaces, and `isHighlighted` adds a faded square background on hover and focus. For actions that need a visible label, use `Button` with its `icon` prop.

## Important Constraints

- `accessibilityLabel` and `onClick` are required
- `size="large"` is not allowed with `isHighlighted` or `emphasis="moderate"`; IconButton logs an error (localhost only) and still renders
- `emphasis="moderate"` is not compatible with `isHighlighted`; IconButton logs an error (localhost only)
- When `isDisabled` is true, `onClick` and every other event callback is not called
- IconButton always renders `<button type="button">`; it has no `href` or `type` prop
- `IconButtonProps` has no `testID` prop

## TypeScript Types

These are the props the IconButton component accepts.

```typescript
type IconButtonSize = 'small' | 'medium' | 'large';
type IconButtonEmphasis = 'subtle' | 'intense' | 'moderate';

type IconButtonSlot = 'root' | 'icon';

type IconSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';

/**
 * Any icon exported by @razorpay/blade-svelte/components, e.g. CloseIcon.
 * Color values are the icon color tokens listed in Icons.md.
 */
type IconComponent = Component<{ size?: IconSize; color?: string }>;

interface IconButtonProps extends StyledPropsBlade {
  /**
   * Icon component to be rendered, eg. `CloseIcon`.
   */
  icon: IconComponent;
  /**
   * Icon size.
   * @default 'medium'
   */
  size?: IconButtonSize;
  /**
   * Icon emphasis (contrast).
   * @default 'intense'
   */
  emphasis?: IconButtonEmphasis;
  /**
   * Sets `aria-label` to help users know what the action does, eg 'Dismiss alert'.
   */
  accessibilityLabel: string;
  /**
   * Disabled state for IconButton.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Changes the hover/focus interaction to highlight the icon more by rendering a
   * fixed-size square with a faded background. Web-only.
   *
   * Note: not supported with `size="large"`.
   * @default false
   */
  isHighlighted?: boolean;
  /**
   * Called when the IconButton is clicked.
   */
  onClick: (event: MouseEvent) => void;
  /** Called when the IconButton loses focus. */
  onBlur?: (event: FocusEvent) => void;
  /** Called when the IconButton receives focus. */
  onFocus?: (event: FocusEvent) => void;
  /** Called when the pointer leaves the IconButton. */
  onMouseLeave?: (event: MouseEvent) => void;
  /** Called when the pointer moves over the IconButton. */
  onMouseMove?: (event: MouseEvent) => void;
  /** Called when a pointer becomes active over the IconButton. */
  onPointerDown?: (event: PointerEvent) => void;
  /** Called when a pointer enters the IconButton. */
  onPointerEnter?: (event: PointerEvent) => void;
  /** Called when a touch point is placed on the IconButton. */
  onTouchStart?: (event: TouchEvent) => void;
  /** Called when a touch point is removed from the IconButton. */
  onTouchEnd?: (event: TouchEvent) => void;
  /** Called when a key is pressed while the IconButton is focused. */
  onKeyDown?: (event: KeyboardEvent) => void;
  /**
   * Per-slot classname overrides. Merged under provider `componentConfig.IconButton.styleOverride`;
   * instance values win on conflicts.
   */
  styleOverride?: Partial<Record<IconButtonSlot, string>>;
  // Analytics attributes
  [key: `data-analytics-${string}`]: string;
}
```

## Usage Guidelines

**Do**

- Use `IconButton` for well-known icon-only actions in tight spaces: close, clear, more options.
- Write an `accessibilityLabel` that names the action and its target, such as "Close refund details" or "Clear search".
- Use `emphasis="intense"` (default) on light surfaces and `emphasis="subtle"` on dark or brand-colored surfaces.
- Use `emphasis="moderate"` for trailing actions on a dark header, where the icon needs a persistent faded background.
- Use `isHighlighted` with `size="small"` or `size="medium"` when the icon sits in a toolbar and needs a clearer hover target.
- Match `size` to nearby text: `small` in inputs and dense rows, `medium` in cards and modals, `large` for standalone actions.

**Don't**

- Don't use `IconButton` when the icon's meaning is not obvious; use `Button` with `icon` and a text label.
- Don't use generic labels such as "Button" or "Icon"; describe the action.
- Don't combine `size="large"` with `isHighlighted` or `emphasis="moderate"`; use `size="medium"`.
- Don't use `IconButton` for navigation; use `Link` with an `icon`.
- Don't use `IconButton` to submit a form; use `Button` with `type="submit"`.

## Examples

### Dismissible payment details panel

A close action in a panel header plus a highlighted "more options" action.

```svelte
<script lang="ts">
  import { Heading, IconButton, CloseIcon, MoreHorizontalIcon } from '@razorpay/blade-svelte/components';

  let isOpen = $state(true);
  let isMenuOpen = $state(false);
</script>

{#if isOpen}
  <div class="panel-header">
    <Heading size="small">Payment pay_29QQoUBi66xm2f</Heading>
    <div class="panel-actions">
      <IconButton
        icon={MoreHorizontalIcon}
        size="medium"
        isHighlighted
        accessibilityLabel="More actions for this payment"
        onClick={() => (isMenuOpen = !isMenuOpen)}
        data-analytics-action="payment-more-actions"
      />
      <IconButton
        icon={CloseIcon}
        size="medium"
        accessibilityLabel="Close payment details"
        onClick={() => (isOpen = false)}
      />
    </div>
  </div>
{/if}

<style>
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-4);
  }

  .panel-actions {
    display: flex;
    gap: var(--spacing-2);
  }
</style>
```

### Clear a search field and dark-surface actions

A small clear action next to an input, and `subtle` / `moderate` icon buttons on a dark announcement strip; the clear action is disabled while the query is empty.

```svelte
<script lang="ts">
  import { IconButton, Text, CloseIcon, InfoIcon } from '@razorpay/blade-svelte/components';

  let query = $state('order_');
</script>

<div class="search-row">
  <Text size="small">Searching for "{query}"</Text>
  <IconButton
    icon={CloseIcon}
    size="small"
    isDisabled={query.length === 0}
    accessibilityLabel="Clear search"
    onClick={() => (query = '')}
  />
</div>

<div class="dark-strip">
  <Text size="small" color="surface.text.staticWhite.normal">Settlements are delayed today</Text>
  <IconButton icon={InfoIcon} emphasis="moderate" accessibilityLabel="Why are settlements delayed" onClick={() => {}} />
  <IconButton icon={CloseIcon} emphasis="subtle" accessibilityLabel="Dismiss settlement notice" onClick={() => {}} />
</div>

<style>
  .search-row,
  .dark-strip {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    padding: var(--spacing-3);
  }

  .dark-strip {
    background-color: var(--surface-background-primary-intense);
  }
</style>
```
