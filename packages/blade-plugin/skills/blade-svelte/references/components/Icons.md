## Component Name

Icons

## Description

Blade icons are Svelte components such as `CheckCircleIcon`, `CreditCardIcon` and `InfoIcon`, exported from `@razorpay/blade-svelte/components`. Every icon takes the same two props, `size` and `color`, where `color` is an icon color token rather than a raw color. Icons are mostly passed as component references to props like `icon` on `Button`, `Badge`, `IconButton` or `ActionListItemIcon`, and can also be rendered on their own. The full list of available icons lives in `../general/AvailableIcons.md`.

## Important Constraints

- Only the icons listed in `../general/AvailableIcons.md` exist in blade-svelte; icon names from the React docs are not available
- `color` only accepts the `IconColor` tokens below or `'currentColor'`; hex, rgb or CSS variable strings are not supported
- Icons are always rendered `aria-hidden`; they carry no accessible name of their own
- Icon props only accept the component itself (`icon={CheckIcon}`), never a rendered element or a string name
- `RazorpayTrustIcon` keeps its brand gradient and ignores `color` unless `color="currentColor"`
- The internal `Svg` / `Path` primitives are not exported; custom SVG icons cannot be built with them

## TypeScript Types

These are the props every icon component accepts.

```typescript
/**
 * Icon color tokens - matches React implementation
 * Uses dot notation for theme color tokens
 */
type IconColor =
  // Interactive icon colors
  | 'interactive.icon.gray.normal'
  | 'interactive.icon.gray.subtle'
  | 'interactive.icon.gray.muted'
  | 'interactive.icon.gray.disabled'
  | 'interactive.icon.primary.normal'
  | 'interactive.icon.primary.subtle'
  | 'interactive.icon.primary.disabled'
  | 'interactive.icon.onPrimary.normal'
  | 'interactive.icon.staticWhite.normal'
  | 'interactive.icon.staticBlack.muted'
  | 'interactive.icon.staticBlack.disabled'
  | 'interactive.icon.positive.normal'
  | 'interactive.icon.positive.disabled'
  | 'interactive.icon.negative.normal'
  | 'interactive.icon.negative.disabled'
  // Surface icon colors
  | 'surface.icon.gray.normal'
  | 'surface.icon.gray.subtle'
  | 'surface.icon.gray.muted'
  | 'surface.icon.gray.disabled'
  | 'surface.icon.primary.normal'
  | 'surface.icon.staticWhite.normal'
  | 'surface.icon.staticBlack.normal'
  // Feedback icon colors
  | 'feedback.icon.positive.intense'
  | 'feedback.icon.positive.subtle'
  | 'feedback.icon.negative.intense'
  | 'feedback.icon.negative.subtle'
  | 'feedback.icon.notice.intense'
  | 'feedback.icon.notice.subtle'
  | 'feedback.icon.information.intense'
  | 'feedback.icon.information.subtle'
  | 'feedback.icon.neutral.intense'
  | 'feedback.icon.neutral.subtle'
  // Special value to inherit color from parent
  | 'currentColor';

/**
 * Icon sizes - matches React implementation
 * xsmall 8px, small 12px, medium 16px, large 20px, xlarge 24px, 2xlarge 32px
 */
type IconSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';

/**
 * Icon component props - matches React IconProps
 */
type IconProps = {
  /**
   * Color token (not to be confused with actual hsla value)
   * @default 'surface.icon.gray.normal'
   */
  color?: IconColor;
  /**
   * Size of the icon
   * @default 'medium'
   */
  size?: IconSize;
} & StyledPropsBlade;

/**
 * The type of every icon export (e.g. CheckCircleIcon). Props such as
 * `icon` on Button, Badge, IconButton or ActionListItemIcon are typed with it.
 */
type IconComponent = Component<IconProps>;
```

## Usage Guidelines

**Do**

- Pass icons by reference to component props: `<Button icon={CreditCardIcon}>`, `<Badge icon={CheckCircleIcon}>`.
- Let the host component pick size and color when an icon goes into an `icon` prop; Button, Badge and ActionListItemIcon set them to match their own state.
- Use semantic tokens when rendering an icon on its own: `feedback.icon.*` for status, `surface.icon.*` for static content, `interactive.icon.*` inside interactive rows.
- Use `size="small"` or `"medium"` inline with body text and `"xlarge"` or `"2xlarge"` for standalone illustrations of a state.
- Use `color="currentColor"` when the icon must follow the text color of a custom wrapper.
- Pair a standalone icon with visible text, because icons are hidden from screen readers.

**Don't**

- Don't make a bare icon clickable; use `IconButton` with an `accessibilityLabel`.
- Don't use hardcoded colors or CSS variables in `color`; pick an `IconColor` token.
- Don't invent icon names from React Blade; check `../general/AvailableIcons.md` and tell the user when an icon is missing.
- Don't render `<CheckIcon />` inside a snippet to fill an `icon` prop; pass `CheckIcon` itself.
- Don't use icons as the only carrier of meaning; add text or use `Badge` / `Alert` for status.

## Examples

### Icons inside other components

Icons passed by reference to `Button`, `Badge` and `IconButton` in a payment method row.

```svelte
<script lang="ts">
  import {
    Box,
    Button,
    Badge,
    IconButton,
    Text,
    CreditCardIcon,
    CheckCircleIcon,
    MoreHorizontalIcon,
  } from '@razorpay/blade-svelte/components';

  let isSaving = $state(false);

  function saveCard(): void {
    isSaving = true;
  }
</script>

<Box className="display-flex items-center gap-spacing-3">
  <Text size="medium" weight="semibold">HDFC Credit Card ••4521</Text>
  <Badge color="positive" size="small" icon={CheckCircleIcon}>Default</Badge>
  <Button variant="secondary" size="small" icon={CreditCardIcon} isLoading={isSaving} onClick={saveCard}>
    Save card
  </Button>
  <IconButton icon={MoreHorizontalIcon} accessibilityLabel="More card options" onClick={() => {}} />
</Box>
```

### Standalone status icons

Icons rendered directly with semantic colors and sizes, always next to text that states the status.

```svelte
<script lang="ts">
  import {
    Box,
    Text,
    CheckCircleIcon,
    AlertTriangleIcon,
    AlertOctagonIcon,
  } from '@razorpay/blade-svelte/components';

  const settlements = [
    { id: 'setl_01', label: 'Settled to HDFC ••4521', status: 'settled' },
    { id: 'setl_02', label: 'On hold for KYC review', status: 'on_hold' },
    { id: 'setl_03', label: 'Failed: bank account inactive', status: 'failed' },
  ] as const;
</script>

<Box className="display-flex flex-col gap-spacing-3">
  {#each settlements as settlement (settlement.id)}
    <Box className="display-flex items-center gap-spacing-2">
      {#if settlement.status === 'settled'}
        <CheckCircleIcon size="large" color="feedback.icon.positive.intense" />
      {:else if settlement.status === 'on_hold'}
        <AlertTriangleIcon size="large" color="feedback.icon.notice.intense" />
      {:else}
        <AlertOctagonIcon size="large" color="feedback.icon.negative.intense" />
      {/if}
      <Text size="medium">{settlement.label}</Text>
    </Box>
  {/each}
</Box>
```
