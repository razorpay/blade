## Component Name

Link

## Description

Link is a text link that reads inline with its sentence: terms and privacy in a footnote, "View details", "Resend code". As an `anchor` (the default) it is an `<a>` that goes to an `href`, routing plain internal clicks through the app's router (`adapters.navigate`); as `variant="button"` it is a `<button>` that acts but reads as a link. It comes in five colours and four sizes, and takes a leading `icon` and a `trailingIcon`, which may both show; an icon alone is an icon-only link.

## Important Constraints

- `variant="anchor"` (default) needs `href`; `variant="button"` takes no `href`, `target`, `rel` or `download`, and acts through `onClick`
- The text is `children`; an icon-only link (`icon` with no `children`) needs `accessibilityLabel`
- `icon` and `trailingIcon` take an icon source from `@razorpay/blade-svelte/icons`, never a component; they are 12px at `xsmall` and `small`, 16px above, 4px from the text
- `target="_blank"` adds `noopener noreferrer` to `rel`
- `isDisabled` on an anchor drops its `href` and marks it `aria-disabled`; on a button it disables it
- `onClick` runs before navigation; `event.preventDefault()` cancels it. A plain click on an internal `href` then goes to `adapters.navigate`; new tabs, downloads and other origins stay the browser's
- `color` is `primary`, `white`, `neutral`, `positive` or `negative`; `size` is `xsmall`, `small`, `medium` or `large`. There is no `notice` or `information` colour
- The anchor is `inline`, so a long link wraps with its sentence; underline shows on hover and focus only

## Props

```typescript
type LinkColor = 'primary' | 'white' | 'neutral' | 'positive' | 'negative';
type LinkSize = 'xsmall' | 'small' | 'medium' | 'large';

interface LinkProps {
  /** `anchor` goes somewhere (an `<a>`); `button` acts (a `<button>`) and reads as a link. @default 'anchor' */
  variant?: 'anchor' | 'button';
  /** Where it goes. Required for `anchor`; none on `button`. */
  href?: string;
  /** Anchor only. */
  target?: '_self' | '_blank' | '_parent' | '_top';
  /** Anchor only; `noopener noreferrer` is added for `_blank`. */
  rel?: string;
  /** Anchor only: saves the target instead of opening it; a string names the file. */
  download?: boolean | string;
  /** Before the text; alone, it is an icon-only link that needs `accessibilityLabel`. */
  icon?: IconSource;
  /** After the text; both icons may show. */
  trailingIcon?: IconSource;
  /** Before navigation; `event.preventDefault()` cancels it. */
  onClick?: (event: MouseEvent) => void;
  /** An anchor loses its `href`; a button is disabled. @default false */
  isDisabled?: boolean;
  /** Names the link; required for an icon-only link. */
  accessibilityLabel?: string;
  /** A tooltip on hover: the element's `title`. */
  htmlTitle?: string;
  testID?: string;
  /** Placement only. */
  class?: string;
  /** The text; omit for an icon-only link. */
  children?: Snippet;
  /** `white` for dark or brand-coloured surfaces. @default 'primary' */
  color?: LinkColor;
  /** 10/13, 12/17, 14/20 or 16/24 type. @default 'medium' (or BladeProvider's `size`) */
  size?: LinkSize;
}
```

## Guidelines

- Use Link for navigation and inline actions in text; use Button for a form's or a page's main actions.
- Match the link's `size` to the surrounding Text's size so it sits in the line.
- Use `variant="button"` for an action with no destination ("Resend code", "Edit"), not an anchor with `href="#"`.
- Add `trailingIcon={ExternalLinkIcon}` and `target="_blank"` for links that leave the app.
- Let the app's router take internal links through `adapters.navigate` rather than handling every `onClick`.
- Don't put an icon in `children`; use `icon` or `trailingIcon`, which Blade sizes and spaces.

## Examples

### Links inside text

```svelte
<script lang="ts">
  import { Link, Text } from '@razorpay/blade-svelte/components';
</script>

<Text size="small" color="muted">
  By continuing you agree to the
  <Link href="https://razorpay.com/terms" target="_blank" size="small">terms of use</Link>
  and the
  <Link href="https://razorpay.com/privacy" target="_blank" size="small">privacy policy</Link>.
</Text>
```

### Icons, colours and an icon-only link

```svelte
<script lang="ts">
  import { Link } from '@razorpay/blade-svelte/components';
  import { ArrowRightIcon, ExternalLinkIcon, HelpCircleIcon } from '@razorpay/blade-svelte/icons';
</script>

<div class="flex flex-wrap items-center gap-blade-5">
  <Link href="/payments" trailingIcon={ArrowRightIcon}>View all payments</Link>
  <Link href="https://razorpay.com/docs/" target="_blank" trailingIcon={ExternalLinkIcon} color="neutral">
    Read the docs
  </Link>
  <Link href="/settlements" color="positive" size="small">Settled</Link>
  <Link href="/help" icon={HelpCircleIcon} accessibilityLabel="Help" htmlTitle="Help" />
</div>
```

### An action that reads as a link

```svelte
<script lang="ts">
  import { Link, Text } from '@razorpay/blade-svelte/components';

  let secondsLeft = $state(0);

  function resend(): void {
    secondsLeft = 30;
    void fetch('/api/resend-otp', { method: 'POST' });
  }
</script>

<div class="flex items-center gap-blade-3">
  <Text size="small" color="muted">Didn't get the code?</Text>
  <Link variant="button" size="small" isDisabled={secondsLeft > 0} onClick={resend}>Resend OTP</Link>
</div>
```
