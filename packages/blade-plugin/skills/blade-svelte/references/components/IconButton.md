## Component Name

IconButton

## Description

IconButton is a button whose whole content is one icon, for compact actions such as close, copy, edit, more or refresh. It draws a bare glyph (12, 16 or 20px) in gray for light surfaces (`intense`) or white for dark ones (`subtle`), optionally with a box behind it on hover and focus, and needs an `accessibilityLabel`. It shares Button's press: an `onClick` that returns a promise keeps it busy with a spinner, and `type="submit"` submits the app's form.

## Important Constraints

- `icon` and `accessibilityLabel` are required; the label is the button's only name, so localise it
- `icon` takes an icon source from `@razorpay/blade-svelte/icons`, never a component or snippet
- `emphasis="subtle"` is a white glyph, for dark or brand surfaces; `intense` (default) is gray, for light ones. React's `moderate` does not exist
- `isHighlighted` adds a box on hover and focus (24px at `small`, 32px at `medium`); there is no box at `large`
- `type` defaults to `button`: a press leaves the app's form alone; `type="submit"` presses `adapters.form`
- `class` places it (margin, position); a close button flush with a corner can be pulled in with a negative margin

## Props

```typescript
interface IconButtonProps {
  /** The glyph; the button sizes it. */
  icon: IconSource;
  /** Required: the glyph is decorative, this is the button's only name. */
  accessibilityLabel: string;
  /** Return a promise to keep the button busy until it settles. */
  onClick?: (event: MouseEvent) => void;
  /** `intense`: a gray glyph, for light surfaces; `subtle`: a white glyph, for dark ones. @default 'intense' */
  emphasis?: 'intense' | 'subtle';
  /** The glyph: 12, 16 or 20px. @default 'medium' */
  size?: 'small' | 'medium' | 'large';
  /** A box behind the glyph on hover and focus; not with `size="large"`. @default false */
  isHighlighted?: boolean;
  /** Host-driven busy: a spinner in place of the glyph; focus stays. @default false */
  isLoading?: boolean;
  /** @default false */
  isDisabled?: boolean;
  /** `submit` presses the app's form (`adapters.form`). @default 'button' */
  type?: 'button' | 'submit';
  /** A `button` that validates the app's form first, without submitting. @default false */
  validateForm?: boolean;
  /** Localized; said to a screen reader when the button turns busy. @default 'Started loading' */
  loadingAnnouncement?: string;
  /** Localized; said when it is no longer busy. @default 'Stopped loading' */
  loadedAnnouncement?: string;
  testID?: string;
  /** Placement only. */
  class?: string;
}
```

## Guidelines

- Use IconButton only for actions whose icon is universally understood (close, copy, edit, more); otherwise use a Button with a label.
- Write `accessibilityLabel` as the action and its object ("Copy payment ID", "Close dialog"), not the icon's name.
- Use `emphasis="subtle"` on dark or brand-coloured surfaces only.
- Turn on `isHighlighted` where the button sits alone and needs a visible hover target, such as a toolbar.
- Return the request's promise from `onClick` to show the spinner, instead of managing `isLoading`.
- Wrap it in a Tooltip when the icon's meaning is not obvious.
- Don't use Button with only an `icon` where an IconButton fits: IconButton is the borderless glyph.

## Examples

### Sizes, emphasis and the highlight box

```svelte
<script lang="ts">
  import { IconButton } from '@razorpay/blade-svelte/components';
  import { CloseIcon, EditIcon, MoreVerticalIcon } from '@razorpay/blade-svelte/icons';
</script>

<div class="flex flex-col gap-blade-4">
  <div class="flex items-center gap-blade-4">
    <IconButton icon={EditIcon} size="small" accessibilityLabel="Edit address" />
    <IconButton icon={MoreVerticalIcon} isHighlighted accessibilityLabel="More actions" />
    <IconButton icon={CloseIcon} size="large" accessibilityLabel="Close" />
  </div>
  <div class="flex items-center gap-blade-4 rounded-medium bg-feedback-neutral-intense p-blade-4">
    <IconButton icon={CloseIcon} emphasis="subtle" isHighlighted accessibilityLabel="Dismiss banner" />
  </div>
</div>
```

### Busy while copying

```svelte
<script lang="ts">
  import { IconButton, Text, showToast } from '@razorpay/blade-svelte/components';
  import { CopyIcon } from '@razorpay/blade-svelte/icons';

  async function copy(): Promise<void> {
    await navigator.clipboard.writeText('pay_Q1w2e3r4t5y6u7');
    void showToast({ content: 'Payment ID copied', color: 'positive' });
  }
</script>

<div class="flex items-center gap-blade-2">
  <Text>pay_Q1w2e3r4t5y6u7</Text>
  <IconButton icon={CopyIcon} size="small" accessibilityLabel="Copy payment ID" loadingAnnouncement="Copying" onClick={copy} />
</div>
```

### A close button in a card corner

```svelte
<script lang="ts">
  import { IconButton, Text } from '@razorpay/blade-svelte/components';
  import { CloseIcon } from '@razorpay/blade-svelte/icons';

  let isVisible = $state(true);
</script>

{#if isVisible}
  <div class="relative rounded-medium bg-surface-gray-intense p-blade-5 surface-raised">
    <IconButton
      icon={CloseIcon}
      accessibilityLabel="Dismiss tip"
      class="absolute top-blade-3 right-blade-3"
      onClick={() => (isVisible = false)}
    />
    <Text>Enable instant settlements to receive money in minutes.</Text>
  </div>
{/if}
```
