## Component Name

Tooltip

## Description

Tooltip shows a short, read-only hint about its trigger in a small floating bubble with an arrow. It opens on mouse hover (after a 300 ms delay) and immediately on keyboard focus, supports an optional bold title, and flips placement to stay in view. Wrap non-interactive triggers such as icons or badges in `TooltipInteractiveWrapper`.

## Important Constraints

- `content` is required and must be a plain string; the bubble can't hold links, buttons or other markup
- `children` is required and must be a snippet that renders the trigger; Tooltip wraps it in a `<span>` that owns the hover and focus handlers
- The trigger must be focusable (a `Button`, `Link`, native `<button>`, or an element with `tabindex="0"`) for keyboard users to open the Tooltip
- `TooltipInteractiveWrapper` must be rendered inside a `Tooltip`; it logs a console warning in development otherwise
- `TooltipInteractiveWrapper` renders with `tabindex="-1"` (React uses `0`), so it opens on hover and click focus but is not reached with the Tab key
- The bubble renders in a portal on `document.body`, so use `zIndex` to place it above other overlays
- Partial port: the React `maxWidth` prop is not available

## TypeScript Types

These are the props the Tooltip and TooltipInteractiveWrapper components accept.

```typescript
/**
 * 8 supported tooltip placements (mirrors React's
 * `Exclude<Placement, 'left-end' | 'left-start' | 'right-end' | 'right-start'>`).
 */
type TooltipPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'right'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left';

type TooltipProps = {
  /**
   * Bold heading rendered above the tooltip content. Optional.
   */
  title?: string;

  /**
   * Body text for the tooltip. Required. Also exposed as `aria-describedby`
   * for the trigger element.
   */
  content: string;

  /**
   * Where the tooltip is positioned relative to the trigger. Floating UI may
   * flip the placement to keep the bubble in view.
   * @default 'top'
   */
  placement?: TooltipPlacement;

  /**
   * Snippet wrapping the trigger element. Required. The trigger is wrapped in
   * a `<span>` that owns hover/focus handlers and the floating-ui reference.
   */
  children: Snippet;

  /**
   * Fired whenever the tooltip's open state toggles.
   */
  onOpenChange?: (event: { isOpen: boolean }) => void;

  /**
   * z-index applied to the portal element that hosts the tooltip bubble.
   * @default 1100
   */
  zIndex?: number;

  /** Test ID for the element. */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
} & StyledPropsBlade;

type TooltipInteractiveWrapperProps = {
  /** Snippet rendered inside the wrapper. */
  children: Snippet;
  /** Test ID for the element. */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
} & StyledPropsBlade;
```

## Usage Guidelines

**Do**

- Use `Tooltip` for brief, supplementary help, such as explaining a fee, an abbreviation like "MDR" or what an icon button does.
- Keep `content` to one short sentence and `title` to a few words.
- Use `TooltipInteractiveWrapper` around icons, badges and counters used as triggers.
- Use `placement` to keep the bubble clear of nearby content, for example `bottom-start` for icons next to a label.
- Use `onOpenChange` to track when merchants look for help, for analytics.
- Use tooltips sparingly; one per cluster of related controls is usually enough.

**Don't**

- Don't put actions or links in a Tooltip; use `Popover` for interactive content.
- Don't hide information needed to complete a task in a Tooltip; show it inline with `Text` or an `Alert`.
- Don't use a Tooltip as the only label of an icon-only control; give the control its own accessible label as well.
- Don't wrap an already interactive trigger such as `Button` in `TooltipInteractiveWrapper`; pass it directly.
- Don't use a Tooltip for click-to-open help; use `Popover`.

## Examples

### Explaining a settlement action

A Tooltip with a title on a Button, reporting open state for analytics.

```svelte
<script lang="ts">
  import { Button, Tooltip } from '@razorpay/blade-svelte/components';

  let helpViews = $state(0);

  const trackOpen = ({ isOpen }: { isOpen: boolean }): void => {
    if (isOpen) helpViews += 1;
  };
</script>

<Tooltip
  title="Instant settlement"
  content="Funds reach your bank account in under 30 minutes for a 0.1% fee."
  placement="bottom"
  onOpenChange={trackOpen}
  testID="instant-settlement-tooltip"
  data-analytics-name="instant-settlement-help"
>
  {#snippet children()}
    <Button variant="secondary">Settle now</Button>
  {/snippet}
</Tooltip>
```

### Info icon next to a label

A non-interactive icon wrapped in TooltipInteractiveWrapper so it can act as the trigger.

```svelte
<script lang="ts">
  import {
    InfoIcon,
    Text,
    Tooltip,
    TooltipInteractiveWrapper,
  } from '@razorpay/blade-svelte/components';
</script>

<div class="label-row">
  <Text size="medium" weight="semibold">Net settlement</Text>
  <Tooltip content="Gross amount minus Razorpay fees and GST" placement="bottom-start">
    {#snippet children()}
      <TooltipInteractiveWrapper marginTop="spacing.1">
        {#snippet children()}
          <InfoIcon size="medium" color="surface.icon.gray.muted" />
        {/snippet}
      </TooltipInteractiveWrapper>
    {/snippet}
  </Tooltip>
</div>

<style>
  .label-row {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
  }
</style>
```
