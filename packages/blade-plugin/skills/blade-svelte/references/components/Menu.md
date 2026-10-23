## Component Name

Menu

## Description

Menu is the floating panel of actions that opens from its trigger (a "more" IconButton, a Button), with an ActionList inside whose pick runs an action and closes the menu. It has Blade's Menu look: 12px round, 240 to 400px wide, 8px from the trigger at `bottom-start` by default, flipping when there is no room, with no close button. A click or ArrowDown / ArrowUp on the trigger opens it, focus lands on the first focusable element inside, and Escape or a press outside dismisses it; the page stays live, with no scrim.

## Important Constraints

- `children` is the trigger, rendered in a wrapper that opens the menu on a click (and ArrowDown or ArrowUp) and stamps `aria-haspopup`, `aria-expanded` and `aria-controls`: the trigger wires nothing
- There is no `MenuItem`, `MenuDivider` or `onSelect`: put an `ActionList` of `ActionListItem`s in `body`, and call the `close` that `body` receives from its `onPick`; a `Divider` separates groups
- The panel is a `dialog` holding whatever you put in it; there is no `role`, `closeLabel` or `pace` on Menu
- A menu without a `title` needs `accessibilityLabel` (name it as the trigger is named)
- `onDismiss({ source, close })` reports `blur` (a press outside) or `escape`; `onOpenChange({ isOpen })` reports every open and close
- A select dropdown is not ported: a pick of a value is an ActionList on the page, in a BottomSheet or in a Menu
- It renders into the overlay host of the app's BladeProvider (the examples assume the app has one)

## Props

```typescript
type Placement =
  | 'top' | 'bottom' | 'left' | 'right'
  | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'
  | 'left-start' | 'left-end' | 'right-start' | 'right-end';
type DismissSource = 'cross' | 'blur' | 'escape' | 'back' | 'drag';

interface MenuProps {
  /** Bindable: open it from code too. @default false */
  isOpen?: boolean;
  /** The trigger. `isOpen` is there to read (a chevron that flips). */
  children: Snippet<[{ isOpen: boolean }]>;
  /** Where the panel sits against the trigger; it flips when this side lacks room. @default 'bottom-start' */
  placement?: Placement;
  /** The trigger does not open it. @default false */
  isDisabled?: boolean;
  /** Every open and close, whoever asked. */
  onOpenChange?: (change: { isOpen: boolean }) => void;
  /** Every user dismissal; `close` ends a non-dismissible one. */
  onDismiss?: (event: { source: DismissSource; close: () => void }) => void;
  /** The exit animation finished and the panel left the DOM. */
  onClosed?: () => void;
  /** Whether a dismissal closes it by itself. @default true */
  isDismissible?: boolean;
  /** A zero-height box on the panel's top edge. */
  chrome?: Snippet<[{ close: () => void }]>;
  /** Names the panel when it has no `title`. */
  accessibilityLabel?: string;
  /** Lands on the panel. */
  testID?: string;
  /** Placement only, on the panel. */
  class?: string;
  /** A heading over the rows; it names the dialog. */
  title?: string | Snippet;
  /** One muted line under the title. */
  subtitle?: string;
  /** Before the title: an icon or a snippet (an asset). */
  leading?: IconSource | Snippet;
  /** Beside the title: a Counter or a Badge. */
  titleSuffix?: Snippet;
  /** After the title block. */
  trailing?: Snippet<[{ close: () => void }]>;
  /** Replaces the drawn title block: receives the title and subtitle as snippets to place. */
  header?: Snippet<[{ title: Snippet; subtitle: Snippet; close: () => void }]>;
  /** The rows' box: an ActionList whose `onPick` calls `close`. Ignored with `content`. */
  body?: Snippet<[{ close: () => void }]>;
  /** Under the body. */
  footer?: Snippet<[{ close: () => void }]>;
  /** Raw content in place of `body` and `footer`: no padding, it owns its box. */
  content?: Snippet<[{ close: () => void }]>;
  /** A back button first in the header: a step back, not a dismissal. @default false */
  showBackButton?: boolean;
  onBackButtonClick?: (event: { close: () => void }) => void;
  /** @default 'Back' */
  backLabel?: string;
  /** The sections' padding; `none` for a body that owns its box. @default 'default' */
  padding?: 'default' | 'none';
}
```

## Guidelines

- Use Menu for a short list of actions on one thing (edit, copy, remove); use Popover to explain something and a BottomSheet for a long pick list.
- Close the menu in the ActionList's `onPick`, after running the action.
- Put a destructive action last, after a `Divider`, with `intent="negative"` on its ActionListItem.
- Use the same text for the trigger's `accessibilityLabel` and the menu's.
- Don't nest a menu in a menu: there are no submenus.

## Examples

### Actions on a row

```svelte
<script lang="ts">
  import { ActionList, ActionListItem, Divider, IconButton, Menu } from '@razorpay/blade-svelte/components';
  import { CopyIcon, EditIcon, MoreHorizontalIcon, TrashIcon } from '@razorpay/blade-svelte/icons';

  let { onAction }: { onAction: (action: string) => void } = $props();
</script>

<Menu accessibilityLabel="Address actions" placement="bottom-end">
  {#snippet children()}
    <IconButton icon={MoreHorizontalIcon} accessibilityLabel="Address actions" />
  {/snippet}
  {#snippet body({ close })}
    <ActionList onPick={({ value }) => { onAction(value as string); close(); }}>
      <ActionListItem value="edit" title="Edit address" leading={EditIcon} />
      <ActionListItem value="copy" title="Copy address" leading={CopyIcon} />
      <Divider />
      <ActionListItem value="remove" title="Remove" leading={TrashIcon} intent="negative" />
    </ActionList>
  {/snippet}
</Menu>
```

### A Button trigger with a chevron

```svelte
<script lang="ts">
  import { ActionList, ActionListItem, Button, Menu } from '@razorpay/blade-svelte/components';
  import { ChevronDownIcon, ChevronUpIcon, DownloadIcon, ShareIcon } from '@razorpay/blade-svelte/icons';

  let last = $state('');
</script>

<Menu accessibilityLabel="Invoice actions">
  {#snippet children({ isOpen })}
    <Button variant="secondary" trailingIcon={isOpen ? ChevronUpIcon : ChevronDownIcon}>Invoice</Button>
  {/snippet}
  {#snippet body({ close })}
    <ActionList onPick={({ value }) => { last = value as string; close(); }}>
      <ActionListItem value="download" title="Download PDF" leading={DownloadIcon} />
      <ActionListItem value="share" title="Share link" leading={ShareIcon} />
    </ActionList>
  {/snippet}
</Menu>
```
