## Component Name

Button

## Description

Button triggers an action: submitting a form, paying, opening a dialog, going to the next step. It comes in a filled (`primary`) and an outlined (`secondary`) variant, five colours and four sizes, takes a leading and a trailing icon, and becomes an icon-only square when it has an `icon` and no label. With `href` it renders a link that looks like a button. It shows Blade's loader while busy, on `isLoading` or while the promise its `onClick` returns is pending.

## Important Constraints

- The label is `children`, plain text or a snippet; an icon-only button (`icon` with no `children`) needs `accessibilityLabel`
- `icon` and `trailingIcon` take an icon source from `@razorpay/blade-svelte/icons`, never a component or snippet
- `isDisabled` is ignored with `href`, as in Blade React
- `class` places the button (`w-full`, `mt-blade-4`, `self-end`); its look is `variant`, `color` and `size`
- `type="submit"` presses the app's form (`adapters.form`), not a surrounding `<form>`'s submit handler; an invalid form shakes the button and skips `onClick`

## Props

```typescript
type ButtonVariant = 'primary' | 'secondary';
type ButtonColor = 'primary' | 'white' | 'neutral' | 'positive' | 'negative';
type ButtonSize = 'xsmall' | 'small' | 'medium' | 'large';

interface ButtonProps {
  /** `primary` is filled, `secondary` outlined. @default 'primary' */
  variant?: ButtonVariant;
  /** `white` is for dark or brand-coloured surfaces. @default 'primary' */
  color?: ButtonColor;
  /** 28, 32, 36 or 48px tall. @default 'medium' (or BladeProvider's `size`) */
  size?: ButtonSize;
  /** The label. Optional when `icon` stands alone. */
  children?: Snippet;
  /** Before the label. Alone, with no `children`, the button is an icon-only square. */
  icon?: IconSource;
  /** After the label. */
  trailingIcon?: IconSource;
  /** Return a promise to keep the button busy until it settles. */
  onClick?: (event: MouseEvent) => void;
  /** Host-driven busy: Blade's loader over the label, the disabled look; focus stays. @default false */
  isLoading?: boolean;
  /** Ignored with `href`. @default false */
  isDisabled?: boolean;
  /** `submit` presses the app's form (`adapters.form`). @default 'button' */
  type?: 'button' | 'submit';
  /** A `button` that validates the app's form first, without submitting. */
  validateForm?: boolean;
  /** Renders an anchor that looks like the button; internal hrefs go to `adapters.navigate`. */
  href?: string;
  target?: string;
  /** `noopener noreferrer` is added for `target="_blank"`. */
  rel?: string;
  /** Localized; said to a screen reader when the button turns busy. @default 'Started loading' */
  loadingAnnouncement?: string;
  /** Localized; said when it stops being busy. @default 'Stopped loading' */
  loadedAnnouncement?: string;
  /** Names the button; required for an icon-only button. */
  accessibilityLabel?: string;
  testID?: string;
  /** Placement only: margin, width, its part in a flex or grid parent. */
  class?: string;
}
```

## Guidelines

- Use one `primary` button per view for the main action, and `secondary` for the others.
- Use `color="negative"` for destructive actions and `color="white"` on dark or brand-coloured surfaces.
- Return the request's promise from `onClick` instead of managing `isLoading` yourself; use `isLoading` only when the busy state comes from elsewhere.
- Make a button full width with `class="w-full"`, not a prop.
- Don't restyle it through `class` (`bg-*`, `p-*`, `rounded-*`): pick a `variant`, `color` and `size`.
- Don't put an icon inside `children`: use `icon` or `trailingIcon`, which Blade spaces correctly.
- Use Link, not Button, for navigation inside text.

## Examples

### Variants, colours and sizes

```svelte
<script lang="ts">
  import { Button } from '@razorpay/blade-svelte/components';
</script>

<div class="flex flex-wrap items-center gap-blade-3">
  <Button>Pay now</Button>
  <Button variant="secondary">Cancel</Button>
  <Button color="negative">Delete card</Button>
  <Button variant="secondary" color="neutral" size="small">Edit</Button>
  <Button size="large" class="w-full">Continue</Button>
</div>
```

### Icons and an icon-only button

```svelte
<script lang="ts">
  import { Button } from '@razorpay/blade-svelte/components';
  import { ArrowRightIcon, CloseIcon, DownloadIcon } from '@razorpay/blade-svelte/icons';
</script>

<div class="flex items-center gap-blade-3">
  <Button icon={DownloadIcon} variant="secondary">Download invoice</Button>
  <Button trailingIcon={ArrowRightIcon}>Continue</Button>
  <Button icon={CloseIcon} variant="secondary" color="neutral" accessibilityLabel="Close" />
</div>
```

### Busy while a request runs

```svelte
<script lang="ts">
  import { Button, showToast } from '@razorpay/blade-svelte/components';

  async function pay(): Promise<void> {
    await fetch('/api/pay', { method: 'POST' });
    void showToast({ content: 'Payment successful', color: 'positive' });
  }
</script>

<!-- The button shows the loader until the promise settles. -->
<Button onClick={pay} loadingAnnouncement="Paying" loadedAnnouncement="Payment done">
  Pay ₹1,299
</Button>
```

### A link that looks like a button

```svelte
<script lang="ts">
  import { Button } from '@razorpay/blade-svelte/components';
  import { ExternalLinkIcon } from '@razorpay/blade-svelte/icons';
</script>

<Button href="https://razorpay.com/docs/" target="_blank" variant="secondary" trailingIcon={ExternalLinkIcon}>
  Read the docs
</Button>
```
