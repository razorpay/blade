## Component Name

Button

## Description

Button triggers an action such as submitting a payment, saving settings or opening a flow. Variants (primary, secondary, tertiary) set the visual hierarchy, colors carry intent, and sizes range from dense toolbars to hero calls-to-action. It can show text, an icon or both, render as an anchor when given `href`, show an indefinite (3-dot) or definite (timed progress) loading state, and show an avatar group on large buttons.

## Important Constraints

- `variant="tertiary"` only works with `color="primary"`, `color="white"` or `color="neutral"`; `positive` and `negative` throw `Tertiary variant can only be used with color: "primary" or "white" or "transparent"`
- At least one of `icon` or non-empty `children` is required; otherwise Button logs `BaseButton: At least one of icon or text is required to render a button.` (localhost only)
- When `href` is set, Button renders an `<a>` and `isDisabled` is ignored
- `isLoading` only applies when `loadingType` is `indefinite`; the 3-dot loader replaces all content
- `loadingType="definite"` does nothing unless `loadingTimer` is a number greater than 0; the button is disabled until the progress fill completes, then `onLoadingComplete` fires
- Any loading state disables the button and sets `aria-busy`
- `avatars` render only when `size="large"`, and are hidden during indefinite loading
- `accessibilityProps` is overwritten by Button; set `accessibilityLabel`, `role` and the `aria-*` props instead
- With `target="_blank"` and no `rel`, Button sets `rel="noreferrer noopener"`

## TypeScript Types

These are the props the Button component accepts.

```typescript
type ButtonLoadingType = 'indefinite' | 'definite';

type ButtonSlot = 'root' | 'icon' | 'text';

type IconSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';

/**
 * Any icon exported by @razorpay/blade-svelte/components, e.g. CreditCardIcon.
 * Color values are the icon color tokens listed in Icons.md.
 */
type IconComponent = Component<{ size?: IconSize; color?: string }>;

/**
 * A single avatar entry rendered inside the button's avatar group.
 * At least one of `name` or `src` is required.
 */
type ButtonAvatar = {
  /**
   * `alt` text for the avatar image.
   */
  alt?: string;
} & (
  | {
      /**
       * Name used to generate initials and as the image `alt` when `src` loads.
       */
      name: string;
      /**
       * Avatar image source.
       */
      src?: string;
    }
  | {
      /**
       * Name used to generate initials and as the image `alt` when `src` loads.
       */
      name?: string;
      /**
       * Avatar image source.
       */
      src: string;
    }
);

type ButtonProps = {
  /**
   * The content of the button
   */
  children?: Snippet | string;
  /**
   * Icon to display in the button
   * Accepts an icon component from Blade
   */
  icon?: IconComponent;
  /**
   * Position of the icon relative to the button text
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';
  /**
   * Button variant that defines the visual style
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  /**
   * Color theme of the button
   * Note: Not all color and variant combinations are valid
   * @default 'primary'
   */
  color?: 'primary' | 'white' | 'neutral' | 'positive' | 'negative';
  /**
   * Size of the button
   * @default 'medium'
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  /**
   * Whether the button is disabled
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Whether the button should take the full width of its container
   * @default false
   */
  isFullWidth?: boolean;
  /**
   * Whether the button is in a loading state.
   * Only applicable when `loadingType` is `indefinite` (the default) and drives the 3-dot loader.
   * @default false
   */
  isLoading?: boolean;
  /**
   * Type of loading indicator to show.
   * - `indefinite`: 3-dot loader controlled by `isLoading`
   * - `definite`: left-to-right progress bar (button color) over a disabled-colored base
   * @default 'indefinite'
   */
  loadingType?: ButtonLoadingType;
  /**
   * Duration (in milliseconds) over which the `definite` progress bar fills from 0% to 100%.
   * Required when `loadingType` is `definite`.
   */
  loadingTimer?: number;
  /**
   * Called once when the `definite` progress bar reaches 100%.
   */
  onLoadingComplete?: () => void;
  /**
   * Avatars to render after the button text as an avatar group.
   * Only rendered for `large` buttons; ignored for smaller sizes.
   */
  avatars?: ButtonAvatar[];
  /**
   * URL to navigate to. When set, the button renders as an `<a>` element.
   */
  href?: string;
  /**
   * Anchor `target`. Only applies when `href` is set.
   */
  target?: string;
  /**
   * Anchor `rel`. Only applies when `href` is set.
   * Defaults to 'noreferrer noopener' when `target` is '_blank'.
   */
  rel?: string;
  /**
   * The type of the button element
   * @default 'button'
   */
  type?: 'button' | 'reset' | 'submit';
  /**
   * `id` of the rendered element
   */
  id?: string;
  /**
   * Sets the `tabindex` of the rendered element
   */
  tabIndex?: number;
  /**
   * Overwritten by Button. Use `accessibilityLabel`, `role` and the `aria-*` props instead.
   */
  accessibilityProps?: {
    label?: string;
    describedBy?: string;
    controls?: string;
    expanded?: boolean;
    hasPopup?: 'menu';
    role?: string;
  };
  /**
   * The accessible label for the button
   * Required for icon-only buttons
   */
  accessibilityLabel?: string;
  /**
   * Accessibility role for the button
   */
  role?: string;
  /**
   * aria-describedby attribute
   */
  'aria-describedby'?: string;
  /**
   * aria-expanded attribute
   */
  'aria-expanded'?: boolean;
  /**
   * aria-controls attribute
   */
  'aria-controls'?: string;
  /**
   * aria-haspopup attribute
   */
  'aria-haspopup'?: 'menu' | boolean;
  /**
   * Test ID for the button element
   */
  testID?: string;
  /**
   * Per-slot classname overrides. Merged under provider `componentConfig.Button.styleOverride`;
   * instance values win on conflicts.
   */
  styleOverride?: Partial<Record<ButtonSlot, string>>;
  /**
   * Function called when the button is clicked
   */
  onClick?: (event: MouseEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  onMouseMove?: (event: MouseEvent) => void;
  onMouseDown?: (event: MouseEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;
  onPointerDown?: (event: PointerEvent) => void;
  onPointerEnter?: (event: PointerEvent) => void;
  onTouchStart?: (event: TouchEvent) => void;
  onTouchEnd?: (event: TouchEvent) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  // Analytics attributes
  [key: `data-analytics-${string}`]: string;
} & StyledPropsBlade;
```

## Usage Guidelines

**Do**

- Use `Button` for actions that change something: submit, save, pay, create, confirm.
- Use one `variant="primary"` button per section for the main action; use `secondary` for supporting actions and `tertiary` for low-emphasis ones.
- Use `color="positive"` or `color="negative"` with `primary` or `secondary` for confirm and destructive actions, such as "Approve refund" or "Delete webhook".
- Use `color="white"` on dark or brand-colored surfaces.
- Use `isLoading` while an async action runs, so the button is disabled and screen readers hear the loading state.
- Use `loadingType="definite"` with `loadingTimer` for timed waits such as a resend-OTP cooldown or an auto-redirect.
- Use `href` when the action navigates, so the element is a real anchor.
- Keep labels short and verb-first: "Pay ₹1,200", "Download report".
- Set `accessibilityLabel` on every icon-only button.

**Don't**

- Don't use `variant="tertiary"` with `positive` or `negative`; use `secondary` with that color.
- Don't use `Button` for icon-only actions in tight spaces such as close buttons; use `IconButton`.
- Don't use `Button` for inline navigation inside a sentence; use `Link`.
- Don't put a `Spinner` inside a Button; use `isLoading`.
- Don't pass `avatars` to buttons smaller than `large`; they are not rendered.
- Don't set `isDisabled` on a Button with `href`; remove the `href` or render a disabled Button without it.

## Examples

### Checkout actions with loading

A payment summary footer with a primary pay action that shows an indefinite loader while the request is in flight.

```svelte
<script lang="ts">
  import { Button, CreditCardIcon, ArrowLeftIcon } from '@razorpay/blade-svelte/components';

  let isPaying = $state(false);

  async function handlePay(event: MouseEvent): Promise<void> {
    event.preventDefault();
    isPaying = true;
    try {
      await fetch('/api/payments', { method: 'POST' });
    } finally {
      isPaying = false;
    }
  }
</script>

<div class="checkout-footer">
  <Button variant="tertiary" icon={ArrowLeftIcon} iconPosition="left" size="medium">
    Back to cart
  </Button>
  <div class="checkout-actions">
    <Button variant="secondary" color="negative">Cancel order</Button>
    <Button
      variant="primary"
      size="large"
      icon={CreditCardIcon}
      iconPosition="left"
      isLoading={isPaying}
      onClick={handlePay}
      testID="pay-now-button"
      data-analytics-action="pay-now"
    >
      Pay ₹1,200
    </Button>
  </div>
</div>

<style>
  .checkout-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-4);
  }

  .checkout-actions {
    display: flex;
    gap: var(--spacing-3);
  }
</style>
```

### Resend OTP with definite loading

A timed cooldown: the button fills over 30 seconds, stays disabled until the fill completes, then becomes clickable again.

```svelte
<script lang="ts">
  import { Button } from '@razorpay/blade-svelte/components';

  let isCoolingDown = $state(true);

  function resendOtp(): void {
    isCoolingDown = true;
  }
</script>

<Button
  variant="secondary"
  size="medium"
  loadingType="definite"
  loadingTimer={isCoolingDown ? 30000 : undefined}
  onLoadingComplete={() => (isCoolingDown = false)}
  onClick={resendOtp}
  isFullWidth
>
  {isCoolingDown ? 'Resend OTP in 30s' : 'Resend OTP'}
</Button>
```

### Navigation, icon-only and avatar buttons

A settlement report toolbar: a download link rendered as an anchor, an icon-only search action, and a large button showing who the report is shared with.

```svelte
<script lang="ts">
  import { Button, SearchIcon } from '@razorpay/blade-svelte/components';

  const reviewers = [
    { name: 'Asha Menon' },
    { name: 'Rahul Verma', src: 'https://example.com/avatars/rahul.png' },
  ];
</script>

<div class="report-toolbar">
  <Button
    variant="secondary"
    href="/settlements/setl_01/report.csv"
    target="_blank"
    accessibilityLabel="Download settlement report as CSV"
  >
    Download report
  </Button>
  <Button variant="tertiary" icon={SearchIcon} accessibilityLabel="Search settlements" />
  <Button variant="secondary" color="neutral" size="large" avatars={reviewers}>Shared with</Button>
</div>

<style>
  .report-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-3);
  }
</style>
```
