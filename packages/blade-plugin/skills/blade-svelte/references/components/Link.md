## Component Name

Link

## Description

Link is inline, text-styled navigation or action. `variant="anchor"` (default) renders an `<a>` that navigates to `href`; `variant="button"` renders a `<button>` for in-place actions that should look like a link, such as "View details" or "Retry". It supports colors, sizes, and an optional icon on either side, and can sit inside running text.

## Important Constraints

- At least one of `icon` or non-empty `children` is required; otherwise Link logs `BaseLink: At least one of icon or text is required to render a link.` (localhost only)
- `href`, `target` and `rel` are only applied when `variant="anchor"`; they are dropped for `variant="button"`
- `isDisabled` is only applied when `variant="button"`; it is dropped for `variant="anchor"`
- With `target="_blank"` and no `rel`, Link sets `rel="noreferrer noopener"`
- `LinkProps` does not include styled props (margin, padding, etc.); wrap the Link in a layout element to space it

## TypeScript Types

These are the props the Link component accepts.

```typescript
type IconSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';

/**
 * Any icon exported by @razorpay/blade-svelte/components, e.g. InfoIcon.
 * Color values are the icon color tokens listed in Icons.md.
 */
type IconComponent = Component<{ size?: IconSize; color?: string }>;

type LinkProps = {
  /**
   * `anchor` renders an `<a>` for navigation; `button` renders a `<button>` for actions.
   * @default 'anchor'
   */
  variant?: 'anchor' | 'button';
  /**
   * Icon rendered next to the text. Accepts an icon component from Blade.
   */
  icon?: IconComponent;
  /**
   * @default 'primary'
   */
  color?: 'primary' | 'white' | 'neutral' | 'negative' | 'positive';
  /**
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';
  /**
   * Disables the link. Only applies when `variant` is `button`.
   * @default false
   */
  isDisabled?: boolean;
  onClick?: (event: MouseEvent) => void;
  /**
   * URL to navigate to. Only applies when `variant` is `anchor`.
   */
  href?: string;
  /**
   * Anchor `target`. Only applies when `variant` is `anchor`.
   */
  target?: string;
  /**
   * Anchor `rel`. Only applies when `variant` is `anchor`.
   * Defaults to 'noreferrer noopener' when `target` is '_blank'.
   */
  rel?: string;
  /**
   * Sets `aria-label`. Required for icon-only links.
   */
  accessibilityLabel?: string;
  'aria-describedby'?: string;
  /**
   * @default 'medium'
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  testID?: string;
  /**
   * Sets the HTML `title` attribute (native tooltip).
   */
  htmlTitle?: string;
  children?: Snippet | string;
  onBlur?: (event: FocusEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  onMouseMove?: (event: MouseEvent) => void;
  onPointerDown?: (event: PointerEvent) => void;
  onPointerEnter?: (event: PointerEvent) => void;
  onTouchStart?: (event: TouchEvent) => void;
  onTouchEnd?: (event: TouchEvent) => void;
  onMouseDown?: (event: MouseEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;
  // Analytics attributes
  [key: `data-analytics-${string}`]: string;
};
```

## Usage Guidelines

**Do**

- Use `variant="anchor"` with `href` for navigation to another page or an external doc.
- Use `variant="button"` for actions that stay on the page but should read as text, such as "View details" or "Retry".
- Place Links inline inside `Text` for contextual navigation, and match the Link `size` to the surrounding text size.
- Use `target="_blank"` for external documentation so merchants keep their place in the Dashboard.
- Use `icon` with `iconPosition="right"` to hint at direction or an external destination.
- Set `accessibilityLabel` on icon-only links, and when the visible text alone is ambiguous (for example "Learn more").
- Use `color="white"` on dark or brand-colored surfaces.

**Don't**

- Don't use `Link` for the primary action of a form or page; use `Button`.
- Don't set `isDisabled` on `variant="anchor"`; switch to `variant="button"` or remove the link.
- Don't pass `href`, `target` or `rel` to `variant="button"`; use `variant="anchor"` for navigation.
- Don't use `Link` for a compact icon-only action such as close; use `IconButton`.

## Examples

### Inline help link in a settlement notice

An anchor link inside running text that opens documentation in a new tab.

```svelte
<script lang="ts">
  import { Link, Text, ChevronRightIcon } from '@razorpay/blade-svelte/components';
</script>

<Text size="medium">
  Settlements are processed on T+2 working days.
  <Link
    href="https://razorpay.com/docs/payments/settlements/"
    target="_blank"
    size="medium"
    icon={ChevronRightIcon}
    iconPosition="right"
    accessibilityLabel="Learn more about settlement timelines"
    data-analytics-link="settlement-docs"
  >
    Learn more
  </Link>
</Text>
```

### Link as an action

A button-variant link that retries a failed webhook and is disabled while the retry runs.

```svelte
<script lang="ts">
  import { Link, Text } from '@razorpay/blade-svelte/components';

  let isRetrying = $state(false);

  async function retryWebhook(): Promise<void> {
    isRetrying = true;
    await fetch('/api/webhooks/wh_01/retry', { method: 'POST' });
    isRetrying = false;
  }
</script>

<div class="webhook-row">
  <Text size="small" color="feedback.text.negative.intense">Delivery failed for payment.captured</Text>
  <Link variant="button" size="small" color="negative" isDisabled={isRetrying} onClick={retryWebhook}>
    {isRetrying ? 'Retrying…' : 'Retry now'}
  </Link>
</div>

<style>
  .webhook-row {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
  }
</style>
```
