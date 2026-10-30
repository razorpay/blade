## Component Name

Drawer

## Description

Drawer is a full-height dialog docked to the right edge (or the left, `side="left"`) for filters, details or a side flow, opened from a bound `isOpen` and composed from DrawerHeader, DrawerBody and DrawerFooter. It is 24px short of the host's width on phones and 380px wide on desktop (`d`), where it floats 8px in with large corners, sliding in from its edge. It shares Modal's behaviour: the scrim, the focus trap, Escape, `back()`, and focus returning to what had it.

## Important Constraints

- Drawer has no trigger: open it by setting the bound `isOpen`; `children` is its content
- It renders into the overlay host of the app's BladeProvider (the examples assume the app has one)
- Compose the content from `DrawerHeader`, `DrawerBody` and `DrawerFooter`; there is no `size` (its width is fixed) and no back button (that is BottomSheetHeader's)
- `isDraggable` (default `false`) lets it be dragged toward its own edge by its header, reporting `onDismiss({ source: 'drag' })`; there is no handle
- `onDismiss({ source, close, preventDefault })` fires on every user dismissal; `preventDefault()` keeps it open this time (ask first, then `close()`). With `isDismissible={false}` the close button is hidden and it stays open until `close` is called
- Drawer reads only its own provider defaults (`defaults={{ Drawer: { side: 'left' } }}`), never Modal's

## Props

```typescript
type DismissSource = 'cross' | 'blur' | 'escape' | 'back' | 'drag';
type Intent = 'neutral' | 'information' | 'positive' | 'notice' | 'negative';

interface DrawerProps {
  /** Bindable. Written `false` whenever the drawer closes itself. @default false */
  isOpen?: boolean;
  /** Every user dismissal, dismissible or not; `close` ends a non-dismissible one. */
  onDismiss?: (event: { source: DismissSource; close: () => void }) => void;
  /** It opened or closed by itself (a dismissal or `close`), not when you set `isOpen`. */
  onOpenChange?: (change: { isOpen: boolean }) => void;
  /** The exit animation finished and the drawer left the DOM. */
  onClosed?: () => void;
  /** Whether a dismissal closes it by itself, and whether the close button shows. @default true */
  isDismissible?: boolean;
  /** @default 'dialog' */
  role?: 'dialog' | 'alertdialog';
  /** The content: DrawerHeader, DrawerBody, DrawerFooter. `close` closes without a dismissal. */
  children?: Snippet<[{ close: () => void }]>;
  /** A zero-height box on the panel's top edge, beside the close button; what goes in positions itself. */
  chrome?: Snippet<[{ close: () => void }]>;
  /** The close button's accessible name. @default 'Close' */
  closeLabel?: string;
  /** Names the drawer when its header has no title. */
  accessibilityLabel?: string;
  /** An element inside, bound with `bind:this`, that takes focus on open in place of the panel. */
  initialFocusRef?: HTMLElement | null;
  /** Lands on the panel (the element with the dialog role). */
  testID?: string;
  /** `root`: where the panel sits in the host; `panel`: its look and width (keep `translate-x-0` for the drag). Or a function rewriting every class. */
  classes?: { root?: string; panel?: string } | ((classes: ModalClasses) => ModalClasses);
  /** Placement only, merged last onto the panel. */
  class?: string;
  /** The edge it docks to and slides in from. @default 'right' */
  side?: 'right' | 'left';
  /** `snappy`: an expo-out easing; both run 280ms. @default 'default' */
  pace?: 'default' | 'snappy';
  /** Dragged toward its edge to dismiss, by its header. @default false */
  isDraggable?: boolean;
}

interface DrawerHeaderProps {
  /** Names the drawer. */
  title?: string | Snippet;
  /** One muted line under the title; it describes the drawer. */
  subtitle?: string;
  /** Before the title: an icon (a 20px glyph) or a snippet (an asset or avatar in a 32px slot). */
  leading?: IconSource | Snippet;
  /** Beside the title: a Counter or a Badge. */
  titleSuffix?: Snippet;
  /** After the title block: a Badge, text, a Link or an action. Receives `close`, which closes the overlay without a dismissal. */
  trailing?: Snippet<[{ close: () => void }]>;
  /** A feedback colour's subtle fill behind the header. */
  color?: Intent;
  /** A hairline under the header. @default false */
  showDivider?: boolean;
  /** Under the title row, inside the header: a search field, a stepper. */
  children?: Snippet;
  testID?: string;
  /** Placement only. */
  class?: string;
}

interface DrawerBodyProps {
  /** 20px all round, or none for content with its own scroll box. @default 'spacing.6' */
  padding?: 'spacing.6' | 'spacing.0';
  testID?: string;
  /** Placement only. */
  class?: string;
  children: Snippet;
}

interface DrawerFooterProps {
  /** A hairline above the actions. @default true */
  showDivider?: boolean;
  testID?: string;
  /** Placement only. */
  class?: string;
  /** The actions; you lay them out. */
  children: Snippet;
}
```

## Guidelines

- Use Drawer for filters, order details or settings that sit beside the page; use Modal for a short centred task and BottomSheet for phone-first pickers.
- Give it a `DrawerHeader` with a `title`; it names the dialog.
- Use the header's `color` for a status the whole drawer is about (a failed payment), not decoration.
- Put the actions in `DrawerFooter`, the primary one full width or right-aligned in a `flex gap-blade-4` row.
- Use `side="left"` for navigation-like content; keep the right edge for details and filters.
- Don't restyle the panel's width through `class`; change it through `classes.panel` only when the layout requires it.

## Examples

### Filters

```svelte
<script lang="ts">
  import { Button, Checkbox, Drawer, DrawerBody, DrawerFooter, DrawerHeader } from '@razorpay/blade-svelte/components';
  import { FilterIcon } from '@razorpay/blade-svelte/icons';

  let isOpen = $state(false);
  let showRefunds = $state(true);
  let showFailed = $state(false);
</script>

<Button variant="secondary" icon={FilterIcon} onClick={() => (isOpen = true)}>Filters</Button>

<Drawer bind:isOpen>
  <DrawerHeader title="Filters" subtitle="Narrow down your transactions" />
  <DrawerBody>
    <div class="flex flex-col gap-blade-4">
      <Checkbox bind:isChecked={showRefunds}>Refunds</Checkbox>
      <Checkbox bind:isChecked={showFailed}>Failed payments</Checkbox>
    </div>
  </DrawerBody>
  <DrawerFooter>
    <div class="flex justify-end gap-blade-4">
      <Button variant="secondary" onClick={() => { showRefunds = false; showFailed = false; }}>Clear</Button>
      <Button onClick={() => (isOpen = false)}>Apply</Button>
    </div>
  </DrawerFooter>
</Drawer>
```

### A tinted header on the left edge, draggable

```svelte
<script lang="ts">
  import { Badge, Button, Drawer, DrawerBody, DrawerHeader, Text } from '@razorpay/blade-svelte/components';

  let isOpen = $state(false);
</script>

<Button variant="secondary" onClick={() => (isOpen = true)}>Payment details</Button>

<Drawer bind:isOpen side="left" isDraggable>
  <DrawerHeader title="Payment failed" subtitle="pay_29QQoUBi66xm2f" color="negative" showDivider>
    {#snippet titleSuffix()}<Badge color="negative">Failed</Badge>{/snippet}
  </DrawerHeader>
  <DrawerBody>
    <Text>The bank declined the payment. No money was debited.</Text>
  </DrawerBody>
</Drawer>
```
