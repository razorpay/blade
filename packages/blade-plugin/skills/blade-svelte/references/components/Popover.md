## Component Name

Popover

## Description

Popover is a non-modal panel that opens on a click of its trigger and hangs beside it with an arrow, for a short explanation or a small action next to the thing it is about. Its content is props and snippets: a `title` that names it, `subtitle`, `leading`, `body` (padded 16px) and `footer`, or raw `content` in their place. It is 16px round, at most 288px wide (328px on desktop), sits at `top` of the trigger by default and flips when there is no room; Escape, a press outside and its close button dismiss it, and the page stays live with no scrim.

## Important Constraints

- `children` is the trigger (a Button or an IconButton), rendered in a wrapper that opens the popover on a click and stamps `aria-haspopup`, `aria-expanded` and `aria-controls`: the trigger wires nothing and takes no `onClick` for opening
- It opens on click only, never on hover; for a hover hint use Tooltip
- `body` and `footer` are snippets that receive `{ close }`; `content` replaces both with raw content that owns its box (no padding)
- `onDismiss({ source, close })` reports `cross`, `blur` (a press outside) or `escape`; `onOpenChange({ isOpen })` reports every open and close, the trigger's included
- A popover without a `title` needs `accessibilityLabel`; the panel is a `dialog`, or an `alertdialog` with `role="alertdialog"` for one that asks to confirm
- `class` lands on the panel and only places it; there is no `maxWidth`
- It renders into the overlay host of the app's BladeProvider (the examples assume the app has one)

## Props

```typescript
type Placement =
  | 'top' | 'bottom' | 'left' | 'right'
  | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'
  | 'left-start' | 'left-end' | 'right-start' | 'right-end';
type DismissSource = 'cross' | 'blur' | 'escape' | 'back' | 'drag';

interface PopoverProps {
  /** Bindable: open it from code too. @default false */
  isOpen?: boolean;
  /** The trigger. `isOpen` is there to read (a chevron that flips). */
  children: Snippet<[{ isOpen: boolean }]>;
  /** Where the panel sits against the trigger; it flips when this side lacks room. @default 'top' */
  placement?: Placement;
  /** The trigger does not open it. @default false */
  isDisabled?: boolean;
  /** Every open and close, whoever asked. */
  onOpenChange?: (change: { isOpen: boolean }) => void;
  /** Every user dismissal; `close` ends a non-dismissible one. */
  onDismiss?: (event: { source: DismissSource; close: () => void }) => void;
  /** The exit animation finished and the panel left the DOM. */
  onClosed?: () => void;
  /** Whether a dismissal closes it by itself, and whether the close button shows. @default true */
  isDismissible?: boolean;
  /** `alertdialog` for a popover that asks to confirm. @default 'dialog' */
  role?: 'dialog' | 'alertdialog';
  /** A zero-height box on the panel's top edge, beside the close button. */
  chrome?: Snippet<[{ close: () => void }]>;
  /** The close button's accessible name. @default 'Close' */
  closeLabel?: string;
  /** Names the panel when it has no `title`. */
  accessibilityLabel?: string;
  /** An element inside, bound with `bind:this`, that takes focus on open in place of the close button. */
  initialFocusRef?: HTMLElement | null;
  /** Lands on the panel. */
  testID?: string;
  /** Placement only, on the panel. */
  class?: string;
  /** The heading; it names the dialog. */
  title?: string | Snippet;
  /** One muted line under the title. */
  subtitle?: string;
  /** Before the title: an icon (a 20px glyph) or a snippet (an asset). */
  leading?: IconSource | Snippet;
  /** Beside the title: a Counter or a Badge. */
  titleSuffix?: Snippet;
  /** After the title block. */
  trailing?: Snippet<[{ close: () => void }]>;
  /** Replaces the drawn title block: receives the title and subtitle as snippets to place. */
  header?: Snippet<[{ title: Snippet; subtitle: Snippet; close: () => void }]>;
  /** The padded body. Ignored with `content`. */
  body?: Snippet<[{ close: () => void }]>;
  /** Under the body; you lay out the actions. */
  footer?: Snippet<[{ close: () => void }]>;
  /** Raw content in place of `body` and `footer`: no padding, it owns its box. */
  content?: Snippet<[{ close: () => void }]>;
  /** A back button first in the header: a step back, not a dismissal. @default false */
  showBackButton?: boolean;
  onBackButtonClick?: (event: { close: () => void }) => void;
  /** @default 'Back' */
  backLabel?: string;
  /** `none`: the body is a bare column its content fills, edge to edge. @default 'default' */
  padding?: 'default' | 'none';
}
```

## Guidelines

- Use Popover for a short explanation or one small action anchored to a control ("Why a fee?"); use Tooltip for a one-line hint and Modal for anything the user must complete.
- Put text in `body` as `<Text size="small">`; there is no string `content` prop.
- Keep it to a few lines and at most one or two footer actions.
- Close from an action with the `close` its snippet receives.
- Don't put a form or a long list in a popover: use a BottomSheet or a Modal.
- Don't wire `onClick` on the trigger to open it: the wrapper does.

## Examples

### An explanation with a footer action

```svelte
<script lang="ts">
  import { Button, Popover, Text } from '@razorpay/blade-svelte/components';
  import { InfoIcon } from '@razorpay/blade-svelte/icons';
</script>

<Popover title="Convenience fee" leading={InfoIcon}>
  {#snippet children()}
    <Button variant="secondary" size="small">Why a fee?</Button>
  {/snippet}
  {#snippet body()}
    <Text size="small">Your bank charges 2% for this card. It goes to the bank, not to the merchant.</Text>
  {/snippet}
  {#snippet footer({ close })}
    <div class="flex justify-end">
      <Button size="small" onClick={close}>Got it</Button>
    </div>
  {/snippet}
</Popover>
```

### An icon trigger, placed below, with no title

```svelte
<script lang="ts">
  import { IconButton, Popover, Text } from '@razorpay/blade-svelte/components';
  import { HelpCircleIcon } from '@razorpay/blade-svelte/icons';
</script>

<Popover placement="bottom-start" accessibilityLabel="About UPI Autopay">
  {#snippet children()}
    <IconButton icon={HelpCircleIcon} accessibilityLabel="About UPI Autopay" />
  {/snippet}
  {#snippet body()}
    <Text size="small">The amount is debited on the same date every month. Cancel any time from your UPI app.</Text>
  {/snippet}
</Popover>
```

### Bound open state

```svelte
<script lang="ts">
  import { Button, Popover, Text } from '@razorpay/blade-svelte/components';
  import { ChevronDownIcon, ChevronUpIcon } from '@razorpay/blade-svelte/icons';

  let isOpen = $state(false);
</script>

<Popover bind:isOpen title="Offers" placement="bottom">
  {#snippet children({ isOpen })}
    <Button variant="secondary" trailingIcon={isOpen ? ChevronUpIcon : ChevronDownIcon}>2 offers</Button>
  {/snippet}
  {#snippet body()}
    <Text size="small">10% cashback on HDFC cards. No cost EMI above ₹3,000.</Text>
  {/snippet}
</Popover>
```
