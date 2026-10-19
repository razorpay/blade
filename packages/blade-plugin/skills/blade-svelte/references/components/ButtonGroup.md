## Component Name

ButtonGroup

## Description

ButtonGroup joins related Buttons into one row, such as a split of actions or a set of time ranges, with only the outer corners rounded and a 1px seam between filled buttons (outlined ones share their rims). It sets one `variant`, `size` and `color` for every Button inside it and can disable them all at once. It is a `role="group"`, not a toolbar: each button keeps its own Tab stop.

## Important Constraints

- `children` is the Buttons, written directly inside the group
- The group's `variant`, `size` and `color` override each Button's own; set them on the group, not the Buttons
- `isDisabled` disables every button; a button may still disable itself
- It does not track a selection: for picking one of several options use SegmentedControl, Tabs or ChipGroup
- It is as wide as its buttons; there is no `isFullWidth`: make it full width with `class="w-full [&>*]:flex-1"`
- `class` places it

## Props

```typescript
interface ButtonGroupProps {
  /** Every button's variant: `primary` is filled, `secondary` outlined. @default 'primary' */
  variant?: 'primary' | 'secondary';
  /** Every button's size. @default 'medium' */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  /** Every button's colour. @default 'primary' */
  color?: 'primary' | 'white' | 'neutral' | 'positive' | 'negative';
  /** Disables every button, on top of each one's own. @default false */
  isDisabled?: boolean;
  /** The Buttons: their variant, size and colour are the group's. */
  children: Snippet;
  testID?: string;
  /** Placement only. */
  class?: string;
}
```

## Guidelines

- Group two to four closely related actions; more becomes hard to scan.
- Use `variant="secondary"` for a row of equal-weight actions, and a filled group for a primary action with its options.
- Give each Button its own `onClick`; the group adds no behaviour.
- Icon-only Buttons (`icon` with an `accessibilityLabel`) can sit in a group, for instance next to a labelled one.
- Don't use it as a selector that shows which option is chosen; use SegmentedControl.
- Don't set `variant`, `size` or `color` on the Buttons inside: the group's win.

## Examples

### Outlined actions

```svelte
<script lang="ts">
  import { Button, ButtonGroup } from '@razorpay/blade-svelte/components';
  import { DownloadIcon, ShareIcon } from '@razorpay/blade-svelte/icons';
</script>

<ButtonGroup variant="secondary" color="neutral" size="small">
  <Button icon={DownloadIcon}>Download</Button>
  <Button icon={ShareIcon}>Share</Button>
  <Button>Print</Button>
</ButtonGroup>
```

### A primary action with a menu button

```svelte
<script lang="ts">
  import { Button, ButtonGroup } from '@razorpay/blade-svelte/components';
  import { ChevronDownIcon } from '@razorpay/blade-svelte/icons';

  function createLink(): void {
    console.log('create');
  }
</script>

<ButtonGroup>
  <Button onClick={createLink}>Create payment link</Button>
  <Button icon={ChevronDownIcon} accessibilityLabel="More ways to create" />
</ButtonGroup>
```

### Full width and disabled

```svelte
<script lang="ts">
  import { Button, ButtonGroup } from '@razorpay/blade-svelte/components';

  let isSaving = $state(false);
</script>

<ButtonGroup variant="secondary" isDisabled={isSaving} class="w-full [&>*]:flex-1">
  <Button>Day</Button>
  <Button>Week</Button>
  <Button>Month</Button>
</ButtonGroup>
```
