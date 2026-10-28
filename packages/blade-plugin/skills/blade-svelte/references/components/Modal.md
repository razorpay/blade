## Component Name

Modal

## Description

Modal is the centred dialog for a focused task or a confirmation, opened from code through a bound `isOpen` and composed from ModalHeader, ModalBody and ModalFooter. On desktop (`d`) it is a 400, 760 or 1024px column (`size`), or `full` to fill the overlay host 8px in; below desktop every size spans the host. It sits over the one scrim BladeProvider's overlay host draws, traps focus, closes on Escape, a press on the scrim, its close button and `back()`, and returns focus to whatever had it when it opened.

## Important Constraints

- Modal has no trigger: open it by setting the bound `isOpen` (a Button's `onClick`); `children` is its content, not a trigger
- It renders into the overlay host of the app's BladeProvider (the examples assume the app has one); without a provider it renders in place, unscrimmed
- Compose the content from `ModalHeader`, `ModalBody` and `ModalFooter`; there is no `title`, `body` or `footer` prop on Modal, and no `variant` (a sheet is BottomSheet, a side panel Drawer)
- `onDismiss({ source, close, preventDefault })` fires on every user dismissal (`cross`, `blur`, `escape`, `back`); `preventDefault()` keeps it open this time (ask first, then `close()`); with `isDismissible={false}` the modal stays open until `close` is called, and the close button is hidden
- `onOpenChange` reports only the closes the modal makes itself, never your own write to `isOpen`
- A modal without a ModalHeader title needs `accessibilityLabel` to be named
- `class` lands on the panel and only places it; `classes={{ root, panel }}` replaces where the panel sits in the host and its look

## Props

```typescript
type ModalSize = 'small' | 'medium' | 'large' | 'full';
type ModalPace = 'default' | 'snappy';
type DismissSource = 'cross' | 'blur' | 'escape' | 'back' | 'drag';

interface ModalProps {
  /** Bindable. Written `false` whenever the modal closes itself. @default false */
  isOpen?: boolean;
  /** Every user dismissal, dismissible or not; `close` ends a non-dismissible one. */
  onDismiss?: (event: { source: DismissSource; close: () => void }) => void;
  /** It opened or closed by itself (a dismissal or `close`), not when you set `isOpen`. */
  onOpenChange?: (change: { isOpen: boolean }) => void;
  /** The exit animation finished and the modal left the DOM. */
  onClosed?: () => void;
  /** Whether a dismissal closes it by itself, and whether the close button shows. @default true */
  isDismissible?: boolean;
  /** @default 'dialog' */
  role?: 'dialog' | 'alertdialog';
  /** The content: ModalHeader, ModalBody, ModalFooter. `close` closes without a dismissal. */
  children?: Snippet<[{ close: () => void }]>;
  /** A zero-height box on the panel's top edge, unclipped; what goes in positions itself (`absolute bottom-full`). */
  chrome?: Snippet<[{ close: () => void }]>;
  /** The close button's accessible name. @default 'Close' */
  closeLabel?: string;
  /** Names the modal when its header has no title. */
  accessibilityLabel?: string;
  /** An element inside, bound with `bind:this`, that takes focus on open in place of the panel. */
  initialFocusRef?: HTMLElement | null;
  /** Lands on the panel (the element with the dialog role). */
  testID?: string;
  /** `root`: the panel's alignment and gutter in the host; `panel`: its look and size. Or a function rewriting every class. */
  classes?: { root?: string; panel?: string } | ((classes: ModalClasses) => ModalClasses);
  /** Placement only, merged last onto the panel. */
  class?: string;
  /** Desktop width: 400, 760 or 1024px, or `full` (the host, 8px in, full height). @default 'small' */
  size?: ModalSize;
  /** `snappy`: an expo-out easing; both run 280ms. @default 'default' */
  pace?: ModalPace;
}

interface ModalHeaderProps {
  /** Names the modal. */
  title?: string | Snippet;
  /** One muted line under the title; it describes the modal. */
  subtitle?: string;
  /** Before the title: an icon (a 20px glyph) or a snippet (an asset or avatar in a 32px slot). */
  leading?: IconSource | Snippet;
  /** Beside the title: a Counter or a Badge. */
  titleSuffix?: Snippet;
  /** After the title block, clear of the close button: a Badge, text, a Link or an action. Receives `close`, which closes the overlay without a dismissal. */
  trailing?: Snippet<[{ close: () => void }]>;
  testID?: string;
  /** Placement only. */
  class?: string;
}

interface ModalBodyProps {
  /** 20px all round, or none for content with its own scroll box. @default 'spacing.6' */
  padding?: 'spacing.6' | 'spacing.0';
  testID?: string;
  /** Placement only (a fixed height, say). */
  class?: string;
  children: Snippet;
}

interface ModalFooterProps {
  testID?: string;
  /** Placement only. */
  class?: string;
  /** The actions; you lay them out (a flex row of Buttons). */
  children: Snippet;
}
```

## Guidelines

- Use Modal for a short task or a confirmation that needs the user's answer before going on; use BottomSheet on phone-first flows and Drawer for a side panel of filters or details.
- Give every modal a `ModalHeader` with a `title`; it names the dialog for screen readers.
- Lay the footer out yourself: a `flex justify-end gap-blade-4` row with one primary Button and a secondary one.
- Use `isDismissible={false}` (and `role="alertdialog"`) only when the user must choose; handle `onDismiss` and call `close` when the choice is made.
- Close from inside with the `close` that `children({ close })` receives, or by setting `isOpen = false`.
- Don't nest a Modal inside another's markup to stack them: render both side by side and open the second from the first; they stack on the layer stack and share one scrim.
- Don't restyle the panel through `class`; use `size`, or `classes.panel` when the layout must change.

## Examples

### A confirmation

```svelte
<script lang="ts">
  import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Text } from '@razorpay/blade-svelte/components';

  let isOpen = $state(false);
</script>

<Button color="negative" variant="secondary" onClick={() => (isOpen = true)}>Remove card</Button>

<Modal bind:isOpen>
  <ModalHeader title="Remove this card?" subtitle="Card ending 1111" />
  <ModalBody>
    <Text color="muted">You will need to add it again to pay with it.</Text>
  </ModalBody>
  <ModalFooter>
    <div class="flex justify-end gap-blade-4">
      <Button variant="secondary" onClick={() => (isOpen = false)}>Cancel</Button>
      <Button color="negative" onClick={() => (isOpen = false)}>Remove</Button>
    </div>
  </ModalFooter>
</Modal>
```

### A header with a leading icon, a suffix and a trailing item

```svelte
<script lang="ts">
  import { Badge, Button, Counter, Modal, ModalBody, ModalHeader, Text } from '@razorpay/blade-svelte/components';
  import { CreditCardIcon } from '@razorpay/blade-svelte/icons';

  let isOpen = $state(false);
</script>

<Button variant="secondary" onClick={() => (isOpen = true)}>Saved cards</Button>

<Modal bind:isOpen size="medium">
  <ModalHeader title="Saved cards" leading={CreditCardIcon}>
    {#snippet titleSuffix()}<Counter value={3} />{/snippet}
    {#snippet trailing()}<Badge color="positive">Secure</Badge>{/snippet}
  </ModalHeader>
  <ModalBody>
    <Text>Cards are tokenised and stored with your bank's approval.</Text>
  </ModalBody>
</Modal>
```

### A required choice: not dismissible

```svelte
<script lang="ts">
  import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Text } from '@razorpay/blade-svelte/components';

  let { isOpen = $bindable(false) }: { isOpen?: boolean } = $props();
  let choice = $state<'stay' | 'leave' | null>(null);
</script>

<Modal bind:isOpen isDismissible={false} role="alertdialog">
  {#snippet children({ close })}
    <ModalHeader title="Leave without paying?" />
    <ModalBody>
      <Text color="muted">Your order will be held for 10 minutes.</Text>
    </ModalBody>
    <ModalFooter>
      <div class="flex justify-end gap-blade-4">
        <Button variant="secondary" onClick={() => { choice = 'leave'; close(); }}>Leave</Button>
        <Button onClick={() => { choice = 'stay'; close(); }}>Continue paying</Button>
      </div>
    </ModalFooter>
  {/snippet}
</Modal>
```

### Placed in the host and logging how it closed

```svelte
<script lang="ts">
  import { Button, Modal, ModalBody, ModalHeader, Text } from '@razorpay/blade-svelte/components';

  let isOpen = $state(false);
  let lastSource = $state('');
</script>

<Button onClick={() => (isOpen = true)}>Fees</Button>

<!-- `classes.root` moves the panel to the host's top-right corner. -->
<Modal
  bind:isOpen
  classes={{ root: 'items-start justify-end p-blade-7' }}
  onDismiss={({ source }) => (lastSource = source)}
>
  <ModalHeader title="Convenience fee" />
  <ModalBody><Text>2% on credit cards, charged by your bank.</Text></ModalBody>
</Modal>
```
